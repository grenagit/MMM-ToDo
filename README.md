# Module: MMM-ToDo
This module displays tasks from a .ical calendar, including priority, completion, title and date. It works like a charm with [Nextcloud Tasks](https://apps.nextcloud.com/apps/tasks) !

Symbol, Completion and Color Legend display may be enabled or disabled independently. The sort order can be fixed. 

<!--<p align="left">
<img alt="MMM-VigilanceMeteoFrance Screenshot #1" src="MMM-VigilanceMeteoFrance_screenshot1.png" align="top" height="73px">
<img alt="MMM-VigilanceMeteoFrance Screenshot #2" src="MMM-VigilanceMeteoFrance_screenshot2.png" align="top" height="148px">
<img alt="MMM-VigilanceMeteoFrance Screenshot #3" src="MMM-VigilanceMeteoFrance_screenshot3.png" align="top" height="97px">
</p>-->

Source code inspired by [MagicMirror Calendar](https://github.com/MichMich/MagicMirror/tree/master/modules/default/calendar) and [Nextcloud Tasks](https://github.com/nextcloud/tasks). Thanks to the contributors :+1:

[MagicMirror Project on Github](https://github.com/MichMich/MagicMirror)

## Installation:

In your terminal, go to your MagicMirror's Module folder:
```shell
cd ~/MagicMirror/modules
```

Clone this repository:
```shell
git clone https://github.com/grenagit/MMM-ToDo
```

Go to your MMM-ToDo's Module folder:
```shell
cd ~/MagicMirror/modules/MMM-ToDo
```

Install dependencies:
```shell
npm install
```

Configure the module in your config.js file.

## Update:

In your terminal, go to your MMM-ToDo's Module folder:
```shell
cd ~/MagicMirror/modules/MMM-ToDo
```

Incorporate changes from this repository:
```shell
git pull
```

## Configuration:

### Basic configuration

To use this module, add it to the modules array in the `config/config.js` file:
```javascript
modules: [
	{
		module: "MMM-ToDo",
		position: "top_left",
		config: {
			calendar: {
				url: 'http://www.calendarlabs.com/templates/ical/US-Holidays.ics',
				auth: {
					  user: 'username',
					  pass: 'superstrongpassword',
					  method: 'basic'
				}
			}
		}
	}
]
```

### Options

The following properties can be configured:


| Option                       | Description
| ---------------------------- | -----------
| `updateInterval`             | How often does the content needs to be fetched? (Milliseconds) <br><br> **Possible values:** `1000` - `86400000` <br> **Default value:** `1 * 60 * 60 * 1000` (1 hour)
| `animationSpeed`             | Speed of the update animation. (Milliseconds) <br><br> **Possible values:**`0` - `5000` <br> **Default value:** `1000` (1 second)
| `maximumEntries`             | The maximum number of tasks shown. / **Possible values:** `0` - `100` <br> **Default value:** `10`
| `maxTitleLength`             | The maximum title length. <br><br> **Possible values:** `10` - `50` <br> **Default value:** `25`
| `wrapEvents`                 | Wrap event titles to multiple lines. Breaks lines at the length defined by `maxTitleLength`. <br><br> **Possible values:** `true` or `false` <br> **Default value:** `false`
| `maxTitleLines`              | The maximum number of lines a title will wrap vertically before being cut (Only enabled if `wrapEvents` is also enabled). <br><br> **Possible values:** `0` - `10` <br> **Default value:** `3`
| `sortOrder`               	 | The type of order used to order tasks <br><br> **Possible values:**`'alphabetically'`, `'priority'`, `'due'`, `'start'`, `'created'` or `'defaut'`<br> **Default value:** `'defaut'`
| `useColorLegend`             | Use the colored icons. <br><br> **Possible values:** `true` or `false` <br> **Default value:** `true`
| `showTaskCompleted`          | Display completed tasks. <br><br> **Possible values:** `true` or `false` <br> **Default value:** `false`
| `showSymbol`                 | Display a symbol in front of an entry. <br><br> **Possible values:** `true` or `false` <br> **Default value:** `true`
| `defaultSymbol`              | The default symbol. <br><br> **Possible values:** See [Font Awesome](https://fontawesome.com/icons?d=gallery&s=solid&m=free) website. <br> **Default value:** `calendar`
| `showCompletion`             | Display the percentage of task completion. <br><br> **Possible values:** `true` or `false` <br> **Default value:** `true`
| `urgency`                    | When using a timeFormat of `absolute`, the `urgency` setting allows you to display tasks within a specific time frame as `relative`. This allows tasks within a certain time frame to be displayed as relative (in xx days) while others are displayed as absolute dates <br><br> **Possible values:** a positive integer representing the number of days for which you want a relative date, for example `7` (for 7 days) <br><br> **Default value:** `7`
| `timeFormat`                 | Display times as absolute dates or relative time for each task next to it <br><br> **Possible values:** `'absolute'` or `'relative'` <br> **Default value:** `'relative'`
| `dateFormat`                 | Format to use for the date of tasks (when using absolute dates) <br><br> **Possible values:** See [Moment.js formats](http://momentjs.com/docs/#/parsing/string-format/) <br> **Default value:** `'MMM Do'` (e.g. Jan 18th)
| `initialLoadDelay`           | The initial delay before loading. If you have multiple modules that use the same API key, you might want to delay one of the requests. (Milliseconds) <br><br> **Possible values:** `1000` - `5000` <br> **Default value:**  `0`
| `calendar`                 	 | The department number (metropolitan france only). <br><br>  This value is **REQUIRED**

### Calendar configuration

#### Default value
```javascript
config: {
	colored: false,
	coloredSymbolOnly: false,
	calendars: [
		{
			url: 'http://www.calendarlabs.com/templates/ical/US-Holidays.ics',
			symbol: 'calendar',
			auth: {
			    user: 'username',
			    pass: 'superstrongpassword',
			    method: 'basic'
			}
		},
	],
}
```

#### Options
| Option                | Description
| --------------------- | -----------
| `url`	                | The url of the calendar .ical. This property is required. <br><br> **Possible values:** Any public accessble .ical calendar.
| `auth`                | The object containing options for authentication against the calendar.
| `symbolClass`         | Add a class to the cell of symbol.
| `user`                | The username for HTTP authentication.
| `pass`                | The password for HTTP authentication. (If you use Bearer authentication, this should be your BearerToken.)
| `method`              | Which authentication method should be used. HTTP Basic, Digest and Bearer authentication methods are supported. Basic authentication is used by default if this option is omitted. **Possible values:** `digest`, `basic`, `bearer` **Default value:** `basic`

## Todo



## License

This module is licensed under the MIT License
