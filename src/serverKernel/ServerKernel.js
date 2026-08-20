///home/bilal-tariq/00--TALEEM/taleem-server-prod/src/serverKernel/ServerKernel.js
import { PrismaClient } from "@prisma/client";

import Config from "./Config.js";
import Auth from "./Auth.js";
import Logger from "./Logger.js";
import CommunicationPolicy from "./CommunicationPolicy.js";
import User from "./modules/User.js";
import Admin from "./modules/Admin.js";
import Library from "./modules/Library.js";
import Course from "./modules/Course.js";
import Communication from "./modules/Communication.js";
import Subscription from "./modules/Subscription.js";
import Image from "./modules/Image.js";
import Audio from "./modules/Audio.js";
import Svg from "./modules/Svg.js";

class ServerKernel {

	constructor() {

		this.logger = new Logger();

		this.logger.info("========================================");
		this.logger.info("Starting Taleem Server Kernel");
		this.logger.info("========================================");

		try {

			// --------------------------------------------------
			// Core
			// --------------------------------------------------

			this.config = this.initialize("Config", () => new Config());

			this.db = this.initialize("Prisma", () => new PrismaClient());

			this.auth = this.initialize("Auth", () => new Auth(this));

			this.communicationPolicy =
				this.initialize(
					"CommunicationPolicy",
					() => new CommunicationPolicy(this)
				);

			// --------------------------------------------------
			// Modules
			// --------------------------------------------------
this.user = this.initialize("User", () => new User(this));
this.admin = this.initialize("Admin", () => new Admin(this));
this.library = this.initialize("Library", () => new Library(this));
this.course = this.initialize("Course", () => new Course(this));
this.image = this.initialize("Image", () => new Image(this));
this.audio = this.initialize("Audio", () => new Audio(this));
this.svg = this.initialize("Svg", () => new Svg(this));
this.communication = this.initialize("Communication", () => new Communication(this));
this.subscription = this.initialize("Subscription", () => new Subscription(this));

this.logger.info("Server Kernel started successfully.");

		}
		catch (error) {

			this.logger.error(error.message);

			throw error;

		}

	}

	initialize(name, factory) {

		this.logger.info(`Initializing ${name}...`);

		try {

			const instance = factory();

			this.logger.info(`${name} initialized.`);

			return instance;

		}
		catch (error) {

			throw new Error(
				[
					"",
					"========================================",
					"SERVER KERNEL INITIALIZATION FAILED",
					"----------------------------------------",
					`Component : ${name}`,
					`Reason    : ${error.message}`,
					"",
					"Server Kernel startup aborted.",
					"========================================"
				].join("\n")
			);

		}

	}

	async shutdown() {

		this.logger.info("Shutting down Server Kernel...");

		try {

			await this.db.$disconnect();

			this.logger.info("Database disconnected.");

			this.logger.info("Server Kernel shutdown complete.");

		}
		catch (error) {

			throw new Error(
				[
					"",
					"========================================",
					"SERVER KERNEL SHUTDOWN FAILED",
					"----------------------------------------",
					`Reason : ${error.message}`,
					"========================================"
				].join("\n")
			);

		}

	}

}

const kernel = new ServerKernel();

export default kernel;