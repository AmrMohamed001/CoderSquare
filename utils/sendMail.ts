import nodemailer from 'nodemailer';
import pug from 'pug';
import htmlToText from 'html-to-text';
///////////////////////////////////////////

export class Email {
	to: string;
	from: string;
	firstName: any;
	constructor(
		public user: { email: string; firstname: any },
		public code: string
	) {
		this.to = user.email;
		this.from = 'admin@codersquare.io';
		this.firstName = user.firstname;
	}

	transporter() {
		// sendGrip
		return nodemailer.createTransport({
			service: 'gmail',
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			auth: {
				user: 'amrmoha960@gmail.com',
				pass: 'sdge hwwj ohwg mkln',
			},
		});
	}

	async send(templete: string, subject: string): Promise<void> {
		// 1) Render html based on pug template
		const html = pug.renderFile(`${__dirname}/../views/mails/${templete}.pug`, {
			firstName: this.firstName,
			code: this.code,
			subject,
		});

		// 2) Define email options
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,

			html,
		};
		// 3) create transport and send email
		await this.transporter().sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send('welcome', 'Welcome to coderSquare family 😍😊');
	}

	async sendResetPassword() {
		await this.send(
			'passwordReset',
			'Your password reset pin code (Valid for 10 min)'
		);
	}
}
