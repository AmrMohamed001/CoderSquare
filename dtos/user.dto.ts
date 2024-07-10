export interface User {
	id: string;
	firstname: string;
	lastname: string;
	username: string;
	email: string;
	password: string | undefined;
	password_changed_at: string;
	reset_code: string;
	reset_code_expire: string;
	created_at: string;
	updated_at: string;
}
