'use strict';

// Configuring the Articles module
angular.module('patients').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Patients', 'patients', '/patients(/create)?');
		Menus.addMenuItem('topbar',  'View Ministries', 'ministries');
		Menus.addMenuItem('topbar',  'New Ministry', 'ministries/create');
	}
]);