export class Api {
	//note: fix any
	public query: any = {};
	constructor(public reqQuery: any) {}

	filter() {
		//remove fields that not related to schema
		let qCopy = { ...this.reqQuery };
		const exclude = ['limit', 'page', 'fields', 'sort', 'search'];
		exclude.forEach((ele) => delete qCopy[ele]);

		if (JSON.stringify(qCopy) !== '{}') this.query.where = qCopy;
		return this;
	}

	sort() {
		if (this.reqQuery.sort) this.query.sort = this.reqQuery.sort;
		else this.query.sort = 'created_at DESC';
		return this;
	}

	select() {
		if (this.reqQuery.fields) this.query.fields = this.reqQuery.fields;
		else this.query.fields = '*';
		return this;
	}

	pagination() {
		this.query.page = +this.reqQuery.page || 1;
		this.query.limit = +this.reqQuery.limit || 10;
		this.query.offset = (this.query.page - 1) * this.query.limit;
		return this;
	}

	search(searchFields: string[]) {
		if (this.reqQuery.search) {
			const searchTerm = this.reqQuery.search.toLowerCase();
			const searchConditions = searchFields
				.map((field) => `${field} ILIKE '%${searchTerm}%'`)
				.join(' OR ');
			console.log(searchTerm);
			console.log(searchConditions);

			if (this.query.where) {
				this.query.where += ` AND (${searchConditions})`;
			} else {
				this.query.where = `(${searchConditions})`;
			}
		}

		return this;
	}

	buildQuery(tableName: string) {
		const { where, sort, fields, offset, limit } = this.query;

		let queryStr = `
		SELECT ${fields},COALESCE(likes_count.likes, 0) as likes
		FROM ${tableName} 
		LEFT JOIN (
    SELECT 
        posts.id, 
        COUNT(likes.postid) AS likes
    FROM 
        posts 
    LEFT JOIN likes 
    ON posts.id = likes.postid 
    GROUP BY posts.id
	) AS likes_count 
	ON posts.id = likes_count.id
		`;
		if (where) {
			let arr: string[] | string = [];
			if (where.includes('ILIKE')) arr.push(where);
			else {
				for (let key in where) {
					let value = where[key];
					let operator = '=';

					// Check if the key contains a comparison operator
					if (key.includes('>') || key.includes('<') || key.includes('!')) {
						// Extract the operator and the actual key
						const match = key.match(/(>=|<=|>|<|!=|=)/);
						if (match) {
							operator = match[0];
							key = key.replace(operator, '').trim();
						}
					} else if (isNaN(value)) {
						arr.push(`${key} ${operator} '${value}'`);
						console.log(arr);
					} else {
						arr.push(`${key} ${operator} ${parseInt(value)}`);
					}
				}
			}

			arr = arr.join(' AND ');
			queryStr += 'WHERE ' + arr;
		}

		if (sort) queryStr += ` ORDER BY ${sort}`;

		if (limit) queryStr += ` LIMIT ${limit}`;
		if (offset) queryStr += ` OFFSET  ${offset}`;

		// Clean up potential double spaces
		queryStr = queryStr.replace(/\s+/g, ' ').trim();

		console.log(queryStr);
		return queryStr;
	}
}
/*
test 3
test 4
test 11
test 111
*/
