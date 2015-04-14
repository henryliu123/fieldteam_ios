/**
 * Description: menu list
 */

(function() {
	Titanium.include(Ti.App.Properties.getString('base_folder_name') + 'fieldteam.js');
	var win = Titanium.UI.currentWindow;
	var menu_page_obj = null;
	
	function menu_page() {
		var self = this;
		var window_source = 'menu_page';
		win.title = 'Settings';
		/**
		 * override init function of parent class: fieldteam.js
		 */
		self.init = function() {
			try {
				self.init_auto_release_pool(win);
				self.data = [];
				// call init_navigation_bar function of parent
				// class: fieldteam.js
				self.init_navigation_bar('', 'Main,Back');
				self.init_vars();
				// call init_table_view function of parent
				// class: fieldteam.js
				self.init_table_view();
				// call init_no_result_label function of parent
				// class: fieldteam.js
				self.init_no_result_label();
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.init');
				return;
			}
		};
		/**
		 * override init_vars function of parent class: view_list.js
		 */
		self.init_vars = function() {
			try {
				self.data.push({
					title : 'Client List',
					filter_class : 'client_list',
					className : 'client_list',
					hasChild : true,
					header : ''
				// leftImage:self.get_file_path('image','settings/setting_client_list.png')
				});
				if (_can_view_materials) {
					self.data.push({
						title : 'Library Item',
						filter_class : 'library_item',
						className : 'library_item',
						hasChild : true
					// leftImage:self.get_file_path('image','settings/setting_library_item.png')
					});
				}
				self.data.push({
					title : 'Maximum Data Cache',
					filter_class : 'data_cache',
					className : 'data_cache',
					hasChild : true
				// leftImage:self.get_file_path('image','settings/setting_data_cache.png')
				});
				self.data.push({
					title : 'Email Signature',
					filter_class : 'email_signature',
					className : 'email_signature',
					hasChild : true
				// leftImage:self.get_file_path('image','settings/setting_data_cache.png')
				});
				Ti.API.info("self.get_host():" + self.get_host());
				if (self.get_host() == 'http://manager.demo2.foxbuddy.com.au') {
					self.data.push({
						title : 'GPS',
						filter_class : 'gps',
						className : 'gps',
						hasChild : true
					// leftImage:self.get_file_path('image','settings/setting_data_cache.png')
					});
				}
				self.data.push({
					title : 'Version (' + self.version + '.' + self.version_increment + ')',
					filter_class : 'version',
					header : '',
					className : 'version',
					hasChild : false
				// leftImage:self.get_file_path('image','settings/settings_version.png')
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.init_vars');
				return;
			}
		};
		/**
		 * override table_view_click_event function of parent class:
		 * view_list.js
		 */
		self.table_view_click_event = function(e) {
			try {
				var filter_class = self.data[e.index].filter_class;
				switch (filter_class){
					case 'client_list':
						var business_client_win = Ti.UI.createWindow({
							url : self.get_file_path('url', 'client/client_list.js'),
							type : 1,
							menu_win : win
						});
						
						Ti.UI.currentTab.open(business_client_win, {
							animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
						});
						
						break;
					case 'library_item':
						var library_item_win = Ti.UI.createWindow({
							url : self.get_file_path('url', 'library_item/select_library_item.js')
						});
						
						Ti.UI.currentTab.open(library_item_win, {
							animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
						});
						
						break;
					case 'data_cache':
						var data_cache_win = Ti.UI.createWindow({
							url : self.get_file_path('url', 'menu/data_cache.js')
						});
						
						Ti.UI.currentTab.open(data_cache_win, {
							animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
						});
						
						break;
					case 'email_signature':
						var _signature = '';
						var _local_id = null;
						var _manager_user_email_signature_id = 0;
						var db = Titanium.Database.open(self.get_db_name());
						var rows = db.execute('SELECT * FROM my_manager_user_email_signature WHERE manager_user_id=? order by id desc limit 1', _selected_user_id);
						if ((rows != null) && (rows.getRowCount() > 0)) {
							if (rows.isValidRow()) {
								_local_id = rows.fieldByName('local_id');
								_manager_user_email_signature_id = rows.fieldByName('id');
								_signature = rows.fieldByName('signature');
							}
						}
						rows.close();
						db.close();
						var signature_win = Ti.UI.createWindow({
							url : self.get_file_path('url', 'menu/manager_user_email_signature.js'),
							content : _signature,
							local_id : _local_id,
							manager_user_email_signature_id : _manager_user_email_signature_id
						});
						
						Ti.UI.currentTab.open(signature_win, {
							animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
						});
						
						break;
					case 'gps':
						var gps_win = Ti.UI.createWindow({
							url : self.get_file_path('url', 'menu/gps.js')
						});
						
						Ti.UI.currentTab.open(gps_win, {
							animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
						});						
						break;
					case 'version':
						break;
					
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.table_view_click_event');
				return;
			}
		};
		
		var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
		var _can_view_materials = Titanium.App.Properties.getBool('can_view_materials');
	}
	
	win.addEventListener('open', function() {
		try {
			if (menu_page_obj === null) {
				var F = function() {
				};
				F.prototype = FieldTeam.prototype;
				menu_page.prototype = new F();
				menu_page.prototype.constructor = menu_page;
				menu_page_obj = new menu_page();
				// call init function of parent class --
				// fieldteam.js
				menu_page_obj.init();
			}
		} catch (err) {
			alert(err);
			return;
		}
	});
	
	win.addEventListener('close', function() {
		try {
			menu_page_obj.close_window();
			menu_page_obj = null;
			win = null;
		} catch (err) {
			alert(err);
			return;
		}
	});
}());
