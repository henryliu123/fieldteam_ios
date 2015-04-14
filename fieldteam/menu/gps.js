/**
 * Function List: 1. Display Client List 2. More Client Button for display more
 * clients 3. Download More Client button for downloading more clients from
 * server 4. Add Client Button 5. Click any client and enter client edit page 6.
 * Search bar
 */
(function() {
	Titanium.include(Ti.App.Properties.getString('base_folder_name') + 'transaction.js');
	var win = Titanium.UI.currentWindow;
	var gps_page_obj = null;
	
	function gps_page() {
		var self = this;
		var window_source = 'gps_page';
		win.title = 'GPS Setting';
		
		// public method
		/**
		 * override init function of parent class: transaction.js
		 */
		self.init = function() {
			try {
				self.init_auto_release_pool(win);
				self.data = [];
				// call init_navigation_bar function of parent
				// class: fieldteam.js
				self.init_navigation_bar('Done', 'Main,Back');
				self.init_vars();
				// call init_table_view function of parent
				// class: fieldteam.js
				self.init_table_view();
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.init');
				return;
			}
		};
		self.init_vars = function() {
			try {
				var db = Titanium.Database.open(self.get_db_name());
				var rows = db.execute('SELECT * FROM my_frontend_config_setting WHERE name=?', 'gps');
				if ((rows != null) && (rows.getRowCount() > 0)) {
					if (rows.isValidRow()) {
						_selected_index = parseInt(rows.fieldByName('value'), 10);
					}
				} else {
					_selected_index = 1;
				}
				db.close();
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.init_vars');
				return;
			}
		};
		/**
		 * override nav_right_btn_click_event function of parent class:
		 * transaction.js
		 */
		self.nav_right_btn_click_event = function() {
			try {
				var db = Titanium.Database.open(self.get_db_name());
				var rows = db.execute('SELECT * FROM my_frontend_config_setting WHERE name=?', 'gps');
				if (rows.fieldByName('value') == _selected_index) {					
					Ti.API.info(' do nothing');
				} else {					
					if ((rows != null) && (rows.getRowCount() > 0)) {
						db.execute('UPDATE my_frontend_config_setting SET value=? WHERE name=?', _selected_index, 'gps');
					} else {
						db.execute('INSERT into my_frontend_config_setting (value,name) VALUES(' + _selected_index + ',\'gps\')');
					}
					if(_selected_index == 4){
						Ti.API.info(' remove_location_event');
						Titanium.Geolocation.removeEventListener('location',function(){});
					}else{
						if(rows.fieldByName('value') == 4){
							Ti.API.info(' add_location_event');
							self.add_location_event();
						}
					}					
				}
				rows.close();
				db.close();
				win.close();
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.nav_right_btn_click_event');
				return;
			}
		};
		/**
		 * override table_view_click_event function of parent class:
		 * transaction.js
		 */
		self.table_view_click_event = function(e) {
			try {
				var index = e.index;
				var section = e.section;
				section.rows[index].hasCheck = true;
				for ( var i = 0, j = self.data.length; i < j; i++) {
					if (i != index) {
						if (section.rows[i] != null) {
							section.rows[i].hasCheck = false;
						}
					}
				}
				_selected_index = index + 1;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.table_view_click_event');
				return;
			}
		};
		/**
		 * display client list . Show letter index if client count great
		 * than 10
		 */
		self.display = function() {
			try {
				for ( var i = 0, j = self.gps_settings.length; i < j; i++) {
					var row = Ti.UI.createTableViewRow({
						filter_class : 'set_gps',
						className : 'gps_class_' + i,
						hasCheck : ((i + 1) == _selected_index) ? true : false,
						height : 'auto'
					});
					var title_label = Ti.UI.createLabel({
						left : 10,
						width : self.is_ipad() ? self.screen_width - 90 : self.screen_width - 30,
						text : self.gps_settings[i].title,
						height : 'auto',
						top : 5,
						font : {
							fontSize : self.normal_font_size,
							fontWeight : self.font_weight
						}
					});
					row.add(title_label);
					var title_label_line_num = parseInt(title_label.toImage().width / (self.screen_width)) + ((title_label.toImage().width % (self.screen_width)) > 0 ? 1 : 0);
					var description_label = Ti.UI.createLabel({
						left : 10,
						width : self.is_ipad() ? self.screen_width - 90 : self.screen_width - 30,
						text : self.gps_settings[i].description,
						height : 'auto',
						top : (title_label_line_num + 1) * 20 - 10,
						bottom : 3,
						font : {
							fontSize : self.small_font_size
						}
					});
					row.add(description_label);
					self.data.push(row);
				}
				self.table_view.setData(self.data);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.display');
				return;
			}
		};
		
		// private member
		var _selected_index = 0;
	}
			
	win.addEventListener('focus', function(e) {
		try {				
			if (gps_page_obj === null) {
				var F = function() {
				};
				F.prototype = transaction_page.prototype;
				gps_page.prototype = new F();
				gps_page.prototype.constructor = gps_page;
				gps_page_obj = new gps_page();
				gps_page_obj.init();					
			}
			gps_page_obj.display();
		} catch (err) {
			alert(err);
			return;
		}
	});
	
	win.addEventListener('close', function() {
		try {
			gps_page_obj.close_window();
			gps_page_obj = null;
			win = null;
		} catch (err) {
			alert(err);
			return;
		}
	});	
}());
