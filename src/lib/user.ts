import db from "./db";

class User {
	docRef: FirebaseFirestore.DocumentReference;
	doc?: FirebaseFirestore.DocumentData;

	constructor(userId: string){
		this.docRef = db.collection("users").doc(userId);
	}
	static async from(userId: string){
		const user = new User(userId);
		await user.prepare();

		return user;
	}
	async prepare(){
		const doc = await this.docRef.get();

		if(!doc.exists){
			await this.docRef.set({ ban: false, timeout: 5000 });
			this.doc = await this.docRef.get();
		} else {
			this.doc = doc;
		}
	}
	ban(){
		return this.docRef.update({ ban: true });
	}
	unban(){
		return this.docRef.update({ ban: false });
	}
	isBanned(): boolean | undefined {
		return this.doc?.data().ban;
	}
	setTimeout(timeout: number){
		return this.docRef.update({ timeout: timeout });
	}
	getTimeout(): number | undefined {
		return this.doc?.data().timeout;
	}
	data(): { ban: boolean, timeout: number } {
		return this.doc?.data();
	}
}

export default User;