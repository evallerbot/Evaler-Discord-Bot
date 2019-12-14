const EventEmitter = require("events");

let i = 0;

class Evaller extends EventEmitter {
	constructor(client){
		super();
		this.client = client;
	}
	async prepare(){
		
		this.channel = await this.client.openChannel({
			name: "evaller" + (i++),
			service: "exec"
		});
	}
	async exec(lang, code, timeout){
		
		let state = 1;
		
		const listener = cmd => {
			if(cmd.output){
				this.emit("out", cmd.output);
			}
			else if(cmd.error){
				state = 0;
				this.emit("error", cmd.error);
				this.channel.removeListener("command", listener);
			}
			else if(cmd.ok){
				state = 0;
				this.emit("ok");
				this.channel.removeListener("command", listener);
			}
			else {}
		};
		
		this.channel.on("command", listener);
		
		//not having timeout means infinite timeout
		if(timeout){
			setTimeout (async () => {
                if(state){
                    await this.restartChannel();
					this.emit("kill");
                }
            }, timeout);
		}
        
        const args = Evaller.getArgs(lang, code);
        
        if(args){
            await this.channel.request({
                exec: {
                    args,
		    	    blocking: true
			    }
	        });
	        return 1;
        }
        else {
        	return 0;
        }
	}
    
    clear(){
    	this.removeAllListeners("out");
    	this.removeAllListeners("error");
    	this.removeAllListeners("kill");
    	this.removeAllListeners("ki");
    }
	
	async restartChannel(){
		await this.channel.close();
        
        this.channel = await this.client.openChannel({
			name: 'evaller',
			service: 'exec',
		});
	}
	
	restartClient(){
		//onClose will restart the client
		return this.client.close();
	}
	
    static getArgs(lang, code){
        let command;
        
        // get the normal name of the language
        for(let lang_official in Evaller.languages)
            for(let test_lang of Evaller.languages[lang_official])
                if (lang === test_lang) 
                    lang = lang_official;
                    
        switch(lang){
        	case "raku":
        		command = ["perl6", "-e", code];
        		break;
        		
            case "javascript":
                command = ["node", "-e", code];
                break;
            
            case "ruby":
                command = ["ruby", "-e", code];
                break;
            
            case "swift":
                command = ["sh", "-c", "echo \"" + code.replace(/\\/g, "\\\\\\").replace(/"/g, "\\\"") + "\"> ÒwÚ.swift && swiftc -o ÙwÓ ÒwÚ.swift && (./ÙwÓ && (rm ./ÙwÓ && rm ./ÒwÚ.swift) || (rm ./ÙwÓ && rm ./ÒwÚ.swift))"];
                break;
                
            case "fsharp":
                command = ["sh", "-c", "echo \"" + code.replace(/\\/g, "\\\\\\").replace(/"/g, "\\\"") + "\"> ÒwÚ.fs && fsharpc --nologo --out:ÙwÓ.exe ÒwÚ.fs && (mono ./ÙwÓ.exe && (rm ./ÙwÓ.exe && rm ./ÒwÚ.fs) || (rm ./ÙwÓ.exe && rm ./ÒwÚ.fs))"];
                break;
                
            case "rust":
                command = ["sh", "-c", "echo \"" + code.replace(/\\/g, "\\\\\\").replace(/"/g, "\\\"") + "\"> ÒwÚ.rs && rustc -o ÙwÓ ./ÒwÚ.rs && (./ÙwÓ && (rm ./ÙwÓ && rm ./ÒwÚ.rs) || (rm ./ÙwÓ && rm ./ÒwÚ.rs))"];
                break;
      
            case "c":
                command = ["sh", "-c", "echo \"" + code.replace(/\\/g, "\\\\\\").replace(/"/g, "\\\"") + "\"> ÒwÚ.c && clang -pthread -lm -o ÙwÓ ÒwÚ.c && (./ÙwÓ && (rm ./ÙwÓ && rm ./ÒwÚ.c) || (rm ./ÙwÓ && rm ./ÒwÚ.c))"];
                break;
                
            case "python":
                command = ["sh", "-c", "echo \"" + code.replace(/\\/g, "\\\\\\").replace(/"/g, "\\\"") + "\"> ÒwÚ.py && (python ÒwÚ.py && rm ÒwÚ.py || rm ÒwÚ.py)"];
                break;
            
            case "java":
                command = ["sh", "-c", "echo \"" + code.replace(/\\/g, "\\\\\\").replace(/"/g, "\\\"") + "\"> ÒwÚ.java && javac -classpath .:/run_dir/junit-4.12.jar -d . ÒwÚ.java && (java -classpath .:run_dir/junit-4.12.jar Main && (rm ./Main.class && rm ÒwÚ.java) || (rm ./Main.class && rm ÒwÚ.java))"];
                break;
                
            case "cpp":
                command = ["sh", "-c", "echo \"" + code.replace(/\\/g, "\\\\\\").replace(/"/g, "\\\"") + "\"> ÒwÚ.cpp && clang++-7 -pthread -o ÙwÓ ÒwÚ.cpp && (./ÙwÓ && (rm ÙwÓ && rm ÒwÚ.cpp) || (rm ÙwÓ && rm ÒwÚ.cpp))"];
                break;
            
            case "csharp":
                command = ["sh", "-c", "echo \"" + code.replace(/\\/g, "\\\\\\").replace(/"/g, "\\\"") + "\"> ÒwÚ.cs && mcs -out:ÙwÓ.exe ÒwÚ.cs && (mono ÙwÓ.exe && (rm ./ÙwÓ.exe && rm ./ÒwÚ.cs) || (rm ./ÙwÓ.exe && rm ./ÒwÚ.cs))"];
                break;
                
            case "sh":
                command = ["sh", "-c", code];
                break;
            
            default:
                return null;
        }
        
        return command;
    }
}

Evaller.languages = {
    'javascript': ['js','nodejs'],
    'python': ['py'],
    'cpp': ['c++'],
    'csharp': ['c#'],
    'fsharp': ['f#'],
    'raku': ['perl6']
};

module.exports = Evaller;