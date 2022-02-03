/* Magic Mirror
 * Module: MMM-ToDo
 *
 * Magic Mirror By Michael Teeuw https://magicmirror.builders
 * MIT Licensed.
 *
 * Module MMM-ToDo By Grena https://github.com/grenagit
 * MIT Licensed.
 */

Module.register("MMM-ToDo",{

	// Default module config
	defaults: {
		updateInterval: 1 * 60 * 60 * 1000, // every 1 hour
		animationSpeed: 1000, // 1 second

		maximumEntries: 10,
		maxTitleLength: 25,
		wrapEvents: false,
		maxTitleLines: 3,
		sortOrder: "default",
		useColorLegend: true,
		showTaskCompleted: false,
		showSymbol: true,
		defaultSymbol: "thumbtack", // Fontawesome Symbol see http://fontawesome.io/cheatsheet/
		showCompletion: true,

		urgency: 7, // 7 days
		timeFormat: "relative",
		dateFormat: "MMM Do",

		initialLoadDelay: 0, // 0 seconds delay

		calendar: {}
	},

	// Define required styles
	getStyles: function () {
		return ["MMM-ToDo.css", "font-awesome.css"];
	},

	// Define required scripts
	getScripts: function () {
		return ["moment.js"];
	},

	// Define required translations
	getTranslations: function() {
		return {
			de: "translations/de.json",
			en: "translations/en.json",
			es: "translations/es.json",
			fr: "translations/fr.json",
		}
	},

	// Define start sequence
	start: function() {
		Log.info("Starting module: " + this.name);

		moment.updateLocale(config.language, this.getLocaleSpecification(config.timeFormat));

		this.tasks = [];

		this.loaded = false;

		this.scheduleUpdate(this.config.initialLoadDelay);
	},

	// Override dom generator
	getDom: function() {
		var wrapper = document.createElement("table");
		wrapper.className = "small";

		if (!this.loaded) {
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		for (let i = 0; (i < this.config.maximumEntries && i < this.tasks.length); i++) {

			var taskWrapper = document.createElement("tr");
			taskWrapper.className = "normal";

			if (this.config.showSymbol) {
				var symbolWrapper = document.createElement("td");
				symbolWrapper.className = "symbol align-right";

				var symbol = document.createElement("span");
				symbol.className = "fas fa-fw fa-" + this.config.defaultSymbol;
				if (this.config.useColorLegend) {
					symbol.style = "color: " + this.priority2color(this.tasks[i].priority) + ";";
				}
				symbolWrapper.appendChild(symbol);

				taskWrapper.appendChild(symbolWrapper);
			}

			if(this.config.showCompletion) {

				var completionWrapper = document.createElement("td");
				completionWrapper.className = "completion light dimmed";
				if(this.tasks[i].completion > 0) {
					completionWrapper.innerHTML = this.tasks[i].completion + "%";
				} else {
					completionWrapper.innerHTML = "&nbsp;&nbsp;&nbsp;";
				}

				taskWrapper.appendChild(completionWrapper);

			}

			var titleWrapper = document.createElement("td");
			titleWrapper.className = "title bright";
			titleWrapper.innerHTML = this.shorten(this.tasks[i].title, this.config.maxTitleLength, this.config.wrapEvents, this.config.maxTitleLines);

			taskWrapper.appendChild(titleWrapper);

			var timeWrapper = document.createElement("td");
			timeWrapper.className = "time light";

			var now = new Date();
			// Define second, minute, hour, and day variables
			var oneSecond = 1000; // 1,000 milliseconds
			var oneMinute = oneSecond * 60;
			var oneHour = oneMinute * 60;
			var oneDay = oneHour * 24;

			if(typeof this.tasks[i].due !== "undefined") {
				var dateValue = this.tasks[i].due.val;
				var datePrefix = this.translate("COMPLETE") + " ";
			} else if(typeof this.tasks[i].start !== "undefined") {
				var dateValue = this.tasks[i].start;
				var datePrefix = this.translate("STARTED") + " ";
			} else {
				var dateValue = this.tasks[i].created;
				var datePrefix = this.translate("CREATED") + " ";
			}

			if (this.config.timeFormat === "absolute") {
				if ((this.config.urgency > 1) && (this.tasks[i].startDate - now < (this.config.urgency * oneDay))) {
					timeWrapper.innerHTML = this.capFirst(datePrefix + moment(dateValue).from(moment().format("YYYYMMDD")));
				} else {
					timeWrapper.innerHTML = this.capFirst(datePrefix + moment(dateValue).format(this.config.dateFormat));
				}
			} else {
				timeWrapper.innerHTML = this.capFirst(datePrefix + moment(dateValue).fromNow());
			}

			taskWrapper.appendChild(timeWrapper);

			wrapper.appendChild(taskWrapper);

		}

		return wrapper;
	},

	// Request new data from calendar with node_helper
	socketNotificationReceived: function(notification, payload) {
		if (notification === "STARTED") {
			this.updateDom(this.config.animationSpeed);
		} else if (notification === "DATA") {
			this.processTodo(JSON.parse(payload));
		}
	},

	// Use the received data to set the various values before update DOM
	processTodo: function(data) {

		// Show an empty list, when ToDo list is empty
		if (data.length > 0) {
			if (!data || !data[0].title || typeof data[0].created === "undefined") {
				Log.error(this.name + ": Do not receive usable data.");
				return;
			}

			this.tasks = data;
			this.sort(this.tasks, this.config.sortOrder);
		}

		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
		this.scheduleUpdate();
	},

	// Schedule next update
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		setTimeout(function() {
			self.sendSocketNotification('CONFIG', self.config);
		}, nextLoad);
	},

	// Capitalize the first letter of a string
	capFirst: function (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	// Shortens a string if it's longer than maxLength and add a ellipsis to the end
	shorten: function (string, maxLength, wrapEvents, maxTitleLines) {
		if (typeof string !== "string") {
			return "";
		}

		if (wrapEvents === true) {
			var temp = "";
			var currentLine = "";
			var words = string.split(" ");
			var line = 0;

			for (var i = 0; i < words.length; i++) {
				var word = words[i];
				if (currentLine.length + word.length < (typeof maxLength === "number" ? maxLength : 25) - 1) { // max - 1 to account for a space
					currentLine += (word + " ");
				} else {
					line++;
					if (line > maxTitleLines - 1) {
						if (i < words.length) {
							currentLine += "&hellip;";
						}
						break;
					}

					if (currentLine.length > 0) {
						temp += (currentLine + "<br>" + word + " ");
					} else {
						temp += (word + "<br>");
					}
					currentLine = "";
				}
			}

			return (temp + currentLine).trim();
		} else {
			if (maxLength && typeof maxLength === "number" && string.length > maxLength) {
				return string.trim().slice(0, maxLength) + "&hellip;";
			} else {
				return string.trim();
			}
		}
	},

	// Return a moment.js LocaleSpecification with the corresponding timeformat to be used in the calendar display
	getLocaleSpecification: function(timeFormat) {
		switch (timeFormat) {
		case 12: {
			return { longDateFormat: {LT: "h:mm A"} };
			break;
		}
		case 24: {
			return { longDateFormat: {LT: "HH:mm"} };
			break;
		}
		default: {
			return { longDateFormat: {LT: moment.localeData().longDateFormat("LT")} };
			break;
		}
		}
	},

	// Convert priority's level to color
	priority2color: function(level) {
		if (level > 5) {
			return "#246fe0";
		} else if (level == 5) {
			return "#eb8909";
		} else if (level > 0 && level < 5) {
			return "#ac6560";
		}
	},

	// Sort tasks with different comparators
	sort: function(tasks, sortOrder) {
		var comparators;
		switch (sortOrder) {
		case 'alphabetically': {
			comparators = [this.sortAlphabetically, this.sortByPriority];
			break;
		}
		case 'priority': {
			comparators = [this.sortByPriority, this.sortAlphabetically];
			break;
		}
		case 'due': {
			comparators = [this.sortByDue, this.sortAlphabetically];
			break;
		}
		case 'start': {
			comparators = [this.sortByStart, this.sortAlphabetically];
			break;
		}
		case 'created': {
			comparators = [this.sortByCreated, this.sortAlphabetically];
			break;
		}
		default:
			comparators = [this.sortByDue, this.sortByPriority, this.sortByStart, this.sortAlphabetically];
		}
		var sortedTasks = tasks.sort((taskA, taskB) => {
			var compIndex = 0;
			var result = comparators[compIndex](taskA, taskB);
			while (result === 0 && compIndex < comparators.length) {
				result = comparators[compIndex](taskA, taskB);
				compIndex++;
			}
			return result;
		})
		return sortedTasks;
	},

	// Comparator to compare two tasks by priority in ascending order
	sortByPriority: function(taskA, taskB) {
		if (-taskA.priority === -taskB.priority) return 0
		if (-taskA.priority === 0) return 1
		if (-taskB.priority === 0) return -1
		return taskA.priority - taskB.priority;
	},

	// Comparator to compare two tasks alphabetically in ascending order
	sortAlphabetically: function(taskA, taskB) {
		return taskA.title.toLowerCase().localeCompare(taskB.title.toLowerCase());
	},

	// Comparator proxy to compare two tasks by due date in ascending order
	sortByDue: function(taskA, taskB) {
		if (typeof taskA.due === 'undefined' && typeof taskB.due !== 'undefined') return 1
		if (typeof taskA.due !== 'undefined' && typeof taskB.due === 'undefined') return -1
		if (typeof taskA.due === 'undefined' && typeof taskB.due === 'undefined') return 0
		return moment(taskA.due.val).diff(moment(taskB.due.val));
	},

	// Comparator proxy to compare two tasks by start date in ascending order
	sortByStart: function(taskA, taskB) {
		if (typeof taskA.start === 'undefined' && typeof taskB.start !== 'undefined') return 1
		if (typeof taskA.start !== 'undefined' && typeof taskB.start === 'undefined') return -1
		if (typeof taskA.start === 'undefined' && typeof taskB.start === 'undefined') return 0
		return moment(taskA.start).diff(moment(taskB.start));
	},

	// Comparator proxy to compare two tasks by created date in ascending order
	sortByCreated: function(taskA, taskB) {
		return moment(taskA.created).diff(moment(taskB.created));
	}

});
