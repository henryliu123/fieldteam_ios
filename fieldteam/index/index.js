(function() {
	Titanium.include(Ti.App.Properties.getString('base_folder_name') + 'transaction.js');
	var win = Titanium.UI.currentWindow;
	var main_page_obj = null;
	function main_page() {
		var self = this;
		var window_source = 'main_page';
		var all_window_array = [];
		win.title = 'FieldTeam';
		
		// public method
		/**
		 * override init function of parent class: fieldteam.js
		 */
		self.async_gps_timer = 0;
		self.async_data_timer = 0;
		self.init = function() {
			try {
				// self.init_auto_release_pool(win);
				// win.backgroundImage =
				// self.get_file_path('image',self.background_image);
				// if(!self.is_ios_7_plus()){
				// win.backgroundColor = "#009FAA";
				// }
				self.data = [];
				self.init_navigation_bar('Add', 'Logout');
				self.init_vars();
				_create_scroll_view();
				_init_dashboard_control();
				_init_controls();
				
				// load gps interval from local database
				var selectedGPSIndex = 0;
				var db = Titanium.Database.open(self.get_db_name());
				var rows = db.execute('SELECT * FROM my_frontend_config_setting WHERE name=?', 'gps');
				if (rows.isValidRow()) {
					selectedGPSIndex = parseInt(rows.fieldByName('value'), 10);
				}
				rows.close();
				if (selectedGPSIndex == 0) {
					db.execute('INSERT into my_frontend_config_setting (value,name) VALUES(1,\'gps\')');
				}
				db.close();
				self.add_location_event();
								
				self.async_gps_timer = setInterval(function() {
					if (Ti.Network.online && self.is_login_status()) {
						Ti.API.info("send_gps_location2: self.get_gps_interval():"+self.get_gps_interval());
						Ti.App.Properties.setString('send_gps_location2:', self.get_gps_interval());
						self.send_gps_location();
					}
				}, self.get_gps_interval());
				
				self.async_data_timer = setInterval(function() {					
					if (Ti.Network.online && self.is_login_status()) {
						_upload_data();
					}
					var oldGPSInterval = parseInt(Ti.App.Properties.getString('gps_interval'),10);
					var newGPSInterval = self.get_gps_interval();
					Ti.API.info('oldGPSInterval:'+oldGPSInterval+',newGPSInterval:'+newGPSInterval);
					
					if(oldGPSInterval != newGPSInterval){
						Ti.App.Properties.setString('gps_interval', newGPSInterval);
						Ti.API.info('rebuild  gps timer');
						if (self.async_gps_timer) {
							clearInterval(self.async_gps_timer);
							self.async_gps_timer = null;							
							self.async_gps_timer = setInterval(function() {
								if (Ti.Network.online && self.is_login_status()) {
									Ti.API.info("send_gps_location3:newGPSInterval:"+newGPSInterval);
									Ti.App.Properties.setString('send_gps_location3:', newGPSInterval);
									self.send_gps_location();
								}
							}, newGPSInterval);								
						}
					
					}
				}, self.default_data_update_interval);
				
				Ti.App.addEventListener('async_save_data', function() {
					self.run_in_background_for_sync_upload();
				});
				
				Ti.App.addEventListener('refresh_badge_for_main_page', function() {
					self.refresh_badge_info();
				});
				
				Ti.App.addEventListener('pop_gps_turn_off_alert', function() {
					self.gps_turn_off_alert();// call
					// gps
					// location
					// function.
					// so
					// that
					// ios
					// can
					// send
					// gps
					// info
					// to
					// server
					// when
					// phone's
					// position
					// was
					// changed.'
				});
				
				Ti.App.addEventListener('add_window_to_global_array', function() {
					self.add_window_to_global_array();
				});
				
				Ti.App.addEventListener('close_window_from_global_array', function() {
					self.close_window_from_global_array();
				});
				
				Ti.App.addEventListener('close_all_window_and_return_to_menu', function() {
					self.close_all_window_and_return_to_menu();
				});
				
				_init_background_service();
				self.run_in_background_for_sync_upload();
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.init');
				return;
			}
		};
		/**
		 * override init_vars function of parent class: fieldteam.js
		 */
		self.init_vars = function() {
			try {
				var menu_list_order_array = [ 'my_calendar', 'task_list', 'job_filter', 'quote_filter', 'local_job', 'local_quote', 'mapping', 'team_view', 'setting' ];
				_item_array = [ {
					name : 'My Calendar',
					source_name : 'my_calendar',
					check_badge : true,
					image : 'my_calendar.png',
					url : 'my_calendar/my_calendar.js'
				}, {
					name : 'Tasks',
					source_name : 'task_list',
					check_badge : true,
					image : 'tasks.png',
					url : 'task/task_list.js',
					type : 'job'
				}, {
					name : 'Jobs',
					source_name : 'job_filter',
					check_badge : true,
					image : 'jobs_filter.png',
					url : 'filter/job_filter_list.js',
					type : 'job'
				},

				{
					name : 'Quotes',
					source_name : 'quote_filter',
					check_badge : true,
					image : 'quotes_filter.png',
					url : 'filter/job_filter_list.js',
					type : 'quote'
				}, {
					name : 'Unsynced Jobs',
					source_name : 'local_job',
					check_badge : true,
					image : 'unsynced_jobs.png',
					url : 'local/local_job_list.js',
					type : 'job'
				},

				{
					name : 'Unsynced Quotes',
					source_name : 'local_quote',
					check_badge : true,
					image : 'unsynced_quotes.png',
					url : 'local/local_job_list.js',
					type : 'quote'
				},

				{
					name : 'Mapping',
					source_name : 'mapping',
					check_badge : true,
					image : 'mapping.png',
					url : 'live_map/live_map.js'
				},

				{
					name : 'Team',
					source_name : 'team_view',
					check_badge : true,
					image : 'team_view.png',
					url : 'team_view/team_view.js'
				},

				{
					name : 'Settings',
					source_name : 'setting',
					check_badge : true,
					image : 'settings.png',
					url : 'menu/menu.js'
				} ];
				var temp_item_array = [];
				// check manager user mobile table, how many
				// modules can be displayed
				var user_id = Ti.App.Properties.getString('current_login_user_id');
				var db = Titanium.Database.open(self.get_db_name());
				// first, check if exist records for current
				// user in my_manager_user_mobile
				var rows = db.execute('select * from my_manager_user_mobile where manager_user_id=?', user_id);
				if (rows.getRowCount() > 0) {
					// check if exsit vaild modules
					rows.close();
					rows = db.execute('select * from my_manager_user_mobile_code where code in ' + '(select mobile_code from my_manager_user_mobile where status_code=1 and manager_user_id=?)', user_id);
					if (rows.getRowCount() > 0) {
						var temp_var = null;
						while (rows.isValidRow()) {
							Ti.API.info('abbr:' + rows.fieldByName('abbr'));
							switch (rows.fieldByName('abbr')){
								case 'my_calendar':
									temp_var = {
										name : 'My Calendar',
										source_name : 'my_calendar',
										check_badge : true,
										image : 'my_calendar.png',
										url : 'my_calendar/my_calendar.js'
									};
									temp_item_array.push(temp_var);
									break;
								case 'tasks':
									temp_var = {
										name : 'Tasks',
										source_name : 'task_list',
										check_badge : true,
										image : 'tasks.png',
										url : 'task/task_list.js',
										type : 'job'
									};
									temp_item_array.push(temp_var);
									break;
								case 'jobs':
									temp_var = {
										name : 'Jobs',
										source_name : 'job_filter',
										check_badge : true,
										image : 'jobs_filter.png',
										url : 'filter/job_filter_list.js',
										type : 'job'
									};
									temp_item_array.push(temp_var);
									break;
								case 'quotes':
									temp_var = {
										name : 'Quotes',
										source_name : 'quote_filter',
										check_badge : true,
										image : 'quotes_filter.png',
										url : 'filter/job_filter_list.js',
										type : 'quote'
									};
									temp_item_array.push(temp_var);
									break;
								case 'unsynced_jobs':
									temp_var = {
										name : 'Unsynced Jobs',
										source_name : 'local_job',
										check_badge : true,
										image : 'unsynced_jobs.png',
										url : 'local/local_job_list.js',
										type : 'job'
									};
									temp_item_array.push(temp_var);
									break;
								case 'unsynced_quotes':
									temp_var = {
										name : 'Unsynced Quotes',
										source_name : 'local_quote',
										check_badge : true,
										image : 'unsynced_quotes.png',
										url : 'local/local_job_list.js',
										type : 'quote'
									};
									temp_item_array.push(temp_var);
									break;
								case 'mapping':
									temp_var = {
										name : 'Mapping',
										source_name : 'mapping',
										check_badge : true,
										image : 'mapping.png',
										url : 'live_map/live_map.js'
									};
									temp_item_array.push(temp_var);
									break;
								case 'team':
									temp_var = {
										name : 'Team',
										source_name : 'team_view',
										check_badge : true,
										image : 'team_view.png',
										url : 'team_view/team_view.js'
									};
									temp_item_array.push(temp_var);
									break;
								case 'settings':
									temp_var = {
										name : 'Settings',
										source_name : 'setting',
										check_badge : true,
										image : 'settings.png',
										url : 'menu/menu.js'
									};
									temp_item_array.push(temp_var);
									break;
								
							}
							rows.next();
						}
					}
				}
				db.close();
				if (temp_item_array.length > 0) {
					_item_array = [];
					for ( var i = 0, j = menu_list_order_array.length; i < j; i++) {
						for ( var m = 0, n = temp_item_array.length; m < n; m++) {
							if (menu_list_order_array[i] == temp_item_array[m].source_name) {
								_item_array.push(temp_item_array[m]);
								break;
							}
						}
					}
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.init_vars');
				return;
			}
		};
		/**
		 * override nav_left_btn_click_event function of parent class:
		 * fieldteam.js
		 */
		self.nav_left_btn_click_event = function(e) {
			try {
				var option_dialog = Ti.UI.createOptionDialog({
					options : (self.is_ipad()) ? [ 'Yes', 'No', '' ] : [ 'Yes', 'No' ],
					buttonNames : [ 'Cancel' ],
					destructive : 0,
					cancel : 1,
					title : 'Do you want to logout?'
				});
				option_dialog.show();
				option_dialog.addEventListener('click', function(e) {
					if (e.index === 0) {
						// set all user's login status
						// is false;
						self.process_data_when_logout();
						var loginWindow = Ti.UI.createWindow({
							title : 'Login',
							url : self.get_file_path('url', 'login/login.js'),
							tab_group_obj : null,
							first_login : false,
							fullscreen : true
						});
						loginWindow.open();
					}
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.nav_left_btn_click_event');
				return;
			}
		};
		/**
		 * override nav_right_btn_click_event function of parent class:
		 * fieldteam.js
		 */
		self.nav_right_btn_click_event = function(e) {
			try {
				// var scanditsdk =
				// require("com.mirasense.scanditsdk");
				//
				// // disable the status bar for the camera view
				// on the iphone and ipad
				// if(Ti.Platform.osname == 'iphone' ||
				// Ti.Platform.osname == 'ipad'){
				// Titanium.UI.iPhone.statusBarHidden = true;
				// }
				//
				//
				// var picker;
				// // Create a window to add the picker to and
				// display it.
				// var window = Titanium.UI.createWindow({
				// title:'Scandit SDK',
				// navBarHidden:true
				// });
				//                                
				//
				//                                
				//
				// // Sets up the scanner and starts it in a new
				// window.
				// var openScanner = function() {
				// // Instantiate the Scandit SDK Barcode Picker
				// view
				// picker = scanditsdk.createView({
				// width:"100%",
				// height:"100%"
				// });
				// // Initialize the barcode picker, remember to
				// paste your own app key here.
				// picker.init("K6MCiJ3iEeOX7ZQuj3yOcCOfVhCBR1b9o+pIddfCrUg",
				// 0);
				//
				//
				// picker.showSearchBar(true);
				// // add a tool bar at the bottom of the scan
				// view with a cancel button
				// (iphone/ipad only)
				// picker.showToolBar(true);
				//
				// // Set callback functions for when scanning
				// succeedes and for when the
				// // scanning is canceled.
				// picker.setSuccessCallback(function(e) {
				// alert("success (" + e.symbology + "): " +
				// e.barcode);
				// });
				// picker.setCancelCallback(function(e) {
				// closeScanner();
				// });
				//
				// window.add(picker);
				// window.addEventListener('open', function(e) {
				// // Adjust to the current orientation.
				// // since window.orientation returns
				// 'undefined' on ios devices
				// // we are using Ti.UI.orientation (which is
				// deprecated and no longer
				// // working on Android devices.)
				// if(Ti.Platform.osname == 'iphone' ||
				// Ti.Platform.osname == 'ipad'){
				// picker.setOrientation(Ti.UI.orientation);
				// }
				// else {
				// picker.setOrientation(window.orientation);
				// }
				//		
				// picker.setSize(Ti.Platform.displayCaps.platformWidth,
				// Ti.Platform.displayCaps.platformHeight);
				// picker.startScanning(); // startScanning()
				// has to be called after the window
				// is opened.
				// });
				// window.open();
				// }
				//
				// // Stops the scanner, removes it from the
				// window and closes the latter.
				// var closeScanner = function() {
				// if (picker != null) {
				// picker.stopScanning();
				// window.remove(picker);
				// }
				// window.close();
				// }
				//
				// // Changes the picker dimensions and the
				// video feed orientation when the
				// // orientation of the device changes.
				// Ti.Gesture.addEventListener('orientationchange',
				// function(e) {
				// window.orientationModes =
				// [Titanium.UI.PORTRAIT,
				// Titanium.UI.UPSIDE_PORTRAIT,
				// Titanium.UI.LANDSCAPE_LEFT,
				// Titanium.UI.LANDSCAPE_RIGHT];
				// if (picker != null) {
				// picker.setOrientation(e.orientation);
				// picker.setSize(Ti.Platform.displayCaps.platformWidth,
				// Ti.Platform.displayCaps.platformHeight);
				// // You can also adjust the interface here if
				// landscape should look
				// // different than portrait.
				// }
				// });
				//
				// // create start scanner button
				// var button = Titanium.UI.createButton({
				// "width":200,
				// "height": 80,
				// "title": "start scanner"
				// });
				//
				// button.addEventListener('click', function() {
				// openScanner();
				// });
				//
				// var rootWindow = Titanium.UI.createWindow({
				// backgroundColor:'#000'
				// });
				// rootWindow.add(button);
				//                                
				// var closeBtn = Ti.UI.createButton({
				// title:'Close',
				// width:100,
				// height:40,
				// right:10
				// });
				// closeBtn.addEventListener('click',function(e){
				// rootWindow.close();
				// });
				// rootWindow.add(closeBtn);
				//                                
				// rootWindow.open();
				//                                
				// return;
				var optionDialog = Ti.UI.createOptionDialog({
					options : (self.is_ipad()) ? [ 'Create Job', 'Create Quote', 'Cancel', '' ] : [ 'Create Job', 'Create Quote', 'Cancel' ],
					buttonNames : [ 'Cancel' ],
					destructive : 0,
					cancel : 2,
					title : 'Please select option.'
				});
				optionDialog.show();
				optionDialog.addEventListener('click', function(e) {
					switch (e.index){
						case 0:
						case 1:
							var add_job_win = Ti.UI.createWindow({
								url : self.get_file_path('url', 'job/edit/job_index_view.js'),
								type : (e.index === 0) ? 'job' : 'quote',
								job_id : 0,
								job_reference_number : 0,
								job_status_code : 0,
								action_for_job : 'add_job'
							});
							Ti.UI.currentTab.open(add_job_win, {
								animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
							});
							break;
					}
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.nav_right_btn_click_event');
				return;
			}
		};
		/**
		 * refresh bottom tool bar and update time label with latest
		 * time
		 */
		self.refresh_last_updated_time_label = function() {
			try {
				var db = Titanium.Database.open(self.get_db_name());
				var library_last_updated = 0;
				var rows = db.execute('SELECT * FROM my_frontend_config_setting where id=1');
				if (rows.getRowCount() > 0) {
					if (rows.isValidRow()) {
						library_last_updated = parseInt(rows.fieldByName('value'), 10);
					}
					var library_last_updated2 = parseInt(Titanium.App.Properties.getString('library_last_updated'), 10);
					if (library_last_updated2 != library_last_updated) {
						db.execute('UPDATE my_frontend_config_setting SET value=? WHERE name=?', library_last_updated2, 'library_last_updated');
						library_last_updated = library_last_updated2;
					}
				}
				rows.close();
				db.close();
				if (library_last_updated === 0) {
					
				} else {
					self.last_updated_label.text = 'Last Updated : ' + self.display_time_and_date(library_last_updated);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.refresh_last_updated_time_label');
				return;
			}
		};
		/**
		 * refresh badge when display index page (focus event)
		 */
		self.refresh_badge_info = function() {
			try {
				var badge_result = _get_badge_info();
				for ( var i = 0, j = self.data.length; i < j; i++) {
					var temp_flag = false;
					for ( var m = 0, n = badge_result.length; m < n; m++) {
						if (self.data[i].label === badge_result[m].type) {
							temp_flag = true;
							self.data[i].children[2].visible = true;
							self.data[i].children[3].visible = true;
							self.data[i].children[3].text = badge_result[m].badge;
							break;
						}
					}
					if (!temp_flag) {
						self.data[i].children[2].visible = false;
						self.data[i].children[3].visible = false;
						self.data[i].children[3].text = 0;
					}
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.refresh_badge_info');
				return;
			}
		};
		/**
		 * refresh modules list
		 */
		self.refresh_modules_list = function() {
			try {
				if (Ti.App.Properties.getBool('refresh_modules_list')) {
					self.init_vars();
					_init_dashboard_control();
					self.dashboard.setData(self.data);
					Ti.App.Properties.setBool('refresh_modules_list', false);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.refresh_modules_list');
				return;
			}
		};
		
		/*
		 * add window object to global array so that app can manage all
		 * of them.
		 */
		self.add_window_to_global_array = function() {
			try {
				var newWin = Ti.App.selectWindowObject;// Titanium.App.Properties.getObject('add_new_window');
				if (newWin != undefined && newWin != null) {
					all_window_array.push(newWin);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.add_window_to_global_array');
			}
		};
		
		/*
		 * remove window object from global array and remove it from app
		 */
		self.close_window_from_global_array = function() {
			try {
				var lastWinIndex = all_window_array.length - 1;
				_remove_all_control_of_window(lastWinIndex);
				Ti.API.info('all_window_array length 2:' + all_window_array.length);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.close_window_from_global_array');
			}
		};
		
		/*
		 * remove all windows (except root window) and display root
		 * window
		 */
		self.close_all_window_and_return_to_menu = function() {
			try {
				Ti.App.Properties.setBool('ready_remove_all_window_and_return_to_menu', true);
				if (all_window_array.length > 0) {
					
					// first close all parent window(exclude
					// index window), then close latest
					// window.\
					var latest_open_window = all_window_array[all_window_array.length - 1];
					
					// remove all window except index_window
					// and last open window
					for ( var i = all_window_array.length - 2; i >= 0; i--) {
						_remove_all_control_of_window(i);
					}
					if ((latest_open_window != undefined) && (latest_open_window != null)) {
						for (i = latest_open_window.children.length - 1; i >= 0; i--) {
							latest_open_window.remove(latest_open_window.children[i]);
						}
						latest_open_window.is_close_all_window = true;
						latest_open_window.close();
						all_window_array.pop();
						Ti.App.Properties.setBool('ready_remove_all_window_and_return_to_menu', false);
					}
				} else {
					Ti.App.Properties.setBool('ready_remove_all_window_and_return_to_menu', false);
				}
				Ti.API.info('all_window_array length 3:' + all_window_array.length);
			} catch (err) {
				self.process_simple_error_message(err, self.window_source + ' - self.close_all_window_and_return_to_menu');
				return;
			}
		};
		
		// private member
		var _item_array = [];
		var _scroll_view = null;
		var _library_last_updated = 0;
		
		// private method
		/**
		 * init dashboard view, display dashboardItem
		 */
		function _init_dashboard_control() {
			try {
				// add dashboard component
				var badge_result = _get_badge_info();
				self.data = [];
				for ( var i = 0, j = _item_array.length; i < j; i++) {
					var row = Ti.UI.createTableViewRow({
						source_name : _item_array[i].source_name,
						label : _item_array[i].name,
						url : self.get_file_path('url', _item_array[i].url),
						hasChild : true,
						type : _item_array[i].type,
						height : 60
					});
					var item_image = Ti.UI.createImageView({
						image : self.get_file_path('image', 'icons3/' + _item_array[i].image),
						width : 44,
						height : 44,
						left : 10,
						top : 8
					});
					row.add(item_image);
					
					var item_label = Ti.UI.createLabel({
						text : _item_array[i].name,
						textAlign : 'left',
						color : '#000',
						font : {
							fontSize : self.font_size,
							fontWeight : 'bold'
						},
						width : self.screen_width - 50 - 20,
						height : self.default_table_view_row_height,
						left : 75
					});
					row.add(item_label);
					
					var temp_flag = false;
					for ( var m = 0, n = badge_result.length; m < n; m++) {
						if (_item_array[i].name === badge_result[m].type) {
							temp_flag = true;
							var item_badge_icon = Ti.UI.createImageView({
								image : self.get_file_path('image', 'badge_background.png'),
								width : 20,
								height : 20,
								top : 2,
								left : 46,
								visible : true
							});
							row.add(item_badge_icon);
							var item_badge_number = Ti.UI.createLabel({
								width : 20,
								height : 20,
								top : 1,
								left : 47,
								text : badge_result[m].badge,
								font : {
									fontSize : self.small_font_size,
									fontWeight : 'bold'
								},
								textAlign : 'center',
								color : '#fff',
								visible : true
							});
							row.add(item_badge_number);
							break;
						}
					}
					if (!temp_flag) {
						item_badge_icon = Ti.UI.createImageView({
							image : self.get_file_path('image', 'badge_background.png'),
							width : 20,
							height : 20,
							top : 3,
							left : 47,
							visible : false
						});
						row.add(item_badge_icon);
						item_badge_number = Ti.UI.createLabel({
							width : 20,
							height : 20,
							top : 1,
							left : 47,
							text : 0,
							font : {
								fontSize : self.small_font_size,
								fontWeight : 'bold'
							},
							textAlign : 'center',
							color : '#fff',
							visible : false
						});
						row.add(item_badge_number);
					}
					self.data.push(row);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_dashboard_control');
				return;
			}
		}
		/**
		 * init other controls, e.g bottom tool bar
		 */
		function _init_controls() {
			try {
				self.dashboard = Titanium.UI.createTableView({
					data : self.data,
					backgroundColor : '#fff',
					bottom : self.tool_bar_height
				});
				win.add(self.dashboard);
				
				// bottom toolbar
				self.flex_space = Titanium.UI.createButton({
					systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
				});
				
				self.last_updated_label = Ti.UI.createLabel({
					height : 20,
					font : {
						fontSize : self.middle_font_size
					},
					textAlign : 'center',
					width : 300,
					text : 'Last Updated : ' + self.display_time_and_date(_library_last_updated)
				});
				
				self.bottom_tool_bar = Ti.UI.iOS.createToolbar({
					items : [ self.flex_space, self.last_updated_label, self.flex_space ],
					bottom : 0,
					borderColor : self.tool_bar_color_in_ios_7,
					borderWidth : 1,
					zIndex : 100,
					opacity : 0.8
				});
				
				if (self.is_ios_7_plus()) {
					// self.bottom_tool_bar.barColor =
					// self.default_tool_bar_background_color;
					self.last_updated_label.color = '#000';
				}
				win.add(self.bottom_tool_bar);
				
				self.dashboard.addEventListener('click', function(e) {
					_dashboard_click_event(e);
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_controls');
				return;
			}
		}
		/**
		 * init background service. Because index page is parent window,
		 * it will open until quit or logout. so setup background
		 * service function in index page . Advise: background service
		 * only support iphone 4.0 above.
		 */
		function _init_background_service() {
			try {
				if (self.is_ios_4_plus()) {
					Titanium.App.idleTimerDisabled = true;
					Ti.App.iOS.registerBackgroundService({
						url : self.get_file_path('url', 'background_service/bg.js')
					});
					
					Ti.App.addEventListener('paused', function(e) {
						Ti.App.Properties.setBool('is_in_background_service', true);
//						if (self.async_gps_timer) {
//							clearInterval(self.async_gps_timer);
//							self.async_gps_timer = null;
//						}
//						if (self.async_data_timer) {
//							clearInterval(self.async_data_timer);
//							self.async_data_timer = null;
//						}
					});
					
					Ti.App.addEventListener('resumed', function(e) {
						Ti.API.info('app resume');
						Ti.App.Properties.setBool('is_in_background_service', false);
						if (Ti.Network.online && self.is_login_status()) {
							// load gps
							// interval from
							// local
							// database
//							if (self.async_gps_timer) {
//								clearInterval(self.async_gps_timer);
//								self.async_gps_timer = null;								
//								self.async_gps_timer = setInterval(function() {
//									if (Ti.Network.online && self.is_login_status()) {
//										Ti.API.info('app resume 1');
//										self.send_gps_location();
//									}
//								}, self.get_gps_interval());								
//							}
//														
//							
//							if (self.async_data_timer) {
//								clearInterval(self.async_data_timer);
//								self.async_data_timer = null;
//								if (self.async_data_timer == 0) {
//									self.async_data_timer = setInterval(function() {
//										if (Ti.Network.online && self.is_login_status()) {
//											Ti.API.info('app resume 2');
//											_upload_data();
//										}
//									}, self.default_data_update_interval);
//								}								
//							}							
							
							_upload_data();
						}
					});
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_background_service');
				return;
			}
		}
		/**
		 * dashboard click event, jump to selected url
		 */
		function _dashboard_click_event(e) {
			try {
				var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
				var _selected_company_id = Ti.App.Properties.getString('current_company_id');
				if ((e.row === undefined) || (e.row === null)) {
					
				} else {
					if ((e.row.source_name === 'mapping') && (!Ti.Network.online)) {
						self.show_message(L('message_offline'), L('message_unable_to_connect'));
						return;
					}
					var new_win = Ti.UI.createWindow({
						title : e.row.label,
						source_name : e.row.source_name,
						url : e.row.url,
						type : e.row.type,
						user_id : _selected_user_id,
						company_id : _selected_company_id,
						scroll_view_obj : _scroll_view
					});
					Ti.UI.currentTab.open(new_win, {
						animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
					});
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _dashboard_click_event');
				return;
			}
		}
		/**
		 * if uploading data then delay refresh data (async data every 2
		 * mins)
		 */
		function _upload_data() {
			try {
				if ((Ti.Network.online) && (!Ti.App.Properties.getBool('lock_table_flag'))) {
					// send gps and download last updated
					// info
					if (Ti.App.Properties.getString('current_login_user_id') > 0) {
						self.download_latest_log();
						self.refresh_last_updated_time_label();
						self.refresh_badge_info();
						//self.local_notification_if_upload_media_file_failed();
					}
				}
				self.run_in_background_for_sync_upload();
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _upload_data');
				return;
			}
		}
		
		/**
		 * get badge info for my calendar,jobs(changed),quotes(changed)
		 * and local jobs and local quotes. my calendar : show today's
		 * jobs (status aren't compeleted,closed,) local jobs : show all
		 * changed jobs local quotes: show all changed quotes
		 * 
		 */
		function _get_badge_info() {
			try {
				var result = [];
				var _selected_company_id = Ti.App.Properties.getString('current_company_id');
				var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
				var new_date = new Date();
				var calendar_year = new_date.getFullYear();
				var calendar_month = new_date.getMonth();
				var calendar_date = new_date.getDate();
				var temp_month = ((calendar_month + 1) <= 9) ? '0' + (calendar_month + 1) : (calendar_month + 1);
				var temp_date = (calendar_date <= 9) ? '0' + calendar_date : calendar_date;
				var day_string = calendar_year + '-' + temp_month + '-' + temp_date;
				// get today's my jobs for my calendar
				var temp_start_value = day_string + ' 00:00:00';
				var temp_end_value = day_string + ' 23:59:59';
				// query job
				var db = Titanium.Database.open(self.get_db_name());
				var rows = db.execute('SELECT my_job.*,my_job_assigned_user.assigned_from as assigned_from,my_job_assigned_user.assigned_to as assigned_to FROM my_job ' + 'left join my_job_assigned_user on (my_job_assigned_user.status_code=1 and my_job_assigned_user.manager_user_id=? and my_job_assigned_user.assigned_from != \'NULL\' ' + 'and ((my_job_assigned_user.assigned_from <=\'' + temp_end_value + '\' and my_job_assigned_user.assigned_to>=\'' + temp_start_value + '\')or'
								+ '(my_job_assigned_user.assigned_from <= \'' + temp_end_value + '\' and my_job_assigned_user.assigned_to>=\'' + temp_end_value + '\') or ' + '(my_job_assigned_user.assigned_from >= \'' + temp_start_value + '\' and my_job_assigned_user.assigned_from <= \'' + temp_end_value + '\'))) ' + 'WHERE my_job.company_id=? and my_job.status_code=1 and my_job.id < 1000000000 and my_job_assigned_user.job_id = my_job.id '
								+ 'and my_job.job_status_code not in (1,6,7,8,10)', _selected_user_id, _selected_company_id);
				if (rows.getRowCount() > 0) {
					var temp_var = {
						type : 'My Calendar',
						badge : rows.getRowCount()
					};
					result.push(temp_var);
					if (rows.getRowCount() > 0) {
						Titanium.UI.iPhone.appBadge = rows.getRowCount();
					} else {
						Titanium.UI.iPhone.appBadge = null;
					}
				} else {
					Titanium.UI.iPhone.appBadge = null;
				}
				rows.close();
				
				// get job id array or quote id array by
				// different upload status
				var job_id_array = [];
				var quote_id_array = [];
				rows = db.execute('SELECT * FROM my_updating_records WHERE upload_status in (3) and company_id=?', _selected_company_id);
				while (rows.isValidRow()) {
					if (rows.fieldByName('type') === 'job') {
						job_id_array.push(rows.fieldByName('relation_id'));
					}
					if (rows.fieldByName('type') === 'quote') {
						quote_id_array.push(rows.fieldByName('relation_id'));
					}
					rows.next();
				}
				rows.close();
				
				// rows = db.execute('SELECT * FROM
				// my_updating_records_for_data WHERE
				// company_id=?',_selected_company_id);
				// while(rows.isValidRow()){
				// if(rows.fieldByName('type') === 'job'){
				// job_id_array.push(rows.fieldByName('relation_id'));
				// }
				// if(rows.fieldByName('type') === 'quote'){
				// quote_id_array.push(rows.fieldByName('relation_id'));
				// }
				// rows.next();
				// }
				// rows.close();
				// task
				var task_badge_number = _get_badge_info_for_task();
				if (task_badge_number > 0) {
					temp_var = {
						type : 'Tasks',
						badge : task_badge_number
					};
					result.push(temp_var);
				}
				
				// local jobs
				var unsynced_job_badge_number = _get_badge_infor_for_unsynced_job_and_quote('job', job_id_array);
				if (unsynced_job_badge_number > 0) {
					temp_var = {
						type : 'Unsynced Jobs',
						badge : unsynced_job_badge_number
					};
					result.push(temp_var);
				}
				
				// local quotes
				var unsynced_quote_badge_number = _get_badge_infor_for_unsynced_job_and_quote('quote', quote_id_array);
				if (unsynced_quote_badge_number > 0) {
					temp_var = {
						type : 'Unsynced Quotes',
						badge : unsynced_quote_badge_number
					};
					result.push(temp_var);
				}
				
				rows = db.execute('SELECT * FROM my_frontend_config_setting where name=?', 'library_last_updated');
				if (rows.getRowCount() > 0) {
					if (rows.isValidRow()) {
						_library_last_updated = parseInt(rows.fieldByName('value'), 10);
					}
				}
				rows.close();
				
				db.close();
				return result;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _get_badge_info');
				return [];
			}
		}
		
		/*
		 * create uniqute scroll view to avoid crash for my calendar and
		 * teamview
		 */
		function _create_scroll_view() {
			try {
				var calendar_today_hour_distance = 60;// how
				// big
				// betweeen
				// solid
				// line
				var calendar_today_top_distance = 15;// how
				// big
				// between
				// top
				// of
				// calendr
				// and
				// toolbar
				// of
				// calendar
				// instrucation
				_scroll_view = Ti.UI.createScrollView({
					contentWidth : self.screen_width,
					contentHeight : 24 * calendar_today_hour_distance + 2 * calendar_today_top_distance,
					bottom : self.tool_bar_height,
					top : self.tool_bar_height,
					backgroundColor : '#fff',
					showVerticalScrollIndicator : true,
					showHorizontalScrollIndicator : false
				});
				var time_label = null;
				var solid_line = null;
				var broken_line = null;
				var time_text = '';
				for ( var i = 0; i < 25; i++) {
					
					if (i <= 12) {
						switch (i){
							case 0:
								time_text = '12:00 AM';
								break;
							case 12:
								time_text = '12:00 PM';
								break;
							default:
								time_text = i + ':00 AM';
						}
					} else {
						switch (i){
							case 24:
								time_text = '12:00 AM';
								break;
							default:
								time_text = (i - 12) + ':00 PM';
						}
					}
					time_label = Ti.UI.createLabel({
						width : 60,
						height : 12,
						left : 0,
						textAlign : 'right',
						top : parseInt(i * calendar_today_hour_distance + 10, 10),
						text : time_text,
						font : {
							fontSize : self.small_font_size,
							fontWeight : self.font_weight
						}
					});
					_scroll_view.add(time_label);
					solid_line = Ti.UI.createView({
						top : parseInt(calendar_today_top_distance + i * calendar_today_hour_distance, 10),
						left : 65,
						height : 1,
						width : self.screen_width,
						backgroundColor : '#000',
						opacity : 0.3
					});
					_scroll_view.add(solid_line);
					if (i != 24) {
						broken_line = Ti.UI.createLabel({
							width : self.screen_width,
							backgroundColor : '#fff',
							opacity : 0.3,
							text : 'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii'
						});
						var broken_line_view = Ti.UI.createView({
							top : parseInt(calendar_today_top_distance + (i + 0.5) * calendar_today_hour_distance, 10),
							left : 65,
							height : 1,
							width : self.screen_width,
							backgroundColor : '#fff'
						});
						broken_line_view.add(broken_line);
						// _scroll_view.add(broken_line);
						_scroll_view.add(broken_line_view);
					}
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _create_scroll_view');
				return;
			}
		}
		
		/**
		 * check badge for unsynced job and quote
		 */
		function _get_badge_infor_for_unsynced_job_and_quote(job_type, job_id_array) {
			try {
				var _selected_company_id = Ti.App.Properties.getString('current_company_id');
				// local jobs
				var unsynced_jobs_id_array = [];
				var sql_str = 'SELECT * FROM my_' + job_type + ' WHERE company_id=? and status_code=1 and ';
				if (job_id_array.length > 0) {
					sql_str += '((id in (' + job_id_array.join(',') + ') or ';
				}
				sql_str += '(exist_any_changed=1 or changed=1)';
				if (job_id_array.length > 0) {
					sql_str += '))';
				}
				var db = Titanium.Database.open(self.get_db_name());
				var rows = db.execute(sql_str, _selected_company_id);
				if (rows.getRowCount() > 0) {
					while (rows.isValidRow()) {
						unsynced_jobs_id_array.push(rows.fieldByName('id'));
						rows.next();
					}
				}
				rows.close();
				// check other relative tables
				var table_array = [];
				if (job_type === 'job') {
					table_array.push('my_' + job_type + '_operation_log');
				}
				table_array.push('my_' + job_type + '_status_log');
				table_array.push('my_' + job_type + '_client_contact');
				table_array.push('my_' + job_type + '_site_contact');
				table_array.push('my_' + job_type + '_note');
				table_array.push('my_' + job_type + '_asset');
				table_array.push('my_' + job_type + '_contact_history');
				table_array.push('my_' + job_type + '_assigned_user');
				table_array.push('my_' + job_type + '_assigned_item');
				table_array.push('my_' + job_type + '_invoice');
				table_array.push('my_' + job_type + '_invoice_signature');
				table_array.push('my_' + job_type + '_custom_report_data');
				table_array.push('my_' + job_type + '_custom_report_signature');
				for ( var i = 0, j = table_array.length; i < j; i++) {
					// if any changed record does not in the
					// my_updating_records, then set
					// is_make_changed = true
					rows = db.execute('SELECT * FROM ' + table_array[i] + ' WHERE changed=1 and ' + job_type + '_id=?', job_id_array.join(','));
					var row_count = rows.getRowCount();
					if (row_count > 0) {
						while (rows.isValidRow()) {
							unsynced_jobs_id_array.push(rows.fieldByName(job_type + '_id'));
							rows.next();
						}
					}
					rows.close();
				}
				
				unsynced_jobs_id_array = self.get_unique_array(unsynced_jobs_id_array);
				if (unsynced_jobs_id_array.length > 0) {
					db.execute('UPDATE my_' + job_type + ' SET exist_any_changed=1 WHERE id=?', unsynced_jobs_id_array.join(','));
				}
				db.close();
				return unsynced_jobs_id_array.length;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _get_badge_infor_for_unsynced_job_and_quote');
				return [];
			}
		}
		
		/**
		 * check badge for task
		 */
		function _get_badge_info_for_task() {
			try {
				var _selected_company_id = Ti.App.Properties.getString('current_company_id');
				var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
				// local jobs
				var task_id_array = [];
				var sql_str = 'SELECT * FROM my_job as a WHERE a.company_id=? and a.status_code=1 and a.is_task=1 and a.id in ' + '(select b.job_id from my_job_assigned_user as b where b.manager_user_id = ' + _selected_user_id + ' and b.status_code=1)';
				var db = Titanium.Database.open(self.get_db_name());
				var rows = db.execute(sql_str, _selected_company_id);
				if (rows.getRowCount() > 0) {
					while (rows.isValidRow()) {
						task_id_array.push(rows.fieldByName('id'));
						rows.next();
					}
				}
				rows.close();
				db.close();
				return task_id_array.length;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _get_badge_info_for_task');
				return [];
			}
		}
		
		/*
		 * remove all controls on window.
		 */
		function _remove_all_control_of_window(selectedWinIndex) {
			try {
				var selectWin = all_window_array[selectedWinIndex];
				all_window_array.splice(selectedWinIndex, 1);
				if (selectWin != undefined && selectWin != null) {
					for ( var i = selectWin.children.length - 1; i >= 0; i--) {
						selectWin.remove(selectWin.children[i]);
					}
					selectWin.is_close_all_window = true;
					selectWin.close();
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _remove_all_control_of_window');
			}
		}
		
	}
	
	win.addEventListener('focus', function() {
		try {
			Ti.App.Properties.setBool('refresh_list', false);
			Ti.App.Properties.setBool('lock_table_flag', false);
			var setupSendGpsEventFlag = Ti.App.Properties.getBool('setup_send_gps_event');
			if(setupSendGpsEventFlag == null){
				Ti.App.Properties.setBool('setup_send_gps_event',false);
			}
			if (main_page_obj === null) {
				Ti.App.Properties.setBool('upload_media_file_flag', false);
				var _selected_login_user_id = Ti.App.Properties.getString('current_login_user_id');
				var db = Titanium.Database.open(FieldTeam.prototype.get_db_name());
				var rows = db.execute('SELECT * FROM my_manager_user WHERE id=? and agreement=0', _selected_login_user_id);
				var is_display_agreement = false;
				var rowCount = rows.getRowCount();
				rows.close();
				if (rowCount > 0) {
					var row = db.execute('SELECT * FROM my_manager_user_agreement WHERE status_code=1 limit 1');
					if (row.getRowCount() > 0) {
						is_display_agreement = true;
					}
					row.close();
				}
				db.close();
				var P = function() {
				};
				P.prototype = transaction_page.prototype;
				main_page.prototype = new P();
				main_page.prototype.constructor = main_page;
				main_page_obj = new main_page();
				main_page_obj.init();
				main_page_obj.gps_turn_off_alert();// call
				Titanium.Platform.fireEvent('battery');
				// Titanium.Geolocation.fireEvent('location');
				if (is_display_agreement) {
					var agreementWindow = Ti.UI.createWindow({
						url : main_page_obj.get_file_path('url', 'agreement/agreement.js')
					});
					agreementWindow.open();
				}
			} else {
				main_page_obj.refresh_modules_list();
				main_page_obj.refresh_badge_info();
			}
			main_page_obj.refresh_last_updated_time_label();
		} catch (err) {
			alert(err);
			return;
		}
	});
	
	win.addEventListener('close', function() {
		try {
			Titanium.Platform.batteryMonitoring = false;
			Titanium.Platform.removeEventListener('battery');
			Ti.App.removeEventListener('async_save_data');
			main_page_obj.close_window();
			main_page_obj = null;
			win = null;
		} catch (err) {
			alert(err);
			return;
		}
	});
}());
