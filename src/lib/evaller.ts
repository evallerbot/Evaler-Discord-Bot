import type { Channel } from "@replit/crosis";
import EventEmitter from "events";
import { context, client, fetchConnectionMetadata } from "./crosis";
import { aquire } from "./mutex";

export const Languages = {
	"raku": ["perl6"],
	"javascript": ["js", "nodejs"],
	"ruby": [],
	"swift": [],
	"fsharp": ["f#"],
	"rust": ["rs"],
	"python": ["py"],
	"c": [],
	"java": ["java"],
	"cpp": ["c++"],
	"csharp": ["c#"],
	"sh": ["sh"],
	"bash": ["bash"],
	"obrya": ["oba"],
	"volant": ["vo"],
	"cookeylang": ["clf"],
};

let _channel: Channel | undefined;
let _closeChannel: (() => void) | undefined;

class Evaller extends EventEmitter {
	constructor(){
		super();
		this.prepare();
	}
	async prepare(){
		const release = await aquire("prepare");

		try {
			await new Promise((resolve, reject) => {
				if(_channel && _closeChannel){
					_channel!.onCommand((cmd) => {
						if (cmd.output) {
							this.emit("out", cmd.output.replace(/\x1b\[[0-9]*m/g, ""));
						} else if (cmd.error) {
							this.emit("out", cmd.error.replace(/\x1b\[[0-9]*m/g, ""));
						}
					});
					resolve(_channel);
					return;
				}

				client?.open({ context, fetchConnectionMetadata }, ({ channel }) => {
					if(!channel){
						return reject("Failed to open channel 0");
					}
					return ({ willReconnect }) => {
						if(!willReconnect) this.restartChannel();
					};
				});

				_closeChannel = client.openChannel({ service: "exec" }, ({ channel }) => {
					if(!channel){
						return reject("Failed to open channel");
					}
					_channel = channel!;

					channel!.onCommand((cmd) => {
						if (cmd.output) {
							this.emit("out", cmd.output.replace(/\x1b\[[0-9]*m/g, ""));
						} else if (cmd.error) {
							this.emit("out", cmd.error.replace(/\x1b\[[0-9]*m/g, ""));
						}
					});
					resolve(channel);
				});
			});
		} finally {
			release();
		}
	};

	async exec(lang: string, code: string, timeout: number){
		const [command, initEnv] = Evaller.getArgs(lang.toLowerCase(), code);

		if(!command){
			return 0;
		}
		if (initEnv) {
			await _channel!.request({ exec: { args: initEnv, blocking: true } });
		}

		let timer: NodeJS.Timeout | undefined;
		let done = false;

		if(timeout != Infinity){
			timer = setTimeout(() => {
				if(done) return;

				this.emit("out", "Killed!");
				this.emit("kill");
				this.restartChannel();
			}, timeout);
		}

		await _channel!.request({ exec: { args: command, blocking: true } });
		done = true;
		timer && clearTimeout(timer);

		return 1;
	}

	restartChannel() {
		this.closeChannel();
		return this.prepare();
	}
	closeChannel(){
		_closeChannel!();
	}
	clear() {
		this.removeAllListeners("out");
		this.removeAllListeners("kill");
	}

	static normalizeLang(lang: string): keyof typeof Languages | undefined {
		// get the normal name of the language
		for (const normalName in Languages) {
			if(lang == normalName){
				return <keyof typeof Languages>normalName;
			}
			// @ts-ignore
			const aliases: string[] = Languages[normalName];

			for (const alias of aliases) {
				if (lang === alias) {
					return <keyof typeof Languages>normalName;
				}
			}
		}
		return undefined;
	}

	static getArgs(lang: string | undefined, code: string) {
		let command, initEnv;

		lang = lang && Evaller.normalizeLang(lang);

		switch (lang) {
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
		case "bash":
			command = ["bash", "-c", code];
			break;
		case "obrya":
			initEnv = ["sh", "-c", "( ( test -f obrya.exe && test -d lib && test -f lib/math.oba ) || ( ( test -f Obratnaya.zip || wget https://repl.it/@obratnaya/Obratnaya.zip ) && unzip -o Obratnaya.zip \"obrya.exe\" \"lib/*\" ) ) > /dev/null 2>&1 && "];
			command = ["sh", "-c", "echo \"" + code.replace(/\\/g, "\\\\\\").replace(/"/g, "\\\"") + "\" > ÒwÚ.oba && ( (mono obrya.exe ÒwÚ.oba && rm ./ÒwÚ.oba) || rm ./ÒwÚ.oba )"];
			break;
		case "marvin":
			command = ["sh", "-c", "((cd marvin || (mkdir marvin && cd marvin)) && pwd && (test -f MARVIN-1.zip || wget https://repl.it/@generationXcode/MARVIN-1.zip) && unzip -o MARVIN-1.zip && python -m pip install ply && python -m pip install matplotlib && python -m pip install seaborn )  && echo \"" + code.replace(/\\/g, "\\\\\\").replace(/"/g, "\\\"") + "\" > main.vin && python main.py"];
			break;
		case "volant":
			initEnv = ["sh", "-c", "(test -f ./a.out && rm ./a.out || $NULL ) && ( test -f ./volant/bin/volant || ( echo \"Installing Volant...\" && git clone https://github.com/volantlang/volant > /dev/null 2>&1 && export GOPATH=$PWD/volant && cd volant && go build -o ./bin/volant ./src && cd ../ && echo \"Done!\" ) ) && ( ( test -f /home/runner/.apt/usr/include/uv.h && test -f /home/runner/.apt/usr/include/Block.h && test -f /home/runner/.apt/usr/include/gc.h ) || ( echo \"Installing dependencies...\" && install-pkg libblocksruntime-dev libuv-dev libgc-dev > /dev/null 2>&1 && echo \"Done!\" ) )"];
			command = ["sh", "-c", "echo \"" + code.replace(/\\/g, "\\\\\\").replace(/"/g, "\\\"") + "\"> ÒwÚ.vo && ./volant/bin/volant compile ÒwÚ.vo -clang -I/home/runner/.apt/usr/include && test -f ./a.out && rm ./ÒwÚ.vo && ( ( ./a.out && rm ./a.out ) || rm ./a.out )"];
			break;
		case "cookeylang":
			command = ["sh", "-c", "echo \"" + code.replace(/\\/g, "\\\\\\").replace(/"/g, "\\\"") + "\"> ÒwÚ.clf && ((npx cookeylang ÒwÚ.clf && rm ÒwÚ.clf) || rm ÒwÚ.clf)"]
			break;
		default:
			return [null, null];
		}

		return [command, initEnv];
	}
}

export default Evaller;