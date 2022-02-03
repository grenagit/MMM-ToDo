'use strict';

/* Magic Mirror
 * Module: MMM-VigilanceMeteoFrance
 *
 * Magic Mirror By Michael Teeuw https://magicmirror.builders
 * MIT Licensed.
 *
 * Module MMM-ToDo By Grena https://github.com/grenagit
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const request = require('request');
const ical = require('ical');

module.exports = NodeHelper.create({

	getData: function() {
		var self = this;

		const nodeVersion = Number(process.version.match(/^v(\d+\.\d+)/)[1]);
		const opts = {
			headers: {
				"User-Agent": "Mozilla/5.0 (Node.js " + nodeVersion + ") MagicMirror/" + global.version + " (https://github.com/MichMich/MagicMirror/)"
			},
			compressed: true
		};

		if (self.config.calendar.auth) {
			if (self.config.calendar.auth.method === "bearer") {
				opts.auth = {
					bearer: self.config.calendar.auth.pass
				};
			} else {
				opts.auth = {
					user: self.config.calendar.auth.user,
					pass: self.config.calendar.auth.pass,
					sendImmediately: self.config.calendar.auth.method !== "digest"
				};
			}
		}

		request(self.config.calendar.url, opts, function (err, r, requestData) {
			if (err) {
				self.sendSocketNotification("DATA", JSON.stringify({error : err}));
				return;
			} else if (r.statusCode !== 200) {
				self.sendSocketNotification("DATA", JSON.stringify({status : r.statusCode}));
				return;
			}

			const data = ical.parseICS(requestData);
			const tasks = [];

			Object.entries(data).forEach(([key, event]) => {
				if (event.type == 'VTODO') {

					// Mitigate https://github.com/grenagit/MMM-ToDo/issues/1
					if (typeof event.created === "undefined") {
						event.created = event.dtstamp;
					}

					tasks.push({"title": event.summary, "status": event.status, "completion": parseInt(event.completion), "priority": (event.priority > 0 ? parseInt(event.priority) : 0), "created": event.created, "start": event.start, "due": event.due});
					if(!self.config.showTaskCompleted && event.status == 'COMPLETED') {
						tasks.pop();
					}
				}
			});

			self.sendSocketNotification("DATA", JSON.stringify(tasks));
		});

	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
		if (notification === 'CONFIG') {
			self.config = payload;
			self.sendSocketNotification("STARTED", true);
			self.getData();
		}
	}

});
