const db = require("../db/db.js");

class User {
	constructor(user){
		this.docRef = db.collection('guilds').doc(user.guild.id).collection('members').doc(user.id);
	}
	async prepare(){
		const doc = await this.docRef.get();
		
		if(!doc.exists){
			await this.docRef.set({
				ban: false,
				timeout: 5000
			});	
			this.doc = await this.docRef.get();
		} else {
			this.doc = doc;
		}
	}
	async ban(){
		this.docRef.update({ ban: true });
	}
	async unban(){
		await this.docRef.update({ ban: false });
	}
	async setTimeout(timeout){
		await this.docRef.update({ timeout: timeout });
	}
	getTimeout(){
		return this.doc.data().timeout;
	}
	data(){
		return this.doc.data();
	}
}

module.exports = User;