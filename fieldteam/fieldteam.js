/*jslint maxerr:10000 */
var host_list = [ 'http://manager.foxbuddy.com', 'http://manager.foxbuddy.com.au', 'http://manager.st.foxbuddy.com.au', 'http://manager.demo2.foxbuddy.com.au', 'http://manager.henry_f9.foxbuddy.com.au' ];
var host_media_list = [ 'http://media.foxbuddy.com', 'http://media.foxbuddy.com.au', 'http://media.st.foxbuddy.com.au', 'http://media.demo2.foxbuddy.com.au', 'http://media.henry_f9.foxbuddy.com.au' ];
var major_version_host_list = [ 'http://manager.foxbuddy.com.au', 'http://manager.foxbuddy.com' ];
function FieldTeam() {
	
}
FieldTeam.prototype = {
	window_source : 'fieldteam',
	// please check
	// http://developer.appcelerator.com/question/120964/sporadic-server-error-a-connection-failure-occurred
	// for enable_keep_alive setting.
	set_enable_keep_alive : true,// set this to fix HTTP request error.
	host_list : host_list,
	host_media_list : host_media_list,
	major_version_host_list : major_version_host_list,
	version : 'F1.1',
	version_increment : '10',
	base_backend_url : '/frontend_6_11_X/',
	// file_base_url : media_host,
	default_time_out : 60000,
	default_download_time_out : 120000,
	default_time_zone_offset : 0,
	count_for_job_query : 10,
	screen_width : Titanium.Platform.displayCaps.platformWidth,
	screen_height : Titanium.Platform.displayCaps.platformHeight,
	file_directory : Ti.Filesystem.applicationDataDirectory,
	login_background_image : 'login_bg.png',
	background_image : 'bg2.jpg',
	job_list_row_background_color : '#EAF0F7',// set odd row
	// background color
	font_color : '#000',
	selected_value_font_color : '#336699',
	hint_text_font_color : '#333',
	hint_text_font_opacity : 0.3,
	font_size : 18,
	font_weight : 'bold',
	font_family : 'Helvetica Neue',
	normal_font_size : 16,
	middle_font_size : 14,
	small_font_size : 12,
	section_header_title_font_color : '#4D576D',
	section_header_title_shadow_color : '#FAFAFA',
	section_header_title_shadow_offset : {
		x : 0,
		y : 1
	},
	table_view_row_number_label_background_color : '#99A9BD',
	month_list : [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
	day_list : [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
	minute_list : [ '00', '15', '30', '45' ],
	default_table_view_row_height : 45,
	default_gps_location_update_interval : 300000,// 5 mins,
	default_data_update_interval : 120000,// 2mins
	gps_settings : [ {
		type : 1,
		title : 'High Power',
		interval : 120000,
		distance : 50,
		accuracy : Titanium.Geolocation.ACCURACY_BEST,
		description : 'High Accuracy,but battery would be gone fast.(send gps every 2 minutes,50 meters)'
	}, {
		type : 1,
		title : 'Medium Power',
		interval : 300000,
		distance : 100,
		accuracy : Titanium.Geolocation.ACCURACY_BEST,
		description : 'Medium Accuracy,but saving a litter battery life.(send gps every 5 minutes,100 meters)'
	}, {
		type : 1,
		title : 'Low Power',
		interval : 600000,
		distance : 200,
		accuracy : Titanium.Geolocation.ACCURACY_HUNDRED_METERS,
		description : 'Low Accuracy,but saving battery life.(send location every 10 minutes,200 meters)'
	}, {
		type : 2,
		title : 'GPS Off',
		interval : 600000,
		distance : 200,
		accuracy : Titanium.Geolocation.ACCURACY_HUNDRED_METERS,
		description : 'GPS Off'
	} ],
	tool_bar_height : 44,
	tool_bar_background_color : '#CAC9CF',
	default_tool_bar_background_color : '#8294AD',
	calendar_week_name_abbr_list : [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ],
	calendar_font_color : '#fff',// '#1B313F'
	job_default_status_colour : '#ccc',
	job_list_description_default_colour : '#CAC9CF',
	default_thumb_image_width : 72,// default thumb image width
	default_camera_photo_width : 720,
	default_camera_photo_height : 960,
	maximum_audio_length : 300,// 5 minute
	maximum_video_length : 90000,// 90 seconds
	materials_type_code : 6,// this is code for materials/supplies type code
	// in
	// job_asset_type_code
	action_list : (Titanium.Platform.osname == 'ipad') ? [ 'Phone', 'SMS', 'Email', 'Notification', 'Cancel', '' ] : [ 'Phone', 'SMS', 'Email', 'Notification', 'Cancel' ],
	contact_source_list : [ 'Client Contacts', 'Site Contacts', 'Manager Users', 'Phone Book' ],
	modal_message_window : null,
	progress_bar : null,
	actInd : null,
	close_btn : null,// close model window
	loading_actInd : null,
	main_page_obj : null,// the object of main page.
	no_result_text_for_drag_down : 'No Result\n\n (Drag Down To Download)',
	default_main_menu_button_index : 0,
	ipad_button_reduce_length_in_tableview : 80,
	iphone_button_reduce_length_in_tableview : 18,
	gst_default_name : 'GST',
	set_animated_for_ios7 : false,
	set_table_view_header_backgroundcolor : '#EFEFF3',// '#EAF0F7',
	default_udid : 123456,
	default_device_type : 'ios',
	max_number_camera_take_photo_or_video : 9,
	tool_bar_color_in_ios_7 : '#C2C1C6',
	get_db_name : function() {
		return 'fieldteam.' + this.version + '.' + this.version_increment;
	},
	// get platform information
	get_platform_info : function() {
		return 'Platform Name:' + Ti.Platform.name + ',model:' + Titanium.Platform.model + ',version:' + Titanium.Platform.version;
	},
	get_host : function() {
		var self = this;
		try {
			var tempString = '';
			var db = Titanium.Database.open(self.get_db_name());
			var data_rows = db.execute('SELECT * FROM my_frontend_config_setting WHERE name=?', "host");
			if ((data_rows != null) && (data_rows.getRowCount() > 0)) {
				if (data_rows.isValidRow()) {
					tempString = data_rows.fieldByName('value');
				}
			}
			data_rows.close();
			db.close();
			return tempString;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - get_host');
			return '';
		}
	},
	get_host_url : function() {
		var self = this;
		try {
			var tempString = '';
			var db = Titanium.Database.open(self.get_db_name());
			var data_rows = db.execute('SELECT * FROM my_frontend_config_setting WHERE name=?', "host");
			if ((data_rows != null) && (data_rows.getRowCount() > 0)) {
				if (data_rows.isValidRow()) {
					tempString = data_rows.fieldByName('value');
				}
			}
			data_rows.close();
			db.close();
			if (tempString == null || tempString == '') {
				return '';
			} else {
				return tempString + self.base_backend_url;
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - get_host_url');
			return '';
		}
	},
	get_media_url : function() {
		var self = this;
		try {
			var tempString = '';
			var db = Titanium.Database.open(self.get_db_name());
			var data_rows = db.execute('SELECT * FROM my_frontend_config_setting WHERE name=?', "host_media");
			if ((data_rows != null) && (data_rows.getRowCount() > 0)) {
				if (data_rows.isValidRow()) {
					tempString = data_rows.fieldByName('value');
				}
			}
			db.close();
			return tempString;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - get_media_url');
			return '';
		}
	},
	is_major_host : function() {
		var self = this;
		try {
			var is_result = false;
			var tempString = self.get_host();
			Ti.API.info('tempString:' + tempString);
			for (var i = 0, j = self.major_version_host_list.length; i < j; i++) {
				Ti.API.info('self.major_version_host_list[i]:' + self.major_version_host_list[i]);
				if (tempString == self.major_version_host_list[i]) {
					is_result = true;
					break;
				}
			}
			return is_result;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - is_major_host');
			return false;
		}
	},
	is_simulator : function() {
		var self = this;
		try {
			if (Titanium.Platform.model == 'Simulator') {
				return true;
			}
			return false;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - is_simulator');
			return false;
		}
	},
	/**
	 * init function
	 */
	init : function() {
		var self = this;
		try {
			self.init_auto_release_pool(null);
			self.data = [];
			self.init_navigation_bar();
			self.init_vars();
			self.init_table_view();
			self.init_no_result_label();
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - init');
			return;
		}
	},
	/**
	 * init auot release pool, create an array to save all objects
	 */
	init_auto_release_pool : function(win) {
		var self = this;
		try {
			if (win != undefined) {
				win.is_close_all_window = false;
			}
			if (win != undefined && win != null) {
				Ti.App.selectWindowObject = win;
				Ti.App.fireEvent('add_window_to_global_array');
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - init_auto_release_pool');
			return;
		}
	},
	/**
	 * click main menu button, and return to index page note: index page
	 * push into queue as well, so app need to keep the index page in the
	 * queue. only pop up other windows.
	 */
	close_all_window_and_return_to_menu : function() {
		var self = this;
		try {
			Ti.App.fireEvent('close_all_window_and_return_to_menu');
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - close_all_window_and_return_to_menu');
			return;
		}
	},
	
	process_event_before_close_window : function() {
		var self = this;
		try {
			if ((self.data != undefined) && (self.data != null) && (self.data.length > 0)) {
				for (var m = 0, n = self.data.length; m < n; m++) {
					self.data[m] = null;
				}
				self.data = [];
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - process_event_before_close_window');
			return;
		}
	},
	/**
	 * close window, or do some extra events before call win.close
	 */
	close_window : function() {
		var self = this;
		try {
			self.process_event_before_close_window();
			if (!Ti.App.Properties.getBool('ready_remove_all_window_and_return_to_menu')) {
				Ti.App.fireEvent('close_window_from_global_array');
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - close_window');
			return;
		}
	},
	
	/**
	 * init variables
	 */
	init_vars : function() {
	},
	/**
	 * init navigation bar
	 */
	init_navigation_bar : function(right_btn_title, left_btn_title) {
		var self = this;
		try {
			self.nav_left_btn = null;
			self.nav_right_btn = null;
			
			// if button title exist ",", then it means that exist
			// multi buttons
			// on Tabbed bar
			
			self.left_buttons_objects = [];
			self.right_buttons_objects = [];
			if (Titanium.Platform.name === 'iPhone OS') {
				if (left_btn_title != undefined) {
					var left_btn_title_array = left_btn_title.split(',');
					if (left_btn_title_array.length <= 1) {
						self.nav_left_btn = Ti.UI.createButton({
							title : left_btn_title,
							style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED
						});
					} else {
						for (var i = 0; i < left_btn_title_array.length; i++) {
							switch (left_btn_title_array[i].toLowerCase()){
								case 'main':
									self.left_buttons_objects.push({
										name : left_btn_title_array[i].toLowerCase(),
										image : '/images/icons/home_2_24' + (self.is_ios_7_plus() ? '_blue' : '') + '.png',
										width : '50px'
									});
									break;
								case 'back':
									self.left_buttons_objects.push({
										name : left_btn_title_array[i].toLowerCase(),
										image : '/images/icons/back_2_24' + (self.is_ios_7_plus() ? '_blue' : '') + '.png',
										width : '50px'
									});
									break;
								default:
									self.left_buttons_objects.push({
										name : left_btn_title_array[i].toLowerCase(),
										title : self.ucfirst(left_btn_title_array[i]),
										width : '50px'
									});
									break;
							}
						}
						self.nav_left_btn = Titanium.UI.iOS.createTabbedBar({
							labels : self.left_buttons_objects,
							style : Titanium.UI.iPhone.SystemButtonStyle.BAR
						});
					}
					Titanium.UI.currentWindow.setLeftNavButton(self.nav_left_btn);
				}
				
				if ((right_btn_title != undefined) && (right_btn_title != '')) {
					var right_btn_title_array = right_btn_title.split(',');
					if (right_btn_title_array.length <= 1) {
						switch (right_btn_title.toLowerCase()){
							case 'add':
								self.nav_right_btn = Ti.UI.createButton({
									systemButton : Titanium.UI.iPhone.SystemButton.ADD
								});
								break;
							case 'refresh':
								self.nav_right_btn = Ti.UI.createButton({
									systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
								});
								break;
							case 'done':
								self.nav_right_btn = Ti.UI.createButton({
									systemButton : Titanium.UI.iPhone.SystemButton.DONE
								});
								break;
							case 'save':
								self.nav_right_btn = Ti.UI.createButton({
									systemButton : Titanium.UI.iPhone.SystemButton.SAVE
								});
								break;
							default:
								self.nav_right_btn = Ti.UI.createButton({
									title : right_btn_title,
									style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED
								});
						}
					} else {
						for (var i = 0; i < right_btn_title_array.length; i++) {
							switch (right_btn_title_array[i].toLowerCase()){
								default:
									self.right_buttons_objects.push({
										name : right_btn_title_array[i].toLowerCase(),
										title : self.ucfirst(right_btn_title_array[i]),
										width : '50px'
									});
							}
						}
						self.nav_right_btn = Titanium.UI.createButtonBar({
							labels : self.right_buttons_objects,
							style : Titanium.UI.iPhone.SystemButtonStyle.BAR
						});
					}
					Titanium.UI.currentWindow.setRightNavButton(self.nav_right_btn);
				}
			}
			
			if (self.nav_left_btn != null) {
				self.nav_left_btn.addEventListener('click', function(e) {
					self.nav_left_btn_click_event(e);
				});
			}
			if (self.nav_right_btn != null) {
				self.nav_right_btn.addEventListener('click', function(e) {
					self.nav_right_btn_click_event(e);
				});
			}
			
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - init_navigation_bar');
			return;
		}
	},
	/**
	 * init table view
	 */
	init_table_view : function(type) {
		var self = this;
		try {
			if (Titanium.Platform.name == 'android') {
				self.table_view = Ti.UI.createTableView({
					backgroundColor : '#000',
					data : self.data,
					minRowHeight : self.default_table_view_row_height
				});
				Titanium.UI.currentWindow.add(self.table_view);
			} else {
				self.table_view = Ti.UI.createTableView({
					data : self.data,
					style : (((type === undefined) || (self.trim(type) === 'grouped')) && (!self.is_ios_7_plus())) ? Ti.UI.iPhone.TableViewStyle.GROUPED : Ti.UI.iPhone.TableViewStyle.PLAIN,
					minRowHeight : self.default_table_view_row_height
				});
				Titanium.UI.currentWindow.add(self.table_view);
			}
			self.table_view.addEventListener('click', function(e) {
				self.table_view_click_event(e);
			});
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - init_table_view');
			return;
		}
	},
	/**
	 * show no result text if query result is null
	 */
	init_no_result_label : function() {
		var self = this;
		try {
			self.no_result_label = Ti.UI.createLabel({
				background : 'transparent',
				text : 'No Result',
				color : '#336699',
				width : 'auto',
				textAlign : 'center',
				font : {
					fontSize : 20,
					fontWeight : 'bold'
				}
			});
			Titanium.UI.currentWindow.add(self.no_result_label);
			if (self.data.length > 0) {
				self.no_result_label.visible = false;
			} else {
				self.no_result_label.visible = true;
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - init_no_result_label');
			return;
		}
	},
	/**
	 * table view click event
	 */
	table_view_click_event : function() {
	},
	/**
	 * navigation bar's right button click event
	 */
	nav_right_btn_click_event : function(e) {
	},
	/**
	 * navigation bar's left button click event
	 */
	nav_left_btn_click_event : function(e) {
		var self = this;
		try {
			if (e.index == self.default_main_menu_button_index) {// menu
				// menu
				self.close_all_window_and_return_to_menu();
			} else {// back button
				Titanium.UI.currentWindow.is_close_all_window = false;
				Titanium.UI.currentWindow.close();
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - nav_left_btn_click_event');
			return;
		}
	},
	/**
	 * some streets haven't street type. I have set street is full street.
	 * But street still only display street name (without street type).
	 * Reset street with this function. (this function support all street
	 * style.)
	 */
	display_correct_street : function(street, street_type) {
		var self = this;
		try {
			if ((street === undefined) || (street === null) || (street === '')) {
				return '';
			}
			if ((street_type === undefined) || (street_type === null) || (street_type === '')) {
				return street;
			}
			var temp_street = street.toLowerCase();
			var temp_street_type = street_type.toLowerCase();
			var temp_array = temp_street.split(' ');
			if (temp_array.length > 0) {
				if (temp_array[temp_array.length - 1] === temp_street_type) {
					return street;
				} else {
					if (temp_street_type == '(blank)') {
						return street;
					} else {
						return street + ' ' + street_type;
					}
				}
			}
			return street;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - display_correct_street');
			return '';
		}
	},
	/**
	 * display model indicator window
	 */
	display_indicator : function(message, has_progress_bar, has_cancel_btn) {
		var self = this;
		function _create_model_message_window(message, has_progress_bar, has_cancel_btn) {
			try {
				if (self.is_iphone_os()) {
					// for iphone and iƒpad
					self.modal_message_window = Ti.UI.createWindow({
						backgroundColor : '#999',
						fullscreen : false,
						opacity : 0.8
					});
					self.sub_modal_message_window = Titanium.UI.createView({
						backgroundColor : '#113D69',
						borderWidth : 4,
						borderColor : '#999',
						height : 120,
						width : 280,
						borderRadius : 8
					});
					self.modal_message_window.add(self.sub_modal_message_window);
					if (has_progress_bar) {
						self.actInd = Ti.UI.createActivityIndicator({
							font : {
								fontSize : self.font_size,
								fontWeight : self.font_weight
							},
							color : '#fff',
							message : message,
							width : 'auto',
							height : 'auto'
						});
						if (has_cancel_btn != undefined && has_cancel_btn != null && has_cancel_btn == true) {
							self.actInd.top = 30;
						}
						self.sub_modal_message_window.add(self.actInd);
						self.actInd.show();
						self.progress_bar = Titanium.UI.createProgressBar({
							width : 280,
							min : 0,
							max : 1,
							value : 0,
							height : 50,
							color : '#888',
							style : Titanium.UI.iPhone.ProgressBarStyle.PLAIN,
							font : {
								fontSize : 14,
								fontWeight : 'bold'
							},
							bottom : (has_cancel_btn != undefined && has_cancel_btn != null && has_cancel_btn == true) ? 38 : 15
						});
						if (has_cancel_btn != undefined && has_cancel_btn != null && has_cancel_btn == true) {
						} else {
							self.progress_bar.width = 200;
						}
						self.sub_modal_message_window.add(self.progress_bar);
						self.progress_bar.show();
						if (has_cancel_btn != undefined && has_cancel_btn != null && has_cancel_btn == true) {
							// self.actInd_cancel_line
							// = Ti.UI.createView({
							// width : 280,
							// height : 1,
							// bottom : 45,
							// borderWidth : 1,
							// borderColor : '#ccc'
							// });
							// self.sub_modal_message_window.add(self.actInd_cancel_line);
							self.actInd_cancel_btn = Titanium.UI.createButton({
								width : 200,
								height : 40,
								bottom : 10,
								title : 'Cancel',
								color : '#fff',
								font : {
									fontSize : self.font_size,
									fontWeight : self.font_weight
								}
							});
							self.sub_modal_message_window.add(self.actInd_cancel_btn);
							self.actInd_cancel_btn.addEventListener('click', function(e) {
								Ti.App.Properties.setBool('is_hide_indicator', true);
							});
						}
					} else {
						self.actInd = Ti.UI.createActivityIndicator({
							font : {
								fontSize : self.font_size,
								fontWeight : self.font_weight
							},
							color : '#fff',
							message : message,
							width : 'auto',
							height : 'auto'
						});
						if (has_cancel_btn != undefined && has_cancel_btn != null && has_cancel_btn == true) {
							self.actInd.top = 30;
						}
						self.sub_modal_message_window.add(self.actInd);
						self.actInd.show();
						if (has_cancel_btn != undefined && has_cancel_btn != null && has_cancel_btn == true) {
							self.actInd_cancel_line = Ti.UI.createView({
								width : 280,
								height : 1,
								bottom : 45,
								borderWidth : 1,
								borderColor : '#ccc'
							});
							self.sub_modal_message_window.add(self.actInd_cancel_line);
							self.actInd_cancel_btn = Titanium.UI.createButton({
								width : 200,
								height : 40,
								bottom : 5,
								title : 'Cancel',
								color : '#fff',
								font : {
									fontSize : self.font_size,
									fontWeight : self.font_weight
								}
							});
							self.sub_modal_message_window.add(self.actInd_cancel_btn);
							self.actInd_cancel_btn.addEventListener('click', function(e) {
								Ti.App.Properties.setBool('is_hide_indicator', true);
							});
						}
					}
				} else {
					self.actInd = Ti.UI.createActivityIndicator({
						font : {
							fontSize : self.font_size,
							fontWeight : self.font_weight
						},
						color : '#fff',
						message : message,
						width : 'auto',
						height : 'auto'
					});
					self.actInd.show();
				}
			} catch (err) {
				self.process_simple_error_message(err, self.window_source + ' - init');
				return;
			}
		}
		
		try {
			if ((has_progress_bar === null) || (has_progress_bar === undefined)) {
				has_progress_bar = false;
			}
			_create_model_message_window(message, has_progress_bar, has_cancel_btn);
			if (self.is_iphone_os()) {
				self.modal_message_window.open({
					modal : false
				});
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - display_indicator');
			return;
		}
	},
	/**
	 * get selected currency in setting value
	 */
	get_selected_currency : function() {
		var self = this;
		try {
			var tempCurrency = Ti.App.Properties.getString('selected_currency');
			tempCurrency = (tempCurrency == null) ? '' : tempCurrency;
			tempCurrency = (self.trim(tempCurrency) == '') ? '$' : tempCurrency;
			return tempCurrency;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - get_selected_currency');
			return '';
		}
	},
	/**
	 * format number to currency
	 */
	currency_formatted : function(amount) {
		var self = this;
		try {
			if (amount == '') {
				return '0.00';
			}
			var i = parseFloat(amount);
			if (isNaN(i)) {
				return '0.00';
			}
			// i = Math.abs(i);
			i = Math.round(i * 100) / 100;
			// i = parseInt((i) * 100);
			// i = i / 100;
			var s = i + '';
			if (s.indexOf('.') < 0) {
				s += '.00';
			}
			if (s.indexOf('.') == (s.length - 2)) {
				s += '0';
			}
			return s;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - currency_formatted');
			return '';
		}
	},
	/**
	 * update indicator message
	 */
	update_message : function(message) {
		var self = this;
		try {
			if (self.is_iphone_os()) {
				if (self.modal_message_window != null) {
					if (self.actInd != null) {
						self.actInd.message = message;
					}
				}
			} else {
				if (self.actInd != null) {
					self.actInd.message = message;
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_message');
			return;
		}
	},
	/**
	 * update progress bar value
	 */
	update_progress : function(new_progress, has_progress_bar) {
		var self = this;
		try {
			if (self.is_iphone_os()) {
				if (self.modal_message_window != null) {
					if ((has_progress_bar) && (self.progress_bar != null)) {
						self.progress_bar.value = new_progress;
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_progress');
			return;
		}
	},
	/**
	 * hide indicator window
	 */
	hide_indicator : function() {
		var self = this;
		try {
			if (self.is_iphone_os()) {
				if (self.modal_message_window != null) {
					self.modal_message_window.close();
					self.modal_message_window = null;
					self.sub_modal_message_window = null;
					if (self.progress_bar != null) {
						self.progress_bar = null;
					}
					if (self.actInd != null) {
						self.actInd = null;
					}
				}
			} else {
				if (self.actInd != null) {
					self.actInd.hide();
					self.actInd = null;
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - hide_indicator');
			return;
		}
	},
	/**
	 * get uniqute array lsit
	 */
	get_file_path : function(type, filename) {
		var self = this;
		try {
			var temp_str = '';
			switch (type){
				case 'database':
					Titanium.include(Ti.App.Properties.getString('base_folder_name') + 'database/' + filename);
					break;
				case 'url':
					temp_str = Ti.App.Properties.getString('base_folder_name') + filename;
					break;
				case 'image':
					temp_str = '/images/' + filename;
					break;
			}
			return temp_str;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - get_file_path');
			return '';
		}
	},
	/**
	 * get unique array by old array
	 */
	get_unique_array : function(old_array) {
		var self = this;
		try {
			var new_array = [];
			if (old_array.length <= 0) {
				return new_array;
			}
			var sorted_arr = old_array.sort();
			for (var i = 0, j = sorted_arr.length; i < j; i++) {
				var flag = false;
				for (var m = 0, n = new_array.length; m < n; m++) {
					if (new_array[m] === sorted_arr[i]) {
						flag = true;
						break;
					}
				}
				if (!flag) {
					new_array.push(sorted_arr[i]);
				}
			}
			return new_array;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - get_unique_array');
			return [];
		}
	},
	/**
	 * set first letter is upper case.
	 */
	ucfirst : function(string) {
		var self = this;
		try {
			if ((string === null) || (string === undefined) || (string === '')) {
				return '';
			} else {
				return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - ucfirst');
			return '';
		}
	},
	/**
	 * set first letter of every word is upper case
	 */
	ucfirst_for_each : function(string) {
		var self = this;
		try {
			if ((string === null) || (string === undefined) || (string === '')) {
				return '';
			} else {
				string = string.replace(/^\s+|\s+$/g, "");
				var str_array = string.split(' ');
				var result_str = '';
				for (var i = 0; i < str_array.length; i++) {
					if (i === 0) {
						result_str += self.ucfirst(str_array[i]);
					} else {
						result_str += ' ' + self.ucfirst(str_array[i]);
					}
				}
				return result_str;
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - ucfirst_for_each');
			return '';
		}
	},
	/**
	 * get days number of selected year and month
	 */
	days_number_of_month : function(iYear, iMonth) {
		var self = this;
		try {
			return 32 - new Date(iYear, iMonth, 32).getDate();
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - days_number_of_month');
			return 0;
		}
	},
	/**
	 * get first date of this week by selected year,month, date
	 */
	get_the_first_day_of_this_week : function(y, m, d) {
		var self = this;
		try {
			var temp_date = new Date(y, m, d);
			var sDay = temp_date.getDay();
			if (sDay === 0) {
				sDay = 7;
			}
			var start_temp_date = new Date(temp_date.getTime() - (sDay - 1) * 24 * 3600 * 1000);
			var sMonth = 0;
			var sDate = 0;
			if ((start_temp_date.getMonth() + 1) <= 9) {
				sMonth = '0' + (start_temp_date.getMonth() + 1);
			} else {
				sMonth = start_temp_date.getMonth() + 1;
			}
			if (start_temp_date.getDate() <= 9) {
				sDate = '0' + start_temp_date.getDate();
			} else {
				sDate = start_temp_date.getDate();
			}
			return start_temp_date.getFullYear() + '-' + sMonth + '-' + sDate;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - get_the_first_day_of_this_week');
			return '';
		}
	},
	/**
	 * get last date of this week by selected year,month, date
	 */
	get_the_last_day_of_this_week : function(y, m, d) {
		var self = this;
		try {
			var temp_date = new Date(y, m, d);
			var sDay = temp_date.getDay();
			var end_temp_date = new Date(temp_date.getTime() + (7 - sDay) * 24 * 3600 * 1000);
			var sMonth = 0;
			var sDate = 0;
			if ((end_temp_date.getMonth() + 1) <= 9) {
				sMonth = '0' + (end_temp_date.getMonth() + 1);
			} else {
				sMonth = end_temp_date.getMonth() + 1;
			}
			
			if (end_temp_date.getDate() <= 9) {
				sDate = '0' + end_temp_date.getDate();
			} else {
				sDate = end_temp_date.getDate();
			}
			
			return end_temp_date.getFullYear() + '-' + sMonth + '-' + sDate;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - get_the_last_day_of_this_week');
			return '';
		}
	},
	/**
	 * trim string
	 */
	trim : function(str) {
		var self = this;
		try {
			if ((str === undefined) || (str === null)) {
				return '';
			}
			str = '' + str;
			return str.replace(/^\s*/, "").replace(/\s*$/, "");
			// return str.replace(/^\s+|\s+$/g,"");
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - trim');
			return '';
		}
	},
	/**
	 * replace query_str of origin string with replace_str
	 */
	replace : function(origin_str, query_str, replace_str) {
		var self = this;
		try {
			if ((origin_str === undefined) || (origin_str === null) || (origin_str === '')) {
				return '';
			}
			origin_str = origin_str.toString();
			return origin_str.replace(new RegExp(query_str.toString(), "g"), replace_str.toString());
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - replace');
		}
	},
	/**
	 * check address will send request to server and get latitude and
	 * longitude of address
	 */
	check_address : function(params) {
		var self = this;
		try {
			var xhr = null;
			if (self.set_enable_keep_alive) {
				xhr = Ti.Network.createHTTPClient({
					enableKeepAlive : false
				});
			} else {
				xhr = Ti.Network.createHTTPClient();
			}
			xhr.onload = function() {
				try {
					Ti.API.info(this.responseText);
					if ((xhr.readyState === 4) && (this.status === 200)) {
						if (self.return_to_login_page_if_user_security_session_changed(this.responseText)) {
							return;
						}
						if (self.display_app_version_incompatiable(this.responseText)) {
							if (params.hide_indicator) {
								self.hide_indicator();
							}
							return;
						}
						Ti.API.info(this.responseText);
						var temp_result = JSON.parse(this.responseText);
						if (params.hide_indicator) {
							self.hide_indicator();
						}
						if ((temp_result.error != undefined) && (temp_result.error.length > 0)) {
							if ((temp_result.suggestions != undefined) && (temp_result.suggestions.length > 0)) {
								self.displaySuggestionSuburbList(this.responseText, params);
							} else {
								var error_string = '';
								for (var i = 0, j = temp_result.error.length; i < j; i++) {
									if (i == j) {
										error_string += temp_result.error[i];
									} else {
										error_string += temp_result.error[i] + '\n';
									}
								}
								self.show_message(error_string);
							}
							return;
						} else {
							params.latitude = (temp_result.latitude === undefined) ? null : temp_result.latitude;
							params.longitude = (temp_result.longitude === undefined) ? null : temp_result.longitude;
							params.street_type_id = (temp_result.locality_street_type_id === undefined) ? 0 : temp_result.locality_street_type_id;
							params.suburb_id = (temp_result.locality_suburb_id === undefined) ? 0 : temp_result.locality_suburb_id;
							params.postcode = (temp_result.postcode === undefined) ? '' : temp_result.postcode;
							self.save_address(params);
						}
					} else {
						if (params.hide_indicator) {
							self.hide_indicator();
						}
						var error_params = {
							message : "Checking address failed.",
							show_message : true,
							message_title : '',
							send_error_email : true,
							error_message : '',
							error_source : self.window_source + ' - check_address - xhr.onload - 1',
							server_response_message : this.reponseText
						};
						self.processXYZ(error_params);
						return;
					}
				} catch (e) {
					if (params.hide_indicator) {
						self.hide_indicator();
					}
					error_params = {
						message : "Checking address failed.",
						show_message : true,
						message_title : '',
						send_error_email : true,
						error_message : e,
						error_source : self.window_source + ' - check_address - xhr.onload - 2',
						server_response_message : this.reponseText
					};
					self.processXYZ(error_params);
					return;
				}
			};
			xhr.onerror = function(e) {
				if (params.hide_indicator) {
					self.hide_indicator();
				}
				var error_params = {
					message : "Checking address failed.",
					show_message : true,
					message_title : '',
					send_error_email : true,
					error_message : e,
					error_source : self.window_source + ' - check_address - xhr.onerror',
					server_response_message : this.reponseText
				};
				self.processXYZ(error_params);
				return;
			};
			xhr.setTimeout(self.default_time_out);
			xhr.open('POST', self.get_host_url() + 'update', false);
			xhr.send({
				'type' : (self.trim(params.street) == '') ? 'check_address_only_suburb' : 'check_address',
				'hash' : params.user_id,
				'sub_number' : params.sub_number,
				'unit_number' : params.unit_number,
				'street_number' : params.street_number,
				'street_type' : params.street_type,
				'street' : params.street,
				'suburb' : params.suburb,
				'postcode' : params.postcode,
				'locality_state_id' : params.state_id,
				'locality_country_id' : Ti.App.Properties.getString('selected_country_id'),
				'new_addr' : params.new_addr,
				'new_addr_state_and_country' : params.new_addr_state_and_country,
				'app_security_session' : self.is_simulator() ? self.default_udid : Titanium.Platform.id,
				'app_version_increment' : self.version_increment,
				'app_version' : self.version,
				'app_platform' : self.get_platform_info()
			});
		} catch (err) {
			self.hide_indicator();
			self.process_simple_error_message(err, self.window_source + ' - check_address');
			return;
		}
	},
	/**
	 * display suggestion suburb list
	 */
	displaySuggestionSuburbList : function(responseText, params) {
		var self = this;
		try {
			var suggestionArray = [];
			var suggestionLabels = [];
			var temp_result = JSON.parse(responseText);
			for (var i = 0, j = temp_result.suggestions.length; i < j; i++) {
				suggestionLabels.push(temp_result.suggestions[i].label);
				var suggestionSuburb = {
					suburb_id : temp_result.suggestions[i].suburb_id,
					suburb : temp_result.suggestions[i].suburb,
					postcode : temp_result.suggestions[i].postcode
				};
				suggestionArray.push(suggestionSuburb);
			}
			suggestionLabels.push('Cancel');
			if (self.is_ipad()) {
				suggestionLabels.push('');
			}
			var optionDialog = Ti.UI.createOptionDialog({
				options : suggestionLabels,
				buttonNames : [ 'Cancel' ],
				destructive : 0,
				cancel : (self.is_ipad() ? suggestionLabels.length - 2 : suggestionLabels.length - 1),
				title : 'Please select a suburb.'
			});
			optionDialog.show();
			optionDialog.addEventListener('click', function(evt) {
				if (suggestionLabels[evt.index] === 'Cancel' || suggestionLabels[evt.index] === '') {
				} else {
					params.suburb_id = suggestionArray[evt.index].suburb_id;
					params.suburb = suggestionArray[evt.index].suburb;
					params.postcode = suggestionArray[evt.index].postcode;
					
					var new_addr = params.street_number + ',+' + params.street + ',+' + params.suburb;
					if (params.street == null || params.street == '') {
						if (params.suburb != '') {
							new_addr = params.suburb;
						} else {
							new_addr = '';
						}
					}
					var temp_country = Titanium.App.Properties.getString('selected_country_name');
					temp_country = (temp_country === null) ? '' : temp_country;
					var new_addr_state_and_country = '';
					if (self.trim(temp_country) != '') {
						new_addr_state_and_country = ((new_addr != '') ? ',+' : '') + params.state + ',+' + temp_country;
					} else {
						new_addr_state_and_country = ((new_addr != '') ? ',+' : '') + params.state;
					}
					new_addr = self.replace(new_addr, ' ', '+');
					new_addr_state_and_country = self.replace(new_addr_state_and_country, ' ', '+');
					params.new_addr = new_addr;
					params.new_addr_state_and_country = new_addr_state_and_country;
					if (Ti.Network.online) {
						params.hide_indicator = true;
						self.display_indicator('Checking Address ...', true);
						Ti.API.info("params suburb_id:" + params.suburb_id);
						Ti.API.info("params suburb:" + params.suburb);
						Ti.API.info("params postcode:" + params.postcode);
						Ti.API.info("params new_addr:" + params.new_addr);
						Ti.API.info("params new_addr_state_and_country:" + params.new_addr_state_and_country);
						Ti.API.info("params street:" + params.street);
						Ti.API.info("params street_type:" + params.street_type);
						
						self.check_address(params);
					} else {
						self.save_address(params);
					}
				}
			});
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - displaySuggestionSuburbList');
			return;
		}
	},
	/**
	 * save address and get latitude,longitude
	 */
	save_address : function(params) {
	},
	/**
	 * check if it's iphone
	 */
	is_iphone_os : function() {
		var self = this;
		try {
			return (Titanium.Platform.name == 'iPhone OS') ? true : false;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - is_iphone_os');
			return false;
		}
	},
	/**
	 * check if it's iphone 3.2+
	 */
	is_iphone_3_2_plus : function() {
		var self = this;
		try {
			// add iphone specific tests
			if (Titanium.Platform.name == 'iPhone OS') {
				var version = Titanium.Platform.version.split(".");
				var major = parseInt(version[0], 10);
				var minor = parseInt(version[1], 10);
				
				// can only test this support on a 3.2+ device
				if (major > 3 || (major == 3 && minor > 1)) {
					return true;
				}
			}
			return false;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - is_iphone_3_2_plus');
			return false;
		}
	},
	/**
	 * check if it's iphone 4
	 */
	is_iphone_5 : function() {
		var self = this;
		try {
			if (Titanium.Platform.name == 'iPhone OS') {
				if (Ti.Platform.displayCaps.density == 'high') {
					if (Ti.Platform.displayCaps.platformHeight == 568) {
						return true;
					}
				}
			}
			return false;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - is_iphone_5');
			return false;
		}
	},
	
	is_iphone_4 : function() {
		var self = this;
		try {
			if (Titanium.Platform.name == 'iPhone OS') {
				if (Ti.Platform.displayCaps.density == 'high') {
					if (Ti.Platform.displayCaps.platformHeight == 480) {
						return true;
					}
				}
			}
			return false;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - is_iphone_4');
			return false;
		}
	},
	
	is_ios_4_plus : function() {
		var self = this;
		try {
			if (Titanium.Platform.name == 'iPhone OS') {
				var version = Titanium.Platform.version.split(".");
				Ti.API.info('version:' + version);
				var major = parseInt(version[0], 10);
				
				// can only test this support on a 3.2+ device
				if (major >= 4) {
					return true;
				}
			}
			return false;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - is_ios_4_plus');
			return false;
		}
	},
	
	is_ios_7_plus : function() {
		var self = this;
		try {
			// iOS-specific test
			if (Titanium.Platform.name == 'iPhone OS') {
				var version = Titanium.Platform.version.split(".");
				var major = parseInt(version[0], 10);
				
				// Can only test this support on a 3.2+ device
				if (major >= 7) {
					return true;
				}
			}
			return false;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - is_ios_7_plus');
			return false;
		}
	},
	/**
	 * check if it's ipad
	 */
	is_ipad : function() {
		var self = this;
		try {
			return (Titanium.Platform.osname == 'ipad') ? true : false;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - is_ipad');
			return false;
		}
	},
	/*
	 * set text field style for ios7
	 */
	set_text_field_for_ios_7 : function(object) {
		var self = this;
		try {
			if (self.is_ios_7_plus()) {
				object.borderWidth = 1;
				object.borderColor = '#ccc';
				object.borderRadius = 5;
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - set_text_field_for_ios_7');
			return;
		}
	},
	/**
	 * get seconds value by time string
	 */
	get_seconds_value_by_time_string : function(date_string) {
		var self = this;
		try {
			if ((date_string === undefined) || (date_string === null) || (date_string === '') || (date_string === 0)) {
				return 0;
			}
			var date_array1 = date_string.split(' ');
			if (date_array1.length == 1) {
				date_array1.push('00:00:00');
			}
			var date_array2 = date_array1[0].split('-');
			var date_array3 = date_array1[1].split(':');
			var d_y = parseInt(date_array2[0], 10);
			var d_m = parseInt(date_array2[1], 10) - 1;
			var d_d = parseInt(date_array2[2], 10);
			var d_h = parseInt(date_array3[0], 10);
			var d_i = parseInt(date_array3[1], 10);
			var d_s = parseInt(date_array3[2], 10);
			var d = new Date(d_y, d_m, d_d, d_h, d_i, d_s, 0);
			return parseInt(d.getTime() / 1000, 10);
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - get_seconds_value_by_time_string');
			return 0;
		}
	},
	/**
	 * display time and date with second
	 */
	display_time_and_date_with_second : function(int_time) {
		var self = this;
		try {
			var scheduled_date = null;
			if (int_time <= 0) {
				scheduled_date = new Date();
			} else {
				scheduled_date = new Date(int_time * 1000);
			}
			// scheduled_date =
			// self.get_correct_date_and_time(scheduled_date);
			var scheduled_date_year = scheduled_date.getFullYear();
			var scheduled_date_month = scheduled_date.getMonth();
			var scheduled_date_date = scheduled_date.getDate();
			var scheduled_date_day = scheduled_date.getDay();
			var scheduled_date_hours = scheduled_date.getHours();
			var scheduled_from_date_seconds = scheduled_date.getSeconds();
			var scheduled_from_date_minutes = scheduled_date.getMinutes();
			var scheduled_from_text = '';
			scheduled_from_text = self.day_list[scheduled_date_day] + ', ' + ((scheduled_date_date <= 9) ? '0' + scheduled_date_date : scheduled_date_date) + ' ' + self.month_list[scheduled_date_month] + ' ' + scheduled_date_year + ' ' + ((scheduled_date_hours <= 9) ? '0' + scheduled_date_hours : scheduled_date_hours) + ':' + ((scheduled_from_date_minutes <= 9) ? '0' + scheduled_from_date_minutes : scheduled_from_date_minutes) + ':' + scheduled_from_date_seconds;
			return scheduled_from_text;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - display_time_and_date_with_second');
			return '';
		}
	},
	/**
	 * display time and date
	 */
	display_time_and_date : function(int_time) {
		var self = this;
		try {
			var scheduled_date = null;
			if (int_time <= 0) {
				scheduled_date = new Date();
			} else {
				scheduled_date = new Date(int_time * 1000);
			}
			// scheduled_date =
			// self.get_correct_date_and_time(scheduled_date);
			var scheduled_date_year = scheduled_date.getFullYear();
			
			var scheduled_date_month = scheduled_date.getMonth();
			var scheduled_date_date = scheduled_date.getDate();
			var scheduled_date_day = scheduled_date.getDay();
			var scheduled_date_hours = scheduled_date.getHours();
			var scheduled_date_ampm = 'AM';
			
			if (scheduled_date_hours >= 12) {
				if (scheduled_date_hours > 12) {
					scheduled_date_hours -= 12;
				}
				scheduled_date_ampm = 'PM';
			}
			var scheduled_from_date_minutes = scheduled_date.getMinutes();
			var scheduled_from_text = '';
			scheduled_from_text = self.day_list[scheduled_date_day] + ', ' + ((scheduled_date_date <= 9) ? '0' + scheduled_date_date : scheduled_date_date) + ' ' + self.month_list[scheduled_date_month] + ' ' + scheduled_date_year + ' ' + ((scheduled_date_hours <= 9) ? '0' + scheduled_date_hours : scheduled_date_hours) + ':' + ((scheduled_from_date_minutes <= 9) ? '0' + scheduled_from_date_minutes : scheduled_from_date_minutes) + scheduled_date_ampm;
			return scheduled_from_text;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - display_time_and_date');
			return '';
		}
	},
	
	/**
	 * display date
	 */
	display_date_only : function(int_time) {
		var self = this;
		try {
			var scheduled_date = null;
			if (int_time <= 0) {
				scheduled_date = new Date();
			} else {
				scheduled_date = new Date(int_time * 1000);
			}
			// scheduled_date =
			// self.get_correct_date_and_time(scheduled_date);
			var scheduled_date_year = scheduled_date.getFullYear();
			var scheduled_date_month = scheduled_date.getMonth();
			var scheduled_date_date = scheduled_date.getDate();
			var scheduled_date_day = scheduled_date.getDay();
			var scheduled_from_text = '';
			scheduled_from_text = self.day_list[scheduled_date_day] + ', ' + ((scheduled_date_date <= 9) ? '0' + scheduled_date_date : scheduled_date_date) + ' ' + self.month_list[scheduled_date_month] + ' ' + scheduled_date_year;
			return scheduled_from_text;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - display_date_only');
			return '';
		}
	},
	/**
	 * figure out date and time by int value
	 */
	figure_out_date_and_time : function(int_time, is_long_string) {
		var self = this;
		try {
			if ((is_long_string === null) || (is_long_string === undefined)) {
				is_long_string = false;
			}
			var scheduled_date = null;
			if (int_time <= 0) {
				scheduled_date = new Date();
			} else {
				scheduled_date = new Date(int_time * 1000);
			}
			// scheduled_date =
			// self.get_correct_date_and_time(scheduled_date);
			var scheduled_date_year = scheduled_date.getFullYear();
			var scheduled_date_month = scheduled_date.getMonth();
			var scheduled_date_date = scheduled_date.getDate();
			var scheduled_date_day = scheduled_date.getDay();
			var scheduled_date_hours = scheduled_date.getHours();
			var scheduled_date_ampm = 'AM';
			if (scheduled_date_hours >= 12) {
				if (scheduled_date_hours > 12) {
					scheduled_date_hours -= 12;
				}
				scheduled_date_ampm = 'PM';
			}
			var scheduled_from_date_minutes = scheduled_date.getMinutes();
			var scheduled_from_text = '';
			if (!is_long_string) {
				scheduled_from_text = self.day_list[scheduled_date_day] + '\n' + ((scheduled_date_hours <= 9) ? '0' + scheduled_date_hours : scheduled_date_hours) + ':' + ((scheduled_from_date_minutes <= 9) ? '0' + scheduled_from_date_minutes : scheduled_from_date_minutes) + scheduled_date_ampm + ' \n ' + ((scheduled_date_date <= 9) ? '0' + scheduled_date_date : scheduled_date_date) + '-' + self.month_list[scheduled_date_month] + '-' + scheduled_date_year;
			} else {
				scheduled_from_text = self.day_list[scheduled_date_day] + ' ' + ((scheduled_date_hours <= 9) ? '0' + scheduled_date_hours : scheduled_date_hours) + ':' + ((scheduled_from_date_minutes <= 9) ? '0' + scheduled_from_date_minutes : scheduled_from_date_minutes) + scheduled_date_ampm + ' ' + ((scheduled_date_date <= 9) ? '0' + scheduled_date_date : scheduled_date_date) + '-' + self.month_list[scheduled_date_month] + '-' + scheduled_date_year;
			}
			return scheduled_from_text;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - figure_out_date_and_time');
			return '';
		}
	},
	/**
	 * check email is valid or not
	 */
	check_valid_email : function(email) {
		var self = this;
		try {
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (!filter.test(email)) {
				return false;
			}
			return true;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - check_valid_email');
			return false;
		}
	},
	/**
	 * remove all charaters from a string
	 */
	remove_all_charaters_from_string : function(phone_number) {
		var self = this;
		try {
			var m_strOut = new String(phone_number);
			m_strOut = phone_number.replace(/[^0-9]/g, '');
			return m_strOut;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - remove_all_charaters_from_string');
			return false;
		}
	},
	/**
	 * check price is valid or not
	 */
	check_valid_price : function(price) {
		var self = this;
		try {
			var filter = /^\d{0,8}\.{0,1}(\d{1,2})?$/;
			if (!filter.test(price)) {
				return false;
			}
			return true;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - check_valid_price');
			return false;
		}
	},
	/**
	 * check phone number is valid or not
	 */
	check_valid_phone_number : function(phone_number) {
		var self = this;
		try {
			var filter = /^ *[0-9]+ *$/;
			if (!filter.test(phone_number)) {
				return false;
			}
			return true;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - check_valid_phone_number');
			return false;
		}
	},
	/**
	 * check integer value is valid or not（only positive integer）
	 */
	check_valid_integer : function(integer_value) {
		var self = this;
		try {
			var filter = /^[0-9]*$/;
			if (!filter.test(integer_value)) {
				return false;
			}
			return true;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - check_valid_integer');
			return false;
		}
	},
	/**
	 * check integer value is valid or not（negative integer and positive
	 * integer）
	 */
	check_valid_negative_and_positive_integer : function(integer_value) {
		var self = this;
		try {
			var filter = /^-?[0-9]*$/;
			if (!filter.test(integer_value)) {
				return false;
			}
			return true;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - check_valid_negative_and_positive_integer');
			return false;
		}
	},
	
	/**
	 * remove all character and symbol , only keep number
	 */
	remove_all_character_and_symbol_except_number : function(str) {
		var self = this;
		try {
			if (self.trim(str) == '') {
				return '';
			}
			var new_str_array = [];
			for (var i = 0, j = str.length; i < j; i++) {
				if (((str[i]) >= '0') && (str[i] <= 9)) {
					new_str_array.push(str[i]);
				}
			}
			if (new_str_array.length > 0) {
				return new_str_array.join('');
			} else {
				return '';
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - remove_all_character_and_symbol_except_number');
			return '';
		}
	},
	/*
	 * get the milliseoonds from 1970/1/1
	 */
	get_date_string_by_milliseconds : function(intTime) {
		var self = this;
		try {
			var tempDate = new Date(intTime);
			var second = tempDate.getSeconds();
			if (second <= 9) {
				second = '0' + second + '';
			}
			var minute = tempDate.getMinutes();
			if (minute <= 9) {
				minute = '0' + minute + '';
			}
			var hour = tempDate.getHours();
			if (hour <= 9) {
				hour = '0' + hour + '';
			}
			var date = tempDate.getDate();
			date = (date <= 9) ? '0' + (date) : (date);
			var month = tempDate.getMonth();
			month = (month + 1 <= 9) ? '0' + (month + 1) : (month + 1);
			var year = tempDate.getFullYear();
			return self.display_time_and_date(self.get_seconds_value_by_time_string(year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second));
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - get_date_string_by_milliseconds');
			return '';
		}
	},
	/**
	 * set field width in table view row
	 */
	set_a_field_width_in_table_view_row : function() {
		var self = this;
		try {
			return self.screen_width / 2;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - set_a_field_width_in_table_view_row');
			return 0;
		}
	},
	/*
	 * create folder, if folder name is mulit folder ,e.g. job/8, then
	 * create parent folder and sub folder
	 */
	create_directory : function(folder_name) {
		var self = this;
		try {
			// create sub folder
			var folder = null;
			var file_name_array = folder_name.split('/');
			
			for (var i = 0, j = file_name_array.length; i < j; i++) {
				if (i > 0) {
					var m = 0;
					var temp_folder_path = '';
					while (m < i) {
						temp_folder_path += '/' + file_name_array[m];
						m++;
					}
					folder = Ti.Filesystem.getFile(self.file_directory + temp_folder_path, file_name_array[i]);
				} else {
					folder = Ti.Filesystem.getFile(self.file_directory, file_name_array[i]);
				}
				if (!folder.exists()) {
					if (!folder.createDirectory()) {
						return false;
					}
				}
			}
			return true;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - create_directory');
			return false;
		}
	},
	/*
	 * triger sms,email,phone,push notification events
	 */
	action_events : function(type, action_type, selected_job_id, selected_job_reference_number, recipients) {
		var self = this;
		try {
			switch (action_type){
				case 'call':// phone call/
					var phone_number = '';
					var display_name = '';
					var display_phone_number = '';
					var result = JSON.parse(recipients);
					if ((result === null) || (result === undefined) || (result === '')) {
						return;
					} else {
						phone_number = result[0].content;
						display_phone_number = result[0].display_content;
						display_name = result[0].name;
					}
					if (phone_number === '') {
						return;
					}
					var error_info = [];
					
					// check subject
					if (error_info.length > 0) {
						self.show_message(error_info.join('\n'));
						return;
					} else {
						if (!Ti.Network.online) {
							self.show_message(L('message_offline'), L('message_unable_to_connect'));
							return;
						} else {
							Ti.Platform.openURL('tel:' + phone_number);
							var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
							var _selected_user_name = Ti.App.Properties.getString('current_login_user_name');
							var _selected_company_id = Ti.App.Properties.getString('current_company_id');
							var xhr = null;
							if (self.set_enable_keep_alive) {
								xhr = Ti.Network.createHTTPClient({
									enableKeepAlive : false
								});
							} else {
								xhr = Ti.Network.createHTTPClient();
							}
							xhr.onload = function() {
								try {
									if ((xhr.readyState === 4) && (this.status === 200)) {
										if (self.return_to_login_page_if_user_security_session_changed(this.responseText)) {
											return;
										}
										if (self.display_app_version_incompatiable(this.responseText)) {
											return;
										}
										if (this.responseText != '[]') {
											var temp_result = JSON.parse(this.responseText);
											self.update_selected_tables(null, self.ucfirst(type) + 'ContactHistory', temp_result);
											self.update_selected_tables(null, self.ucfirst(type) + 'ContactHistoryRecipient', temp_result);
										}
									} else {
										var params = {
											message : 'Phone call failed.',
											show_message : false,
											message_title : '',
											send_error_email : true,
											error_message : '',
											error_source : self.window_source + ' - action_events - xhr.onload -1',
											server_response_message : this.reponseText
										};
										self.processXYZ(params);
										return;
									}
								} catch (e) {
									params = {
										message : 'Phone call failed.',
										show_message : false,
										message_title : '',
										send_error_email : true,
										error_message : e,
										error_source : self.window_source + ' - action_events - xhr.onload -2',
										server_response_message : this.reponseText
									};
									self.processXYZ(params);
									return;
								}
							};
							xhr.onerror = function(e) {
								var params = {
									message : 'Phone call failed.',
									show_message : false,
									message_title : '',
									send_error_email : true,
									error_message : e,
									error_source : self.window_source + ' - action_events - xhr.onerror',
									server_response_message : this.reponseText
								};
								self.processXYZ(params);
								return;
							};
							xhr.onsendstream = function(e) {
								// self.update_progress(e.progress,true);
							};
							xhr.setTimeout(self.default_time_out);
							xhr.open('POST', self.get_host_url() + 'update', false);
							xhr.send({
								'type' : 'action_send_phone',
								'hash' : _selected_user_id,
								'company_id' : _selected_company_id,
								'manager_user_id' : _selected_user_id,
								'job_id' : selected_job_id,
								'quote_id' : selected_job_id,
								'contact_type_code' : 1,
								'description' : _selected_user_name + ' call ' + display_name + ' ' + display_phone_number,
								'status_code' : 1,
								'job_type' : type,
								'app_security_session' : self.is_simulator() ? self.default_udid : Titanium.Platform.id,
								'app_version_increment' : self.version_increment,
								'app_version' : self.version,
								'app_platform' : self.get_platform_info()
							});
						}
					}
					break;
				case 'sms':// sms
					var sms_win = Titanium.UI.createWindow({
						title : 'SMS',
						url : self.get_file_path('url', 'action/sms2.js'),
						type : type,
						source : 'sms',
						recipients : recipients,
						contact_type_code : 2,
						job_id : selected_job_id,
						job_reference_number : selected_job_reference_number
					});
					Ti.UI.currentTab.open(sms_win, {
						animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
					});
					break;
				case 'email':// email
					Ti.App.Properties.setString('attachments_string', JSON.stringify([]));
					var email_win = Titanium.UI.createWindow({
						title : 'Email',
						url : self.get_file_path('url', 'action/email2.js'),
						type : type,
						source : 'email',
						recipients : recipients,
						contact_type_code : 3,
						job_id : selected_job_id,
						job_reference_number : selected_job_reference_number
					});
					Ti.UI.currentTab.open(email_win, {
						animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
					});
					break;
				case 'push':// push notification
					var push_notifiaction_win = Titanium.UI.createWindow({
						title : 'Push Notification',
						url : self.get_file_path('url', 'action/push_notification.js'),
						type : type,
						source : 'push_notification',
						recipients : recipients,
						contact_type_code : 4,
						job_id : selected_job_id,
						job_reference_number : selected_job_reference_number
					});
					Ti.UI.currentTab.open(push_notifiaction_win, {
						animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
					});
					break;
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - action_events');
			return;
		}
	},
	/**
	 * check and set object's focus
	 */
	check_and_set_object_focus : function(data_index, row_index, child_index) {
		var self = this;
		try {
			if ((self.table_view.data[data_index] != undefined) && (self.table_view.data[data_index] != null)) {
				if ((self.table_view.data[data_index].rows[row_index] != undefined) && (self.table_view.data[data_index].rows[row_index] != null)) {
					if ((self.table_view.data[data_index].rows[row_index].children[child_index] != undefined) && (self.table_view.data[data_index].rows[row_index].children[child_index] != null)) {
						self.table_view.data[data_index].rows[row_index].children[child_index].focus();
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - check_and_set_object_focus');
		}
	},
	/**
	 * process error info
	 */
	process_error_message : function(e, is_show, title) {
		var self = this;
		// self.hide_indicator();
		var is_debug = false;
		var default_host = self.get_host();
		for (var i = 0, j = self.major_version_host_list.length; i < j; i++) {
			if (default_host == self.major_version_host_list[i]) {
				is_debug = true;
				break;
			}
		}
		if ((is_debug) || ((is_show != undefined) && (is_show))) {
			var alertDialog = Titanium.UI.createAlertDialog({
				title : (title === undefined) ? L('message_warning') : title,
				message : e,
				buttonNames : [ 'Close' ]
			});
			alertDialog.show();
		}
		if ((self.nav_left_btn != undefined) && (self.nav_left_btn != null)) {
			self.nav_left_btn.index = -1;
		}
		return;
	},
	show_message : function(text, title) {
		var alertDialog = Titanium.UI.createAlertDialog({
			title : (title === undefined) ? L('message_warning') : title,
			message : text,
			buttonNames : [ 'Close' ]
		});
		alertDialog.show();
	},
	process_simple_error_message : function(err, error_source) {
		var self = this;
		var is_debug = true;
		var default_host = self.get_host();
		if (default_host == undefined || default_host == null || default_host == '') {
			is_debug = false;
		} else {
			for (var i = 0, j = self.major_version_host_list.length; i < j; i++) {
				if (default_host == self.major_version_host_list[i]) {
					is_debug = false;
					break;
				}
			}
		}
		var params = {
			message : err,
			message_title : '',
			show_message : is_debug ? true : false,
			send_error_email : true,
			error_message : err,
			error_source : error_source,
			server_response_message : ''
		};
		self.processXYZ(params);
	},
	processXYZ : function(params) {
		var self = this;
		if ((params.show_message != undefined) && (params.show_message)) {
			var alertDialog = Titanium.UI.createAlertDialog({
				title : (params.message_title === undefined) ? L('message_warning') : params.message_title,
				message : params.message,
				buttonNames : [ 'Close' ]
			});
			alertDialog.show();
		}
		if ((self.nav_left_btn != undefined) && (self.nav_left_btn != null)) {
			self.nav_left_btn.index = -1;
		}
		if (params.send_error_email != undefined && params.send_error_email && (Ti.Network.online)) {
			// send email to developer
			try {
				var xhr = null;
				if (self.set_enable_keep_alive) {
					xhr = Ti.Network.createHTTPClient({
						enableKeepAlive : false
					});
				} else {
					xhr = Ti.Network.createHTTPClient();
				}
				xhr.onload = function() {
					Ti.API.info(this.responseText);
				};
				xhr.onerror = function(e) {
					Ti.API.info(e);
				};
				xhr.setTimeout(self.default_time_out);
				xhr.open('POST', self.get_host_url() + 'update', false);
				xhr.send({
					'type' : 'action_send_error_email',
					'hash' : Ti.App.Properties.getString('current_login_user_id'),
					'user_id' : Ti.App.Properties.getString('current_login_user_id'),
					'company_id' : Ti.App.Properties.getString('current_company_id'),
					'country_id' : Ti.App.Properties.getString('selected_country_id'),
					'error_message' : params.error_message,
					'error_source' : params.error_source,
					'server_response_message' : params.server_response_message,
					'subject' : 'Application Error ',
					'app_security_session' : self.is_simulator() ? self.default_udid : Titanium.Platform.id,
					'app_version_increment' : self.version_increment,
					'app_version' : self.version,
					'app_platform' : self.get_platform_info()
				});
			} catch (err) {
				return;
			}
		}
		return;
	},
	getObjectSource : function(o) {
		var out = '';
		for ( var p in o) {
			out += p + ': ' + o[p] + '\n';
		}
		return out;
	},
	
	/**
	 * check is this function is available for locksmith or not
	 */
	is_available_for_locksmith : function(_type) {
		var self = this;
		try {
			// create sub folder
			if (_type != 'job') {
				return false;
			}
			if (Ti.App.Properties.getString('lock_smith_company_id') <= 0) {
				return false;
			}
			if (Ti.App.Properties.getString('lock_smith_company_id') != Ti.App.Properties.getString('current_company_id')) {
				return false;
			}
			return true;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - is_available_for_locksmith');
			return false;
		}
	},
	
	/**
	 * clean data before logout
	 */
	process_data_when_logout : function() {
		var self = this;
		try {
			Titanium.App.Properties.setString('current_login_user_id', 0);
			var db = Titanium.Database.open(self.get_db_name());
			db.execute('UPDATE my_manager_user SET local_login_status=0');
			var row = db.execute('SELECT * FROM my_frontend_config_setting where name=?', 'data_cache');
			var maximum_days = 0;
			if ((row != null) && (row.getRowCount() > 0)) {
				maximum_days = parseInt(row.fieldByName('value'), 10) * 30;
			} else {
				maximum_days = 1 * 30;
			}
			row.close();
			var new_date = new Date();
			var new_temp_time = new_date.getTime() - (30 * 24 * 60 * 60 * 1000);
			var new_time_date = new Date(new_temp_time);
			var temp_year = new_time_date.getFullYear();
			var temp_month = new_time_date.getMonth();
			var temp_date = new_time_date.getDate();
			temp_month = ((temp_month + 1) <= 9) ? '0' + (temp_month + 1) : (temp_month + 1);
			temp_date = (temp_date <= 9) ? '0' + temp_date : temp_date;
			var temp_time_string = temp_year + '-' + temp_month + '-' + temp_date + ' ' + new_time_date.getHours() + ':' + new_time_date.getMinutes() + ':00';
			var type_arr = [ 'job', 'quote' ];
			if (maximum_days > 0) {
				for (var i = 0, j = type_arr.length; i < j; i++) {
					var rows = db.execute('SELECT * FROM my_' + type_arr[i] + ' WHERE changed=0 and exist_any_changed=0 and modified<\'' + temp_time_string + '\'');
					var id_arr = [];
					if ((rows != null) && (rows.getRowCount() > 0)) {
						while (rows.isValidRow()) {
							id_arr.push(rows.fieldByName('id'));
							rows.next();
						}
					}
					rows.close();
					if (id_arr.length > 0) {
						var id_string = id_arr.join(',');
						db.execute('delete from my_' + type_arr[i] + ' where id in (' + id_string + ')');
						if (type_arr[i] === 'job') {
							db.execute('delete from my_' + type_arr[i] + '_operation_log where ' + type_arr[i] + '_id in (' + id_string + ')');
						}
						db.execute('delete from my_' + type_arr[i] + '_status_log where ' + type_arr[i] + '_id in (' + id_string + ')');
						db.execute('delete from my_' + type_arr[i] + '_client_contact where ' + type_arr[i] + '_id in (' + id_string + ')');
						db.execute('delete from my_' + type_arr[i] + '_site_contact where ' + type_arr[i] + '_id in (' + id_string + ')');
						db.execute('delete from my_' + type_arr[i] + '_note where ' + type_arr[i] + '_id in (' + id_string + ')');
						db.execute('delete from my_' + type_arr[i] + '_asset where ' + type_arr[i] + '_id in (' + id_string + ')');
						db.execute('delete from my_' + type_arr[i] + '_contact_history where ' + type_arr[i] + '_id in (' + id_string + ')');
						db.execute('delete from my_' + type_arr[i] + '_assigned_user where ' + type_arr[i] + '_id in (' + id_string + ')');
						db.execute('delete from my_' + type_arr[i] + '_assigned_item where ' + type_arr[i] + '_id in (' + id_string + ')');
						db.execute('delete from my_' + type_arr[i] + '_invoice where ' + type_arr[i] + '_id in (' + id_string + ')');
						db.execute('delete from my_' + type_arr[i] + '_invoice_signature where ' + type_arr[i] + '_id in (' + id_string + ')');
						db.execute('delete from my_' + type_arr[i] + '_custom_report_data where ' + type_arr[i] + '_id in (' + id_string + ')');
						db.execute('delete from my_' + type_arr[i] + '_custom_report_signature where ' + type_arr[i] + '_id in (' + id_string + ')');
						db.execute('delete from my_' + type_arr[i] + '_operation_manual where ' + type_arr[i] + '_id in (' + id_string + ')');
						db.execute('delete from my_purchase_order where ' + type_arr[i] + '_id in (' + id_string + ')');
						db.execute('delete from my_purchase_order_item');
					}
				}
			}
			db.close();
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - process_data_when_logout');
			return;
		}
	},
	
	/*
	 * return to login page if user's security session is changed
	 */
	return_to_login_page_if_user_security_session_changed : function(responseText) {
		var self = this;
		try {
			var result_result = false;
			var temp_result = null;
			if ((responseText != undefined) && (responseText != null) && (responseText != '')) {
				temp_result = JSON.parse(responseText);
			} else {
				return false;
			}
			// check version error
			if (!temp_result.access_allowed) {
				var error_string = '';
				for (var i = 0, j = temp_result.error.length; i < j; i++) {
					if (i == j) {
						error_string += temp_result.error[i];
					} else {
						error_string += temp_result.error[i] + '\n';
					}
				}
				self.process_data_when_logout();
				self.hide_indicator();
				var loginWindow = Ti.UI.createWindow({
					title : 'Login',
					url : self.get_file_path('url', 'login/login.js'),
					tab_group_obj : null,
					first_login : false
				});
				loginWindow.open();
				self.show_message(error_string);
				result_result = true;
			}
			return result_result;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - return_to_login_page_if_user_security_session_changed');
			return false;
		}
	},
	/**
	 * get last updated time text
	 */
	get_last_updated_time_text : function() {
		var self = this;
		try {
			var db = Titanium.Database.open(self.get_db_name());
			var library_last_updated = 0;
			var rows = db.execute('SELECT * FROM my_frontend_config_setting where name=?', 'library_last_updated');
			if (rows.getRowCount() > 0) {
				if (rows.isValidRow()) {
					library_last_updated = parseInt(rows.fieldByName('value'), 10);
				}
			}
			rows.close();
			db.close();
			return self.display_time_and_date(library_last_updated);
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - get_last_updated_time_text');
			return '';
		}
	},
	/**
	 * prcess app version incompatible with backedn
	 */
	display_app_version_incompatiable : function(responseText) {
		return false;
		// var self = this;
		// try{
		// Ti.API.info(responseText);
		// var result_result = false;
		// var temp_result = null;
		// if((responseText != undefined) && (responseText != null) &&
		// (responseText != '')){
		// temp_result = JSON.parse(responseText);
		// }else{
		// return false;
		// }
		//
		// //check version error
		// if ((temp_result != undefined) && (temp_result !=null) &&
		// (temp_result.app_version_error !=
		// undefined)&&(temp_result.app_version_error.length >0)){
		// var error_string = '';
		// for(var i=0,j=temp_result.app_version_error.length;i<j;i++){
		// if(i==j){
		// error_string+=temp_result.app_version_error[i];
		// }else{
		// error_string+=temp_result.app_version_error[i]+'\n';
		// }
		// }
		// self.hide_indicator();
		// self.show_message(error_string);
		// result_result = true;
		// }
		// //check account token error, e.g username and password have
		// been
		// changed.
		// if(!result_result){
		// if((temp_result.app_account_error !=
		// undefined)&&(temp_result.app_account_error.length >0)){
		// error_string = '';
		// for(i=0,j=temp_result.app_account_error.length;i<j;i++){
		// if(i==j){
		// error_string+=temp_result.app_account_error[i];
		// }else{
		// error_string+=temp_result.app_account_error[i]+'\n';
		// }
		// }
		// self.hide_indicator();
		// self.show_message(error_string);
		// result_result = true;
		// Ti.App.Properties.setString('current_login_user_id',0);
		// Ti.App.Properties.setString('current_login_user_name','');
		// Ti.App.Properties.setString('current_company_id',0);
		// Ti.App.Properties.setString('current_login_user_account_token','');
		// var loginWindow = Ti.UI.createWindow({
		// title:'Login',
		// url:self.get_file_path('url','login/login.js'),
		// tab_group_obj:null,
		// first_login:false
		// });
		// loginWindow.open();
		// }
		// }
		// return result_result;
		// }catch(err){
		// self.process_simple_error_message(err,self.window_source+' -
		// init');
		// return false;
		// }
	},
	/**
	 * check street type exist in locality_street_type table or not
	 */
	check_street_type : function(streetType) {
		var self = this;
		try {
			if (self.trim(streetType) == '') {
				return false;
			}
			var tempStreetType = self.trim(streetType);
			var db = Titanium.Database.open(self.get_db_name());
			var rows = db.execute('select id from my_locality_street_type where status_code=1 and name=?', tempStreetType.toUpperCase());
			if (rows.getRowCount() <= 0) {
				rows.close();
				rows = db.execute('select id from my_locality_street_type where status_code=1 and description=?', tempStreetType.toUpperCase());
				if (rows.getRowCount() <= 0) {
					rows.close();
					db.close();
					return false;
				} else {
					rows.close();
				}
			} else {
				rows.close();
			}
			db.close();
			return true;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - check_street_type');
			return false;
		}
	},
	/**
	 * get street type id
	 */
	return_street_type_id : function(streetType) {
		var self = this;
		try {
			var new_street_type_id = 0;
			if (self.trim(streetType) == '') {
				return new_street_type_id;
			}
			var tempStreetType = self.trim(streetType);
			var db = Titanium.Database.open(self.get_db_name());
			var rows = db.execute('select id from my_locality_street_type where status_code=1 and name=?', tempStreetType.toUpperCase());
			if (rows.getRowCount() <= 0) {
				rows.close();
				rows = db.execute('select id from my_locality_street_type where status_code=1 and description=?', tempStreetType.toUpperCase());
				if (rows.getRowCount() <= 0) {
					rows.close();
					db.close();
					return new_street_type_id;
				} else {
					new_street_type_id = rows.fieldByName('id');
					rows.close();
				}
			} else {
				new_street_type_id = rows.fieldByName('id');
				rows.close();
			}
			
			// check street_type_alias table
			if (new_street_type_id == 0) {
				rows = db.execute('select id from my_locality_street_type_alias where status_code=1 and name=?', tempStreetType.toUpperCase());
				if (rows.getRowCount() <= 0) {
				} else {
					new_street_type_id = rows.fieldByName('id');
				}
				rows.close();
			}
			db.close();
			return new_street_type_id;
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - return_street_type_id');
			return false;
		}
	},
	/**
	 * update table data by table name
	 */
	update_selected_tables : function(db, table_name, result) {
		var self = this;
		try {
			var db_empty_flag = 0;
			if ((db === undefined) || (db === null)) {
				db_empty_flag = 1;
				db = Titanium.Database.open(self.get_db_name());
			}
			switch (table_name){
				case 'ClientTypeCode':
					self.update_my_client_type_code_table(db, result);
					break;
				case 'ContactTypeCode':
					self.update_my_contact_type_code_table(db, result);
					break;
				case 'ManagerUserAgreement':
					self.update_my_manager_user_agreement_table(db, result);
					break;
				case 'JobAssetTypeCode':
					self.update_my_job_asset_type_code_table(db, result);
					break;
				case 'JobAssignedUserCode':
					self.update_my_job_assigned_user_code_table(db, result);
					break;
				case 'JobNoteTypeCode':
					self.update_my_job_note_type_code_table(db, result);
					break;
				case 'JobPriorityCode':
					self.update_my_job_priority_code_table(db, result);
					break;
				case 'JobStatusCode':
					self.update_my_job_status_code_table(db, result);
					break;
				case 'JobOperationLogTypeCode':
					self.update_my_job_operation_log_type_code_table(db, result);
					break;
				case 'JobLibraryItemTypeCode':
					self.update_my_job_library_item_type_code_table(db, result);
					break;
				case 'LocalityState':
					self.update_my_locality_state_table(db, result);
					break;
				case 'LocalityStreetType':
					self.update_my_locality_street_type_table(db, result);
					break;
				case 'LocalityStreetTypeAlias':
					self.update_my_locality_street_type_alias_table(db, result);
					break;
				case 'OrderSourceCode':
					self.update_my_order_source_code_table(db, result);
					break;
				case 'SalutationCode':
					self.update_my_salutation_code_table(db, result);
					break;
				case 'StatusCode':
					self.update_my_status_code_table(db, result);
					break;
				case 'ConfigSetting':
					self.update_my_frontend_config_setting_table(db, result);
					break;
				case 'QuoteAssetTypeCode':
					self.update_my_quote_asset_type_code_table(db, result);
					break;
				case 'QuoteNoteTypeCode':
					self.update_my_quote_note_type_code_table(db, result);
					break;
				case 'QuoteOperationLogTypeCode':
					self.update_my_quote_operation_log_type_code_table(db, result);
					break;
				case 'QuoteStatusCode':
					self.update_my_quote_status_code_table(db, result);
					break;
				case 'ManagerUser':
					self.update_my_manager_user_table(db, result);
					break;
				case 'Client':
					self.update_my_client_table(db, result);
					break;
				case 'ClientContact':
					self.update_my_client_contact_table(db, result);
					break;
				case 'Company':
					self.update_my_company_table(db, result);
					break;
				case 'Job':
					self.update_my_job_table(db, result);
					break;
				case 'JobAsset':
					self.update_my_job_asset_table(db, result);
					break;
				case 'JobAssignedUser':
					self.update_my_job_assigned_user_table(db, result);
					break;
				case 'JobClientContact':
					self.update_my_job_client_contact_table(db, result);
					break;
				case 'JobSiteContact':
					self.update_my_job_site_contact_table(db, result);
					break;
				case 'JobContactHistory':
					self.update_my_job_contact_history_table(db, result);
					break;
				case 'JobContactHistoryRecipient':
					self.update_my_job_contact_history_recipient_table(db, result);
					break;
				case 'JobNote':
					self.update_my_job_note_table(db, result);
					break;
				case 'JobOperationLog':
					self.update_my_job_operation_log_table(db, result);
					break;
				case 'JobLibraryItem':
					self.update_my_job_library_item_table(db, result);
					break;
				case 'JobAssignedItem':
					self.update_my_job_assigned_item_table(db, result);
					break;
				case 'JobStatusLog':
					self.update_my_job_status_log_table(db, result);
					break;
				case 'Quote':
					self.update_my_quote_table(db, result);
					break;
				case 'QuoteAsset':
					self.update_my_quote_asset_table(db, result);
					break;
				case 'QuoteClientContact':
					self.update_my_quote_client_contact_table(db, result);
					break;
				case 'QuoteSiteContact':
					self.update_my_quote_site_contact_table(db, result);
					break;
				case 'QuoteContactHistory':
					self.update_my_quote_contact_history_table(db, result);
					break;
				case 'QuoteContactHistoryRecipient':
					self.update_my_quote_contact_history_recipient_table(db, result);
					break;
				case 'QuoteNote':
					self.update_my_quote_note_table(db, result);
					break;
				case 'QuoteAssignedUser':
					self.update_my_quote_assigned_user_table(db, result);
					break;
				case 'QuoteAssignedItem':
					self.update_my_quote_assigned_item_table(db, result);
					break;
				case 'QuoteStatusLog':
					self.update_my_quote_status_log_table(db, result);
					break;
				case 'QuoteOperationLog':
					self.update_my_quote_operation_log_table(db, result);
					break;
				case 'Summary':
					self.update_my_summary_table(db, result);
					break;
				case 'JobSignature':
					self.update_my_job_signature_table(db, result);
					break;
				case 'QuoteSignature':
					self.update_my_quote_signature_table(db, result);
					break;
				// job invoice
				case 'JobInvoice':
					self.update_my_job_invoice_table(db, result);
					break;
				case 'JobInvoiceItem':
					self.update_my_job_invoice_item_table(db, result);
					break;
				case 'JobInvoiceOperationItem':
					self.update_my_job_invoice_operation_item_table(db, result);
					break;
				case 'JobInvoiceReceipt':
					self.update_my_job_invoice_receipt_table(db, result);
					break;
				case 'JobInvoiceReceiptStatus':
					self.update_my_job_invoice_receipt_status_table(db, result);
					break;
				case 'JobInvoiceStatusCode':
					self.update_my_job_invoice_status_code_table(db, result);
					break;
				case 'JobInvoiceStatusLog':
					self.update_my_job_invoice_status_log_table(db, result);
					break;
				case 'JobInvoiceTemplate':
					self.update_my_job_invoice_template_table(db, result);
					break;
				// quote
				case 'QuoteInvoice':
					self.update_my_quote_invoice_table(db, result);
					break;
				case 'QuoteInvoiceStatusCode':
					self.update_my_quote_invoice_status_code_table(db, result);
					break;
				case 'QuoteInvoiceTemplate':
					self.update_my_quote_invoice_template_table(db, result);
					break;
				// managerUserEmailSignature
				case 'ManagerUserEmailSignature':
					self.update_my_manager_user_email_signature_table(db, result);
					break;
				case 'MaterialsLocations':
					self.update_my_materials_locations_table(db, result);
					break;
				case 'MaterialsStocks':
					self.update_my_materials_stocks_table(db, result);
					break;
				// manager user mobile code
				case 'ManagerUserMobileCode':
					self.update_my_manager_user_mobile_code_table(db, result);
					break;
				case 'ManagerUserMobile':
					self.update_my_manager_user_mobile_table(db, result);
					break;
				// invoice signature
				case 'JobInvoiceSignature':
					self.update_my_job_invoice_signature_table(db, result);
					break;
				case 'QuoteInvoiceSignature':
					self.update_my_quote_invoice_signature_table(db, result);
					break;
				// custom report
				case 'CustomReport':
					self.update_my_custom_report_table(db, result);
					break;
				case 'CustomReportField':
					self.update_my_custom_report_field_table(db, result);
					break;
				case 'JobCustomReportData':
					self.update_my_job_custom_report_data_table(db, result);
					break;
				case 'JobCustomReportSignature':
					self.update_my_job_custom_report_signature_table(db, result);
					break;
				case 'QuoteCustomReportData':
					self.update_my_quote_custom_report_data_table(db, result);
					break;
				case 'QuoteCustomReportSignature':
					self.update_my_quote_custom_report_signature_table(db, result);
					break;
				case 'JobOperationManual':
					self.update_my_job_operation_manual_table(db, result);
					break;
				case 'JobAssignOperationManual':
					self.update_my_job_assigned_operation_manual_table(db, result);
					break;
				case 'QuoteOperationManual':
					self.update_my_quote_operation_manual_table(db, result);
					break;
				case 'QuoteAssignOperationManual':
					self.update_my_quote_assigned_operation_manual_table(db, result);
					break;
				// suppliers
				case 'SupplierTypeCode':
					self.update_my_supplier_type_code_table(db, result);
					break;
				case 'Suppliers':
					self.update_my_suppliers_table(db, result);
					break;
				// purchase order
				case 'PurchaseOrderStatusCode':
					self.update_my_purchase_order_status_code_table(db, result);
					break;
				case 'PurchaseOrder':
					self.update_my_purchase_order_table(db, result);
					break;
				case 'PurchaseOrderItem':
					self.update_my_purchase_order_item_table(db, result);
					break;
				// locksmith
				case 'JobInvoiceLocksmith':
					self.update_my_job_invoice_locksmith_table(db, result);
					break;
				case 'JobInvoiceLocksmithSignature':
					self.update_my_job_invoice_locksmith_signature_table(db, result);
					break;
				default:
			}
			if (db_empty_flag && (db != undefined) && (db != null)) {
				db.close();
			}
			
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_selected_tables');
			return;
		}
	},
	/**
	 * refresh job and relative table
	 */
	refresh_job_and_relative_tables : function(responseText, type) {
		var self = this;
		try {
			var db = Titanium.Database.open(self.get_db_name());
			var result = JSON.parse(responseText);
			db.execute('BEGIN');
			switch (type){
				case 'job':
					self.update_selected_tables(db, 'Job', result);
					self.update_selected_tables(db, 'JobAsset', result);
					self.update_selected_tables(db, 'JobAssignedUser', result);
					self.update_selected_tables(db, 'JobClientContact', result);
					self.update_selected_tables(db, 'JobNote', result);
					self.update_selected_tables(db, 'JobSiteContact', result);
					self.update_selected_tables(db, 'JobContactHistory', result);
					self.update_selected_tables(db, 'JobContactHistoryRecipient', result);
					self.update_selected_tables(db, 'JobOperationLog', result);
					self.update_selected_tables(db, 'JobAssignedItem', result);
					self.update_selected_tables(db, 'JobStatusLog', result);
					self.update_selected_tables(db, 'Client', result);
					self.update_selected_tables(db, 'ClientContact', result);
					self.update_selected_tables(db, 'JobLibraryItem', result);
					self.update_selected_tables(db, 'Summary', result);
					self.update_selected_tables(db, 'ConfigSetting', result);
					
					// job invoice
					self.update_selected_tables(db, 'JobInvoice', result);
					self.update_selected_tables(db, 'JobInvoicesignature', result);
					self.update_selected_tables(db, 'JobInvoiceItem', result);
					self.update_selected_tables(db, 'JobInvoiceOperationItem', result);
					self.update_selected_tables(db, 'JobInvoiceReceipt', result);
					self.update_selected_tables(db, 'JobInvoiceStatusLog', result);
					self.update_selected_tables(db, 'MaterialsStocks', result);
					// custom report
					self.update_selected_tables(db, 'JobCustomReportData', result);
					self.update_selected_tables(db, 'JobCustomReportSignature', result);
					// labour manual
					self.update_selected_tables(db, 'JobOperationManual', result);
					self.update_selected_tables(db, 'JobAssignedOperationManual', result);
					// supplier
					self.update_selected_tables(db, 'Suppliers', result);
					// purchase order
					self.update_selected_tables(db, 'PurchaseOrder', result);
					self.update_selected_tables(db, 'PurchaseOrderItem', result);
					// locksmith
					self.update_selected_tables(db, 'JobInvoiceLocksmith', result);
					self.update_selected_tables(db, 'JobInvoiceLocksmithSignature', result);
					break;
				case 'quote':
					self.update_selected_tables(db, 'Quote', result);
					self.update_selected_tables(db, 'QuoteAsset', result);
					self.update_selected_tables(db, 'QuoteAssignedUser', result);
					self.update_selected_tables(db, 'QuoteNote', result);
					self.update_selected_tables(db, 'QuoteClientContact', result);
					self.update_selected_tables(db, 'QuoteSiteContact', result);
					self.update_selected_tables(db, 'QuoteContactHistory', result);
					self.update_selected_tables(db, 'QuoteContactHistoryRecipient', result);
					self.update_selected_tables(db, 'QuoteOperationLog', result);
					self.update_selected_tables(db, 'QuoteAssignedItem', result);
					self.update_selected_tables(db, 'QuoteStatusLog', result);
					self.update_selected_tables(db, 'Client', result);
					self.update_selected_tables(db, 'ClientContact', result);
					self.update_selected_tables(db, 'JobLibraryItem', result);
					self.update_selected_tables(db, 'Summary', result);
					self.update_selected_tables(db, 'ConfigSetting', result);
					// quote invoice
					self.update_selected_tables(db, 'QuoteInvoice', result);
					self.update_selected_tables(db, 'QuoteInvoiceSignature', result);
					self.update_selected_tables(db, 'MaterialsStocks', result);
					// custom report
					self.update_selected_tables(db, 'QuoteCustomReportData', result);
					self.update_selected_tables(db, 'QuoteCustomReportSignature', result);
					// labour manual
					self.update_selected_tables(db, 'QuoteOperationManual', result);
					self.update_selected_tables(db, 'QuoteAssignedOperationManual', result);
					// supplier
					self.update_selected_tables(db, 'Suppliers', result);
					// purchase order
					self.update_selected_tables(db, 'PurchaseOrder', result);
					self.update_selected_tables(db, 'PurchaseOrderItem', result);
					break;
				case 'all':
					self.update_selected_tables(db, 'Job', result);
					self.update_selected_tables(db, 'JobAsset', result);
					self.update_selected_tables(db, 'JobAssignedUser', result);
					self.update_selected_tables(db, 'JobClientContact', result);
					self.update_selected_tables(db, 'JobNote', result);
					self.update_selected_tables(db, 'JobSiteContact', result);
					self.update_selected_tables(db, 'JobContactHistory', result);
					self.update_selected_tables(db, 'JobContactHistoryRecipient', result);
					self.update_selected_tables(db, 'JobOperationLog', result);
					self.update_selected_tables(db, 'JobAssignedItem', result);
					self.update_selected_tables(db, 'JobStatusLog', result);
					
					// job invoice
					self.update_selected_tables(db, 'JobInvoice', result);
					self.update_selected_tables(db, 'JobInvoiceSignature', result);
					self.update_selected_tables(db, 'JobInvoiceItem', result);
					self.update_selected_tables(db, 'JobInvoiceOperationItem', result);
					self.update_selected_tables(db, 'JobInvoiceReceipt', result);
					self.update_selected_tables(db, 'JobInvoiceStatusLog', result);
					
					self.update_selected_tables(db, 'Quote', result);
					self.update_selected_tables(db, 'QuoteAsset', result);
					self.update_selected_tables(db, 'QuoteAssignedUser', result);
					self.update_selected_tables(db, 'QuoteNote', result);
					self.update_selected_tables(db, 'QuoteClientContact', result);
					self.update_selected_tables(db, 'QuoteSiteContact', result);
					self.update_selected_tables(db, 'QuoteContactHistory', result);
					self.update_selected_tables(db, 'QuoteContactHistoryRecipient', result);
					self.update_selected_tables(db, 'QuoteOperationLog', result);
					self.update_selected_tables(db, 'QuoteAssignedItem', result);
					self.update_selected_tables(db, 'QuoteStatusLog', result);
					self.update_selected_tables(db, 'QuoteInvoice', result);
					self.update_selected_tables(db, 'QuoteInvoiceSignature', result);
					
					self.update_selected_tables(db, 'Client', result);
					self.update_selected_tables(db, 'ClientContact', result);
					self.update_selected_tables(db, 'JobLibraryItem', result);
					self.update_selected_tables(db, 'Summary', result);
					self.update_selected_tables(db, 'ConfigSetting', result);
					self.update_selected_tables(db, 'MaterialsStocks', result);
					
					// custom report
					self.update_selected_tables(db, 'JobCustomReportData', result);
					self.update_selected_tables(db, 'JobCustomReportSignature', result);
					self.update_selected_tables(db, 'QuoteCustomReportData', result);
					self.update_selected_tables(db, 'QuoteCustomReportSignature', result);
					// labour manual
					self.update_selected_tables(db, 'JobOperationManual', result);
					self.update_selected_tables(db, 'JobAssignedOperationManual', result);
					self.update_selected_tables(db, 'QuoteOperationManual', result);
					self.update_selected_tables(db, 'QuoteAssignedOperationManual', result);
					// supplier
					self.update_selected_tables(db, 'Suppliers', result);
					// purchase order
					self.update_selected_tables(db, 'PurchaseOrder', result);
					self.update_selected_tables(db, 'PurchaseOrderItem', result);
					// locksmith
					self.update_selected_tables(db, 'JobInvoiceLocksmith', result);
					self.update_selected_tables(db, 'JobInvoiceLocksmithSignature', result);
					break;
				case 'top':
					self.update_selected_tables(db, 'Job', result);
					self.update_selected_tables(db, 'JobAsset', result);
					self.update_selected_tables(db, 'JobAssignedUser', result);
					self.update_selected_tables(db, 'JobClientContact', result);
					self.update_selected_tables(db, 'JobNote', result);
					self.update_selected_tables(db, 'JobSiteContact', result);
					self.update_selected_tables(db, 'JobContactHistory', result);
					self.update_selected_tables(db, 'JobContactHistoryRecipient', result);
					self.update_selected_tables(db, 'JobOperationLog', result);
					self.update_selected_tables(db, 'JobAssignedItem', result);
					self.update_selected_tables(db, 'JobStatusLog', result);
					
					// job invoice
					self.update_selected_tables(db, 'JobInvoice', result);
					self.update_selected_tables(db, 'JobInvoiceSignature', result);
					self.update_selected_tables(db, 'JobInvoiceItem', result);
					self.update_selected_tables(db, 'JobInvoiceOperationItem', result);
					self.update_selected_tables(db, 'JobInvoiceReceipt', result);
					self.update_selected_tables(db, 'JobInvoiceStatusLog', result);
					
					self.update_selected_tables(db, 'Quote', result);
					self.update_selected_tables(db, 'QuoteAsset', result);
					self.update_selected_tables(db, 'QuoteAssignedUser', result);
					self.update_selected_tables(db, 'QuoteNote', result);
					self.update_selected_tables(db, 'QuoteClientContact', result);
					self.update_selected_tables(db, 'QuoteSiteContact', result);
					self.update_selected_tables(db, 'QuoteContactHistory', result);
					self.update_selected_tables(db, 'QuoteContactHistoryRecipient', result);
					self.update_selected_tables(db, 'QuoteOperationLog', result);
					self.update_selected_tables(db, 'QuoteAssignedItem', result);
					self.update_selected_tables(db, 'QuoteStatusLog', result);
					self.update_selected_tables(db, 'QuoteInvoice', result);
					self.update_selected_tables(db, 'QuoteInvoiceSignature', result);
					
					self.update_selected_tables(db, 'Client', result);
					self.update_selected_tables(db, 'ClientContact', result);
					self.update_selected_tables(db, 'ManagerUser', result);
					self.update_selected_tables(db, 'Company', result);
					self.update_selected_tables(db, 'JobLibraryItem', result);
					self.update_selected_tables(db, 'ConfigSetting', result);
					self.update_selected_tables(db, 'Summary', result);
					self.update_selected_tables(db, 'MaterialsStocks', result);
					
					// custom report
					self.update_selected_tables(db, 'JobCustomReportData', result);
					self.update_selected_tables(db, 'JobCustomReportSignature', result);
					self.update_selected_tables(db, 'QuoteCustomReportData', result);
					self.update_selected_tables(db, 'QuoteCustomReportSignature', result);
					// labour manual
					self.update_selected_tables(db, 'JobOperationManual', result);
					self.update_selected_tables(db, 'JobAssignedOperationManual', result);
					self.update_selected_tables(db, 'QuoteOperationManual', result);
					self.update_selected_tables(db, 'QuoteAssignedOperationManual', result);
					// supplier
					self.update_selected_tables(db, 'Suppliers', result);
					// purchase order
					self.update_selected_tables(db, 'PurchaseOrder', result);
					self.update_selected_tables(db, 'PurchaseOrderItem', result);
					// locksmith
					self.update_selected_tables(db, 'JobInvoiceLocksmith', result);
					self.update_selected_tables(db, 'JobInvoiceLocksmithSignature', result);
					break;
			}
			db.execute('COMMIT');
			db.close();
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - refresh_job_and_relative_tables');
			return;
		}
	},
	/**
	 * get all job id string or quote id string which has been existed in
	 * local database
	 */
	get_job_id_string : function(type, company_id) {
		var self = this;
		try {
			var db = Titanium.Database.open(self.get_db_name());
			var job_id_array = [];
			var rows = db.execute('SELECT * FROM my_' + type + ' WHERE company_id=?', company_id);
			if (rows.getRowCount() > 0) {
				while (rows.isValidRow()) {
					job_id_array.push(rows.fieldByName('id'));
					rows.next();
				}
			}
			rows.close();
			db.close();
			if (job_id_array.length > 0) {
				return job_id_array.join(',');
			} else {
				return '';
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - get_job_id_string');
			return '';
		}
	},
	update_my_client_type_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === undefined) || (result === null) || (result.ClientTypeCode === undefined) || (result.ClientTypeCode === null) || (result.ClientTypeCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_client_type_code');
				for (var i = 0, j = result.ClientTypeCode.length; i < j; i++) {
					db.execute('INSERT INTO my_client_type_code (code,name,description,abbr)VALUES(?,?,?,?)', ((result.ClientTypeCode[i].code != undefined) && (result.ClientTypeCode[i].code != null)) ? result.ClientTypeCode[i].code : 0, ((result.ClientTypeCode[i].name != undefined) && (result.ClientTypeCode[i].name != null)) ? result.ClientTypeCode[i].name : '',
									((result.ClientTypeCode[i].description != undefined) && (result.ClientTypeCode[i].description != null)) ? result.ClientTypeCode[i].description : '', ((result.ClientTypeCode[i].abbr != undefined) && (result.ClientTypeCode[i].abbr != null)) ? result.ClientTypeCode[i].abbr : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_client_type_code_table');
			return;
		}
	},
	update_my_contact_type_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === undefined) || (result === null) || (result.ContactTypeCode === undefined) || (result.ContactTypeCode === null) || (result.ContactTypeCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_contact_type_code');
				for (var i = 0, j = result.ContactTypeCode.length; i < j; i++) {
					db.execute('INSERT INTO my_contact_type_code (code,name,description)VALUES(?,?,?)', ((result.ContactTypeCode[i].code != undefined) && (result.ContactTypeCode[i].code != null)) ? result.ContactTypeCode[i].code : 0, ((result.ContactTypeCode[i].name != undefined) && (result.ContactTypeCode[i].name != null)) ? result.ContactTypeCode[i].name : '',
									((result.ContactTypeCode[i].description != undefined) && (result.ContactTypeCode[i].description != null)) ? result.ContactTypeCode[i].description : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_contact_type_code_table');
			return;
		}
	},
	update_my_manager_user_agreement_table : function(db, result) {
		var self = this;
		try {
			if ((result === undefined) || (result === null) || (result.ManagerUserAgreement === undefined) || (result.ManagerUserAgreement === null) || (result.ManagerUserAgreement.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_manager_user_agreement');
				for (var i = 0, j = result.ManagerUserAgreement.length; i < j; i++) {
					db.execute('INSERT INTO my_manager_user_agreement (id,title,description,path,status_code,created,modified)' + 'VALUES(?,?,?,?,?,?,?)', ((result.ManagerUserAgreement[i].id != undefined) && (result.ManagerUserAgreement[i].id != null)) ? result.ManagerUserAgreement[i].id : 0, ((result.ManagerUserAgreement[i].title != undefined) && (result.ManagerUserAgreement[i].title != null)) ? result.ManagerUserAgreement[i].title : '',
									((result.ManagerUserAgreement[i].description != undefined) && (result.ManagerUserAgreement[i].description != null)) ? result.ManagerUserAgreement[i].description : '', ((result.ManagerUserAgreement[i].path != undefined) && (result.ManagerUserAgreement[i].path != null)) ? result.ManagerUserAgreement[i].path : '',
									((result.ManagerUserAgreement[i].status_code != undefined) && (result.ManagerUserAgreement[i].status_code != null)) ? result.ManagerUserAgreement[i].status_code : 0, ((result.ManagerUserAgreement[i].created != undefined) && (result.ManagerUserAgreement[i].created != null)) ? result.ManagerUserAgreement[i].created : '',
									((result.ManagerUserAgreement[i].modified != undefined) && (result.ManagerUserAgreement[i].modified != null)) ? result.ManagerUserAgreement[i].modified : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_manager_user_agreement_table');
			return;
		}
	},
	update_my_job_asset_type_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === undefined) || (result === null) || (result.JobAssetTypeCode === undefined) || (result.JobAssetTypeCode === null) || (result.JobAssetTypeCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_job_asset_type_code');
				for (var i = 0, j = result.JobAssetTypeCode.length; i < j; i++) {
					db.execute('INSERT INTO my_job_asset_type_code (code,name,path,description)VALUES(?,?,?,?)', ((result.JobAssetTypeCode[i].code != undefined) && (result.JobAssetTypeCode[i].code != null)) ? result.JobAssetTypeCode[i].code : 0, ((result.JobAssetTypeCode[i].name != undefined) && (result.JobAssetTypeCode[i].name != null)) ? result.JobAssetTypeCode[i].name : '',
									((result.JobAssetTypeCode[i].path != undefined) && (result.JobAssetTypeCode[i].path != null)) ? result.JobAssetTypeCode[i].path : '', ((result.JobAssetTypeCode[i].description != undefined) && (result.JobAssetTypeCode[i].description != null)) ? result.JobAssetTypeCode[i].description : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_asset_type_code_table');
			return;
		}
	},
	update_my_job_assigned_user_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === undefined) || (result === null) || (result.JobAssignedUserCode === undefined) || (result.JobAssignedUserCode === null) || (result.JobAssignedUserCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_job_assigned_user_code');
				for (var i = 0, j = result.JobAssignedUserCode.length; i < j; i++) {
					db.execute('INSERT INTO my_job_assigned_user_code (code,name,description)VALUES(?,?,?)', ((result.JobAssignedUserCode[i].code != undefined) && (result.JobAssignedUserCode[i].code != null)) ? result.JobAssignedUserCode[i].code : 0, ((result.JobAssignedUserCode[i].name != undefined) && (result.JobAssignedUserCode[i].name != null)) ? result.JobAssignedUserCode[i].name : '',
									((result.JobAssignedUserCode[i].description != undefined) && (result.JobAssignedUserCode[i].description != null)) ? result.JobAssignedUserCode[i].description : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_assigned_user_code_table');
			return;
		}
	},
	update_my_job_note_type_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === undefined) || (result === null) || (result.JobNoteTypeCode === undefined) || (result.JobNoteTypeCode === null) || (result.JobNoteTypeCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_job_note_type_code');
				for (var i = 0, j = result.JobNoteTypeCode.length; i < j; i++) {
					db.execute('INSERT INTO my_job_note_type_code (code,name,description)VALUES(?,?,?)', ((result.JobNoteTypeCode[i].code != undefined) && (result.JobNoteTypeCode[i].code != null)) ? result.JobNoteTypeCode[i].code : 0, ((result.JobNoteTypeCode[i].name != undefined) && (result.JobNoteTypeCode[i].name != null)) ? result.JobNoteTypeCode[i].name : '',
									((result.JobNoteTypeCode[i].description != undefined) && (result.JobNoteTypeCode[i].description != null)) ? result.JobNoteTypeCode[i].description : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_note_type_code_table');
			return;
		}
	},
	update_my_job_priority_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === undefined) || (result === null) || (result.JobPriorityCode === undefined) || (result.JobPriorityCode === null) || (result.JobPriorityCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_job_priority_code');
				for (var i = 0, j = result.JobPriorityCode.length; i < j; i++) {
					db.execute('INSERT INTO my_job_priority_code (code,name,abbr,colour,description)VALUES(?,?,?,?,?)', ((result.JobPriorityCode[i].code != undefined) && (result.JobPriorityCode[i].code != null)) ? result.JobPriorityCode[i].code : 0, ((result.JobPriorityCode[i].name != undefined) && (result.JobPriorityCode[i].name != null)) ? result.JobPriorityCode[i].name : '',
									((result.JobPriorityCode[i].abbr != undefined) && (result.JobPriorityCode[i].abbr != null)) ? result.JobPriorityCode[i].abbr : '', ((result.JobPriorityCode[i].colour != undefined) && (result.JobPriorityCode[i].colour != null)) ? result.JobPriorityCode[i].colour : '', ((result.JobPriorityCode[i].description != undefined) && (result.JobPriorityCode[i].description != null)) ? result.JobPriorityCode[i].description : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_priority_code_table');
			return;
		}
	},
	update_my_job_status_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === undefined) || (result === null) || (result.JobStatusCode === undefined) || (result.JobStatusCode === null) || (result.JobStatusCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_job_status_code');
				for (var i = 0, j = result.JobStatusCode.length; i < j; i++) {
					db.execute('INSERT INTO my_job_status_code (code,name,abbr,colour,description)VALUES(?,?,?,?,?)', (((result.JobStatusCode[i].code != undefined) && (result.JobStatusCode[i].code != null)) ? result.JobStatusCode[i].code : 0), (((result.JobStatusCode[i].name != undefined) && (result.JobStatusCode[i].name != null)) ? result.JobStatusCode[i].name : ''),
									(((result.JobStatusCode[i].abbr != undefined) && (result.JobStatusCode[i].abbr != null)) ? result.JobStatusCode[i].abbr : ''), (((result.JobStatusCode[i].colour != undefined) && (result.JobStatusCode[i].colour != null)) ? result.JobStatusCode[i].colour : ''), (((result.JobStatusCode[i].description != undefined) && (result.JobStatusCode[i].description != null)) ? result.JobStatusCode[i].description : ''));
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_status_code_table');
			return;
		}
	},
	update_my_job_operation_log_type_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobOperationLogTypeCode === undefined) || (result.JobOperationLogTypeCode === null) || (result.JobOperationLogTypeCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_job_operation_log_type_code');
				for (var i = 0, j = result.JobOperationLogTypeCode.length; i < j; i++) {
					db.execute('INSERT INTO my_job_operation_log_type_code (code,name,colour,description)VALUES(?,?,?,?)', ((result.JobOperationLogTypeCode[i].code != undefined) && (result.JobOperationLogTypeCode[i].code != null)) ? result.JobOperationLogTypeCode[i].code : 0, ((result.JobOperationLogTypeCode[i].name != undefined) && (result.JobOperationLogTypeCode[i].name != null)) ? result.JobOperationLogTypeCode[i].name : '',
									((result.JobOperationLogTypeCode[i].colour != undefined) && (result.JobOperationLogTypeCode[i].colour != null)) ? result.JobOperationLogTypeCode[i].colour : '', ((result.JobOperationLogTypeCode[i].description != undefined) && (result.JobOperationLogTypeCode[i].description != null)) ? result.JobOperationLogTypeCode[i].description : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_operation_log_type_code_table');
			return;
		}
	},
	update_my_job_library_item_type_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobLibraryItemTypeCode === undefined) || (result.JobLibraryItemTypeCode === null) || (result.JobLibraryItemTypeCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_job_library_item_type_code');
				for (var i = 0, j = result.JobLibraryItemTypeCode.length; i < j; i++) {
					db.execute('INSERT INTO my_job_library_item_type_code (code,name,description)VALUES(?,?,?)', ((result.JobLibraryItemTypeCode[i].code != undefined) && (result.JobLibraryItemTypeCode[i].code != null)) ? result.JobLibraryItemTypeCode[i].code : 0, ((result.JobLibraryItemTypeCode[i].name != undefined) && (result.JobLibraryItemTypeCode[i].name != null)) ? result.JobLibraryItemTypeCode[i].name : '',
									((result.JobLibraryItemTypeCode[i].description != undefined) && (result.JobLibraryItemTypeCode[i].description != null)) ? result.JobLibraryItemTypeCode[i].description : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_library_item_type_code_table');
			return;
		}
	},
	update_my_locality_state_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.LocalityState === undefined) || (result.LocalityState === null) || (result.LocalityState.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_locality_state');
				for (var i = 0, j = result.LocalityState.length; i < j; i++) {
					db.execute('INSERT INTO my_locality_state (id,locality_country_id,state,state_abbr,url,latitude,longitude,' + 'point,boundary,geo_source_code,geo_accuracy_code,gmt_offset,status_code,created,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
									((result.LocalityState[i].id != undefined) && (result.LocalityState[i].id != null)) ? result.LocalityState[i].id : 0,
													((result.LocalityState[i].locality_country_id != undefined) && (result.LocalityState[i].locality_country_id != null)) ? result.LocalityState[i].locality_country_id : 0,
									((result.LocalityState[i].state != undefined) && (result.LocalityState[i].state != null)) ? result.LocalityState[i].state : '', ((result.LocalityState[i].state_abbr != undefined) && (result.LocalityState[i].state_abbr != null)) ? result.LocalityState[i].state_abbr : '', ((result.LocalityState[i].url != undefined) && (result.LocalityState[i].url != null)) ? result.LocalityState[i].url : '',
									((result.LocalityState[i].latitude != undefined) && (result.LocalityState[i].latitude != null)) ? result.LocalityState[i].latitude : 0, ((result.LocalityState[i].longitude != undefined) && (result.LocalityState[i].longitude != null)) ? result.LocalityState[i].longitude : 0, ((result.LocalityState[i].point != undefined) && (result.LocalityState[i].point != null)) ? result.LocalityState[i].point : '',
									((result.LocalityState[i].boundary != undefined) && (result.LocalityState[i].boundary != null)) ? result.LocalityState[i].boundary : '', ((result.LocalityState[i].geo_source_code != undefined) && (result.LocalityState[i].geo_source_code != null)) ? result.LocalityState[i].geo_source_code : 0,
									((result.LocalityState[i].geo_accuracy_code != undefined) && (result.LocalityState[i].geo_accuracy_code != null)) ? result.LocalityState[i].geo_accuracy_code : 0, ((result.LocalityState[i].gmt_offset != undefined) && (result.LocalityState[i].gmt_offset != null)) ? result.LocalityState[i].gmt_offset : 0,
									((result.LocalityState[i].status_code != undefined) && (result.LocalityState[i].status_code != null)) ? result.LocalityState[i].status_code : 0, ((result.LocalityState[i].created != undefined) && (result.LocalityState[i].created != null)) ? result.LocalityState[i].created : '', ((result.LocalityState[i].modified != undefined) && (result.LocalityState[i].modified != null)) ? result.LocalityState[i].modified : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_locality_state_table');
			return;
		}
	},
	update_my_locality_street_type_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.LocalityStreetType === undefined) || (result.LocalityStreetType === null) || (result.LocalityStreetType.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_locality_street_type');
				for (var i = 0, j = result.LocalityStreetType.length; i < j; i++) {
					db.execute('INSERT INTO my_locality_street_type (id,name,description,status_code,created,modified)' + 'VALUES(?,?,?,?,?,?)', ((result.LocalityStreetType[i].id != undefined) && (result.LocalityStreetType[i].id != null)) ? result.LocalityStreetType[i].id : 0, ((result.LocalityStreetType[i].name != undefined) && (result.LocalityStreetType[i].name != null)) ? result.LocalityStreetType[i].name : '',
									((result.LocalityStreetType[i].description != undefined) && (result.LocalityStreetType[i].description != null)) ? result.LocalityStreetType[i].description : '', ((result.LocalityStreetType[i].status_code != undefined) && (result.LocalityStreetType[i].status_code != null)) ? result.LocalityStreetType[i].status_code : 0,
									((result.LocalityStreetType[i].created != undefined) && (result.LocalityStreetType[i].created != null)) ? result.LocalityStreetType[i].created : '', ((result.LocalityStreetType[i].modified != undefined) && (result.LocalityStreetType[i].modified != null)) ? result.LocalityStreetType[i].modified : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_locality_street_type_table');
			return;
		}
	},
	update_my_locality_street_type_alias_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.LocalityStreetTypeAlias === undefined) || (result.LocalityStreetTypeAlias === null) || (result.LocalityStreetTypeAlias.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_locality_street_type_alias');
				for (var i = 0, j = result.LocalityStreetTypeAlias.length; i < j; i++) {
					db.execute('INSERT INTO my_locality_street_type_alias (id,locality_street_type_id,name,status_code,created,modified)' + 'VALUES(?,?,?,?,?,?)', ((result.LocalityStreetTypeAlias[i].id != undefined) && (result.LocalityStreetTypeAlias[i].id != null)) ? result.LocalityStreetTypeAlias[i].id : 0,
									((result.LocalityStreetTypeAlias[i].locality_street_type_id != undefined) && (result.LocalityStreetTypeAlias[i].locality_street_type_id != null)) ? result.LocalityStreetTypeAlias[i].locality_street_type_id : 0, ((result.LocalityStreetTypeAlias[i].name != undefined) && (result.LocalityStreetTypeAlias[i].name != null)) ? result.LocalityStreetTypeAlias[i].name : '',
									((result.LocalityStreetTypeAlias[i].status_code != undefined) && (result.LocalityStreetTypeAlias[i].status_code != null)) ? result.LocalityStreetTypeAlias[i].status_code : 0, ((result.LocalityStreetTypeAlias[i].created != undefined) && (result.LocalityStreetTypeAlias[i].created != null)) ? result.LocalityStreetTypeAlias[i].created : '',
									((result.LocalityStreetTypeAlias[i].modified != undefined) && (result.LocalityStreetTypeAlias[i].modified != null)) ? result.LocalityStreetTypeAlias[i].modified : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_locality_street_type_alias_table');
			return;
		}
	},
	update_my_order_source_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === undefined) || (result === null) || (result.OrderSourceCode === undefined) || (result.OrderSourceCode === null) || (result.OrderSourceCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_order_source_code');
				for (var i = 0, j = result.OrderSourceCode.length; i < j; i++) {
					db.execute('INSERT INTO my_order_source_code (code,name,description)VALUES(?,?,?)', ((result.OrderSourceCode[i].code != undefined) && (result.OrderSourceCode[i].code != null)) ? result.OrderSourceCode[i].code : 0, ((result.OrderSourceCode[i].name != undefined) && (result.OrderSourceCode[i].name != null)) ? result.OrderSourceCode[i].name : '',
									((result.OrderSourceCode[i].description != undefined) && (result.OrderSourceCode[i].description != null)) ? result.OrderSourceCode[i].description : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_order_source_code_table');
			return;
		}
	},
	update_my_salutation_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.SalutationCode === undefined) || (result.SalutationCode === null) || (result.SalutationCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_salutation_code');
				for (var i = 0, j = result.SalutationCode.length; i < j; i++) {
					if (result.SalutationCode[i].code > 0) {
						db.execute('INSERT INTO my_salutation_code (code,name,description)VALUES(?,?,?)', ((result.SalutationCode[i].code != undefined) && (result.SalutationCode[i].code != null)) ? result.SalutationCode[i].code : 0, ((result.SalutationCode[i].name != undefined) && (result.SalutationCode[i].name != null)) ? result.SalutationCode[i].name : '',
										((result.SalutationCode[i].description != undefined) && (result.SalutationCode[i].description != null)) ? result.SalutationCode[i].description : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_salutation_code_table');
			return;
		}
	},
	update_my_status_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.StatusCode === undefined) || (result.StatusCode === null) || (result.StatusCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_status_code');
				for (var i = 0, j = result.StatusCode.length; i < j; i++) {
					db.execute('INSERT INTO my_status_code (code,name,description)VALUES(?,?,?)', ((result.StatusCode[i].code != undefined) && (result.StatusCode[i].code != null)) ? result.StatusCode[i].code : 0, ((result.StatusCode[i].name != undefined) && (result.StatusCode[i].name != null)) ? result.StatusCode[i].name : '', ((result.StatusCode[i].description != undefined) && (result.StatusCode[i].description != null)) ? result.StatusCode[i].description : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_status_code_table');
			return;
		}
	},
	update_my_frontend_config_setting_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.ConfigSetting === undefined) || (result.ConfigSetting === null) || (result.ConfigSetting.length <= 0)) {
			} else {
				for (var i = 0, j = result.ConfigSetting.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_frontend_config_setting WHERE name=?', result.ConfigSetting[i].name);
					if ((data_rows != null) && (data_rows.getRowCount() > 0)) {
						db.execute('UPDATE my_frontend_config_setting SET value=? WHERE name=?', result.ConfigSetting[i].value, result.ConfigSetting[i].name);
					} else {
						db.execute('INSERT INTO my_frontend_config_setting (name,value)VALUES(?,?)', result.ConfigSetting[i].name, result.ConfigSetting[i].value);
					}
					
					data_rows.close();
					if (result.ConfigSetting[i].name === 'library_last_updated') {
						Titanium.App.Properties.setString('library_last_updated', result.ConfigSetting[i].value);
					}
					if (result.ConfigSetting[i].name === 'selected_materials_locations_id') {
						Titanium.App.Properties.setString('selected_materials_locations_id', result.ConfigSetting[i].value);
					}
					if (result.ConfigSetting[i].name === 'selected_materials_locations_name') {
						Titanium.App.Properties.setString('selected_materials_locations_name', result.ConfigSetting[i].value);
					}
					if (result.ConfigSetting[i].name === 'can_view_business_client') {
						Titanium.App.Properties.setBool('can_view_business_client', (result.ConfigSetting[i].value == '1' ? true : false));
					}
					if (result.ConfigSetting[i].name === 'can_view_purchase_order') {
						Titanium.App.Properties.setBool('can_view_purchase_order', (result.ConfigSetting[i].value == '1' ? true : false));
					}
					if (result.ConfigSetting[i].name === 'can_view_materials') {
						Ti.API.info('can_view_materials:' + result.ConfigSetting[i].value);
						Titanium.App.Properties.setBool('can_view_materials', (result.ConfigSetting[i].value == '1' ? true : false));
					}
					if (result.ConfigSetting[i].name === 'can_view_invoice') {
						Ti.API.info('can_view_invoice:' + result.ConfigSetting[i].value);
						Titanium.App.Properties.setBool('can_view_invoice', (result.ConfigSetting[i].value == '1' ? true : false));
					}
					if (result.ConfigSetting[i].name === 'selected_country_id') {
						Ti.API.info('country id:' + result.ConfigSetting[i].value);
						Titanium.App.Properties.setString('selected_country_id', result.ConfigSetting[i].value);
					}
					if (result.ConfigSetting[i].name === 'selected_country_name') {
						Ti.API.info('country name:' + result.ConfigSetting[i].value);
						Titanium.App.Properties.setString('selected_country_name', result.ConfigSetting[i].value);
					}
					if (result.ConfigSetting[i].name === 'selected_currency') {
						Ti.API.info('currency:' + result.ConfigSetting[i].value);
						Titanium.App.Properties.setString('selected_currency', result.ConfigSetting[i].value);
					}
					// set upload media file size limit
					if (result.ConfigSetting[i].name === 'app_media_upload_limit') {
						Ti.API.info('app_media_upload_limit:' + result.ConfigSetting[i].value);
						Titanium.App.Properties.setString('app_media_upload_limit', result.ConfigSetting[i].value);
					}
					if (result.ConfigSetting[i].name === 'app_media_upload_limit_image') {
						Ti.API.info('app_media_upload_limit_image:' + result.ConfigSetting[i].value);
						Titanium.App.Properties.setString('app_media_upload_limit_image', result.ConfigSetting[i].value);
					}
					if (result.ConfigSetting[i].name === 'app_media_upload_limit_audio') {
						Ti.API.info('app_media_upload_limit_audio:' + result.ConfigSetting[i].value);
						Titanium.App.Properties.setString('app_media_upload_limit_audio', result.ConfigSetting[i].value);
					}
					if (result.ConfigSetting[i].name === 'app_media_upload_limit_video') {
						Ti.API.info('app_media_upload_limit:' + result.ConfigSetting[i].value);
						Titanium.App.Properties.setString('app_media_upload_limit_video', result.ConfigSetting[i].value);
					}
					if (result.ConfigSetting[i].name === 'app_media_upload_limit_document') {
						Ti.API.info('app_media_upload_limit:' + result.ConfigSetting[i].value);
						Titanium.App.Properties.setString('app_media_upload_limit_document', result.ConfigSetting[i].value);
					}
					if (result.ConfigSetting[i].name === 'lock_smith_company_id') {
						Titanium.App.Properties.setString('lock_smith_company_id', result.ConfigSetting[i].value);
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_frontend_config_setting_table');
			return;
		}
	},
	update_my_quote_asset_type_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteAssetTypeCode === undefined) || (result.QuoteAssetTypeCode === null) || (result.QuoteAssetTypeCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_quote_asset_type_code');
				for (var i = 0, j = result.QuoteAssetTypeCode.length; i < j; i++) {
					db.execute('INSERT INTO my_quote_asset_type_code (code,name,path,description)VALUES(?,?,?,?)', ((result.QuoteAssetTypeCode[i].code != undefined) && (result.QuoteAssetTypeCode[i].code != null)) ? result.QuoteAssetTypeCode[i].code : 0, ((result.QuoteAssetTypeCode[i].name != undefined) && (result.QuoteAssetTypeCode[i].name != null)) ? result.QuoteAssetTypeCode[i].name : '',
									((result.QuoteAssetTypeCode[i].path != undefined) && (result.QuoteAssetTypeCode[i].path != null)) ? result.QuoteAssetTypeCode[i].path : '', ((result.QuoteAssetTypeCode[i].description != undefined) && (result.QuoteAssetTypeCode[i].description != null)) ? result.QuoteAssetTypeCode[i].description : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_asset_type_code_table');
			return;
		}
	},
	update_my_quote_note_type_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteNoteTypeCode === undefined) || (result.QuoteNoteTypeCode === null) || (result.QuoteNoteTypeCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_quote_note_type_code');
				for (var i = 0, j = result.QuoteNoteTypeCode.length; i < j; i++) {
					db.execute('INSERT INTO my_quote_note_type_code (code,name,description)VALUES(?,?,?)', ((result.QuoteNoteTypeCode[i].code != undefined) && (result.QuoteNoteTypeCode[i].code != null)) ? result.QuoteNoteTypeCode[i].code : 0, ((result.QuoteNoteTypeCode[i].name != undefined) && (result.QuoteNoteTypeCode[i].name != null)) ? result.QuoteNoteTypeCode[i].name : '',
									((result.QuoteNoteTypeCode[i].description != undefined) && (result.QuoteNoteTypeCode[i].description != null)) ? result.QuoteNoteTypeCode[i].description : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_note_type_code_table');
			return;
		}
	},
	update_my_quote_status_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteStatusCode === undefined) || (result.QuoteStatusCode === null) || (result.QuoteStatusCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_quote_status_code');
				for (var i = 0, j = result.QuoteStatusCode.length; i < j; i++) {
					db.execute('INSERT INTO my_quote_status_code (code,name,abbr,colour,description)VALUES(?,?,?,?,?)', ((result.QuoteStatusCode[i].code != undefined) && (result.QuoteStatusCode[i].code != null)) ? result.QuoteStatusCode[i].code : 0, ((result.QuoteStatusCode[i].name != undefined) && (result.QuoteStatusCode[i].name != null)) ? result.QuoteStatusCode[i].name : '',
									((result.QuoteStatusCode[i].abbr != undefined) && (result.QuoteStatusCode[i].abbr != null)) ? result.QuoteStatusCode[i].abbr : '', ((result.QuoteStatusCode[i].colour != undefined) && (result.QuoteStatusCode[i].colour != null)) ? result.QuoteStatusCode[i].colour : '', ((result.QuoteStatusCode[i].description != undefined) && (result.QuoteStatusCode[i].description != null)) ? result.QuoteStatusCode[i].description : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_status_code_table');
			return;
		}
	},
	update_my_quote_operation_log_type_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteOperationLogTypeCode === undefined) || (result.QuoteOperationLogTypeCode === null) || (result.QuoteOperationLogTypeCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_quote_operation_log_type_code');
				for (var i = 0, j = result.QuoteOperationLogTypeCode.length; i < j; i++) {
					db.execute('INSERT INTO my_quote_operation_log_type_code (code,name,colour,description)VALUES(?,?,?,?)', ((result.QuoteOperationLogTypeCode[i].code != undefined) && (result.QuoteOperationLogTypeCode[i].code != null)) ? result.QuoteOperationLogTypeCode[i].code : 0, ((result.QuoteOperationLogTypeCode[i].name != undefined) && (result.QuoteOperationLogTypeCode[i].name != null)) ? result.QuoteOperationLogTypeCode[i].name : '',
									((result.QuoteOperationLogTypeCode[i].colour != undefined) && (result.QuoteOperationLogTypeCode[i].colour != null)) ? result.QuoteOperationLogTypeCode[i].colour : '', ((result.QuoteOperationLogTypeCode[i].description != undefined) && (result.QuoteOperationLogTypeCode[i].description != null)) ? result.QuoteOperationLogTypeCode[i].description : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_operation_log_type_code_table');
			return;
		}
	},
	update_my_manager_user_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.ManagerUser === undefined) || (result.ManagerUser === null) || (result.ManagerUser.length <= 0)) {
			} else {
				for (var i = 0, j = result.ManagerUser.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_manager_user WHERE id=' + result.ManagerUser[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							data_row_count = data_rows.getRowCount();
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((result.ManagerUser[i].created === temp_created) && ((result.ManagerUser[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_manager_user SET reference_number=?,company_id=?,display_name=?,display_abbr=?,username=?,password=?,' + 'salutation_code=?,first_name=?,last_name=?,position=?,phone_mobile=?,phone=?,fax=?,skype_name=?,email=?,dob=?,' + 'introduction=?,photo_original=?,'
											+ 'enable_team_view=?,enable_notifiactions_email=?,enable_notifications_sms=?,enable_notifications_push=?,rate_per_hour=?,tfn=?,date_commenced=?,employment_type_code=?,' + 'token=?,agreement=?,status_code=?,colour=?,app_security_session=?,device_type=?,device_platform=?,device_model=?,device_version=?,app_version=?,created=?,created_by=?,modified_by=?,modified=? ' + 'WHERE id=' + result.ManagerUser[i].id,
											((result.ManagerUser[i].reference_number != undefined) && (result.ManagerUser[i].reference_number != null)) ? result.ManagerUser[i].reference_number : 0, ((result.ManagerUser[i].company_id != undefined) && (result.ManagerUser[i].company_id != null)) ? result.ManagerUser[i].company_id : 0,
											((result.ManagerUser[i].display_name != undefined) && (result.ManagerUser[i].display_name != null)) ? result.ManagerUser[i].display_name : '', ((result.ManagerUser[i].display_abbr != undefined) && (result.ManagerUser[i].display_abbr != null)) ? result.ManagerUser[i].display_abbr : '', ((result.ManagerUser[i].username != undefined) && (result.ManagerUser[i].username != null)) ? result.ManagerUser[i].username
															: '', ((result.ManagerUser[i].password != undefined) && (result.ManagerUser[i].password != null)) ? result.ManagerUser[i].password : '', ((result.ManagerUser[i].salutation_code != undefined) && (result.ManagerUser[i].salutation_code != null)) ? result.ManagerUser[i].salutation_code : 0,
											((result.ManagerUser[i].first_name != undefined) && (result.ManagerUser[i].first_name != null)) ? result.ManagerUser[i].first_name : '', ((result.ManagerUser[i].last_name != undefined) && (result.ManagerUser[i].last_name != null)) ? result.ManagerUser[i].last_name : '', ((result.ManagerUser[i].position != undefined) && (result.ManagerUser[i].position != null)) ? result.ManagerUser[i].position : '',
											((result.ManagerUser[i].phone_mobile != undefined) && (result.ManagerUser[i].phone_mobile != null)) ? result.ManagerUser[i].phone_mobile : '', ((result.ManagerUser[i].phone != undefined) && (result.ManagerUser[i].phone != null)) ? result.ManagerUser[i].phone : '', ((result.ManagerUser[i].fax != undefined) && (result.ManagerUser[i].fax != null)) ? result.ManagerUser[i].fax : '',
											((result.ManagerUser[i].skype_name != undefined) && (result.ManagerUser[i].skype_name != null)) ? result.ManagerUser[i].skype_name : '', ((result.ManagerUser[i].email != undefined) && (result.ManagerUser[i].email != null)) ? result.ManagerUser[i].email : '', ((result.ManagerUser[i].dob != undefined) && (result.ManagerUser[i].dob != null)) ? result.ManagerUser[i].dob : '',
											((result.ManagerUser[i].introduction != undefined) && (result.ManagerUser[i].introduction != null)) ? result.ManagerUser[i].introduction : '', ((result.ManagerUser[i].photo_original != undefined) && (result.ManagerUser[i].photo_original != null)) ? result.ManagerUser[i].photo_original : '',
											((result.ManagerUser[i].enable_team_view != undefined) && (result.ManagerUser[i].enable_team_view != null)) ? result.ManagerUser[i].enable_team_view : 0, ((result.ManagerUser[i].enable_notifiactions_email != undefined) && (result.ManagerUser[i].enable_notifiactions_email != null)) ? result.ManagerUser[i].enable_notifiactions_email : 0,
											((result.ManagerUser[i].enable_notifications_sms != undefined) && (result.ManagerUser[i].enable_notifications_sms != null)) ? result.ManagerUser[i].enable_notifications_sms : 0, ((result.ManagerUser[i].enable_notifications_push != undefined) && (result.ManagerUser[i].enable_notifications_push != null)) ? result.ManagerUser[i].enable_notifications_push : 0,
											((result.ManagerUser[i].rate_per_hour != undefined) && (result.ManagerUser[i].rate_per_hour != null)) ? result.ManagerUser[i].rate_per_hour : 0, ((result.ManagerUser[i].tfn != undefined) && (result.ManagerUser[i].tfn != null)) ? result.ManagerUser[i].tfn : '', ((result.ManagerUser[i].date_commenced != undefined) && (result.ManagerUser[i].date_commenced != null)) ? result.ManagerUser[i].date_commenced : '',
											((result.ManagerUser[i].employment_type_code != undefined) && (result.ManagerUser[i].employment_type_code != null)) ? result.ManagerUser[i].employment_type_code : 0, ((result.ManagerUser[i].token != undefined) && (result.ManagerUser[i].token != null)) ? result.ManagerUser[i].token : '',
											((result.ManagerUser[i].agreement != undefined) && (result.ManagerUser[i].agreement != null)) ? result.ManagerUser[i].agreement : '', ((result.ManagerUser[i].status_code != undefined) && (result.ManagerUser[i].status_code != null)) ? result.ManagerUser[i].status_code : 0, ((result.ManagerUser[i].colour != undefined) && (result.ManagerUser[i].colour != null)) ? result.ManagerUser[i].colour : '',
											((result.ManagerUser[i].app_security_session != undefined) && (result.ManagerUser[i].app_security_session != null)) ? result.ManagerUser[i].app_security_session : '', ((result.ManagerUser[i].device_type != undefined) && (result.ManagerUser[i].device_type != null)) ? result.ManagerUser[i].device_type : '',
											((result.ManagerUser[i].device_platform != undefined) && (result.ManagerUser[i].device_platform != null)) ? result.ManagerUser[i].device_platform : '', ((result.ManagerUser[i].device_model != undefined) && (result.ManagerUser[i].device_model != null)) ? result.ManagerUser[i].device_model : '',
											((result.ManagerUser[i].device_version != undefined) && (result.ManagerUser[i].device_version != null)) ? result.ManagerUser[i].device_version : '', ((result.ManagerUser[i].app_version != undefined) && (result.ManagerUser[i].app_version != null)) ? result.ManagerUser[i].app_version : '', ((result.ManagerUser[i].created != undefined) && (result.ManagerUser[i].created != null)) ? result.ManagerUser[i].created
															: '', ((result.ManagerUser[i].created_by != undefined) && (result.ManagerUser[i].created_by != null)) ? result.ManagerUser[i].created_by : 0, ((result.ManagerUser[i].modified_by != undefined) && (result.ManagerUser[i].modified_by != null)) ? result.ManagerUser[i].modified_by : 0,
											((result.ManagerUser[i].modified != undefined) && (result.ManagerUser[i].modified != null)) ? result.ManagerUser[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_manager_user (id,reference_number,company_id,display_name,display_abbr,username,password,salutation_code,first_name,last_name,' + 'position,phone_mobile,phone,fax,skype_name,email,dob,introduction,photo_original,' + 'enable_team_view,enable_notifiactions_email,enable_notifications_sms,enable_notifications_push,rate_per_hour,tfn,date_commenced,employment_type_code,'
										+ 'token,agreement,status_code,colour,local_login_status,app_security_session,device_type,device_platform,device_model,device_version,app_version,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.ManagerUser[i].id != undefined) && (result.ManagerUser[i].id != null)) ? result.ManagerUser[i].id : 0,
										((result.ManagerUser[i].reference_number != undefined) && (result.ManagerUser[i].reference_number != null)) ? result.ManagerUser[i].reference_number : 0, ((result.ManagerUser[i].company_id != undefined) && (result.ManagerUser[i].company_id != null)) ? result.ManagerUser[i].company_id : 0,
										((result.ManagerUser[i].display_name != undefined) && (result.ManagerUser[i].display_name != null)) ? result.ManagerUser[i].display_name : '', ((result.ManagerUser[i].display_abbr != undefined) && (result.ManagerUser[i].display_abbr != null)) ? result.ManagerUser[i].display_abbr : '', ((result.ManagerUser[i].username != undefined) && (result.ManagerUser[i].username != null)) ? result.ManagerUser[i].username : '',
										((result.ManagerUser[i].password != undefined) && (result.ManagerUser[i].password != null)) ? result.ManagerUser[i].password : '', ((result.ManagerUser[i].salutation_code != undefined) && (result.ManagerUser[i].salutation_code != null)) ? result.ManagerUser[i].salutation_code : 0, ((result.ManagerUser[i].first_name != undefined) && (result.ManagerUser[i].first_name != null)) ? result.ManagerUser[i].first_name : '',
										((result.ManagerUser[i].last_name != undefined) && (result.ManagerUser[i].last_name != null)) ? result.ManagerUser[i].last_name : '', ((result.ManagerUser[i].position != undefined) && (result.ManagerUser[i].position != null)) ? result.ManagerUser[i].position : '', ((result.ManagerUser[i].phone_mobile != undefined) && (result.ManagerUser[i].phone_mobile != null)) ? result.ManagerUser[i].phone_mobile : '',
										((result.ManagerUser[i].phone != undefined) && (result.ManagerUser[i].phone != null)) ? result.ManagerUser[i].phone : '', ((result.ManagerUser[i].fax != undefined) && (result.ManagerUser[i].fax != null)) ? result.ManagerUser[i].fax : '', ((result.ManagerUser[i].skype_name != undefined) && (result.ManagerUser[i].skype_name != null)) ? result.ManagerUser[i].skype_name : '',
										((result.ManagerUser[i].email != undefined) && (result.ManagerUser[i].email != null)) ? result.ManagerUser[i].email : '', ((result.ManagerUser[i].dob != undefined) && (result.ManagerUser[i].dob != null)) ? result.ManagerUser[i].dob : '', ((result.ManagerUser[i].introduction != undefined) && (result.ManagerUser[i].introduction != null)) ? result.ManagerUser[i].introduction : '',
										((result.ManagerUser[i].photo_original != undefined) && (result.ManagerUser[i].photo_original != null)) ? result.ManagerUser[i].photo_original : '', ((result.ManagerUser[i].enable_team_view != undefined) && (result.ManagerUser[i].enable_team_view != null)) ? result.ManagerUser[i].enable_team_view : 0,
										((result.ManagerUser[i].enable_notifiactions_email != undefined) && (result.ManagerUser[i].enable_notifiactions_email != null)) ? result.ManagerUser[i].enable_notifiactions_email : 0, ((result.ManagerUser[i].enable_notifications_sms != undefined) && (result.ManagerUser[i].enable_notifications_sms != null)) ? result.ManagerUser[i].enable_notifications_sms : 0,
										((result.ManagerUser[i].enable_notifications_push != undefined) && (result.ManagerUser[i].enable_notifications_push != null)) ? result.ManagerUser[i].enable_notifications_push : 0, ((result.ManagerUser[i].rate_per_hour != undefined) && (result.ManagerUser[i].rate_per_hour != null)) ? result.ManagerUser[i].rate_per_hour : 0,
										((result.ManagerUser[i].tfn != undefined) && (result.ManagerUser[i].tfn != null)) ? result.ManagerUser[i].tfn : '', ((result.ManagerUser[i].date_commenced != undefined) && (result.ManagerUser[i].date_commenced != null)) ? result.ManagerUser[i].date_commenced : '',
										((result.ManagerUser[i].employment_type_code != undefined) && (result.ManagerUser[i].employment_type_code != null)) ? result.ManagerUser[i].employment_type_code : 0, ((result.ManagerUser[i].token != undefined) && (result.ManagerUser[i].token != null)) ? result.ManagerUser[i].token : '', ((result.ManagerUser[i].agreement != undefined) && (result.ManagerUser[i].agreement != null)) ? result.ManagerUser[i].agreement
														: '', ((result.ManagerUser[i].status_code != undefined) && (result.ManagerUser[i].status_code != null)) ? result.ManagerUser[i].status_code : 0, ((result.ManagerUser[i].colour != undefined) && (result.ManagerUser[i].colour != null)) ? result.ManagerUser[i].colour : '',
										((result.ManagerUser[i].local_login_status != undefined) && (result.ManagerUser[i].local_login_status != null)) ? result.ManagerUser[i].local_login_status : 0, ((result.ManagerUser[i].app_security_session != undefined) && (result.ManagerUser[i].app_security_session != null)) ? result.ManagerUser[i].app_security_session : '',
										((result.ManagerUser[i].device_type != undefined) && (result.ManagerUser[i].device_type != null)) ? result.ManagerUser[i].device_type : '', ((result.ManagerUser[i].device_platform != undefined) && (result.ManagerUser[i].device_platform != null)) ? result.ManagerUser[i].device_platform : '',
										((result.ManagerUser[i].device_model != undefined) && (result.ManagerUser[i].device_model != null)) ? result.ManagerUser[i].device_model : '', ((result.ManagerUser[i].device_version != undefined) && (result.ManagerUser[i].device_version != null)) ? result.ManagerUser[i].device_version : '',
										((result.ManagerUser[i].app_version != undefined) && (result.ManagerUser[i].app_version != null)) ? result.ManagerUser[i].app_version : '', ((result.ManagerUser[i].created != undefined) && (result.ManagerUser[i].created != null)) ? result.ManagerUser[i].created : '', ((result.ManagerUser[i].created_by != undefined) && (result.ManagerUser[i].created_by != null)) ? result.ManagerUser[i].created_by : 0,
										((result.ManagerUser[i].modified_by != undefined) && (result.ManagerUser[i].modified_by != null)) ? result.ManagerUser[i].modified_by : 0, ((result.ManagerUser[i].modified != undefined) && (result.ManagerUser[i].modified != null)) ? result.ManagerUser[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_manager_user_table');
			return;
		}
	},
	update_my_client_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.Client === undefined) || (result.Client === null) || (result.Client.length <= 0)) {
			} else {
				for (var i = 0, j = result.Client.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_client WHERE id=' + result.Client[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.Client[i].created === temp_created) && ((result.Client[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_client SET local_id=?,company_id=?,reference_number=?,client_name=?,client_abbr=?,phone_mobile=?,phone=?,fax=?,skype_name=?,email=?,website=?,' + 'client_type_code=?,description=?,sub_number=?,unit_number=?,street_number=?,street=?,locality_street_type_id=?,street_type=?,' + 'locality_suburb_id=?,suburb=?,postcode=?,locality_state_id=?,latitude=?,longitude=?,point=?,boundary=?,geo_source_code=?,geo_accuracy_code=?,'
											+ 'postal_address=?,abn=?,' + 'account_external_reference=?,account_mark_up=?,account_payment_terms=?,' + 'account_payment_comments=?,status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.Client[i].id, ((result.Client[i].local_id != undefined) && (result.Client[i].local_id != null)) ? result.Client[i].local_id : '',
											((result.Client[i].company_id != undefined) && (result.Client[i].company_id != null)) ? result.Client[i].company_id : 0, ((result.Client[i].reference_number != undefined) && (result.Client[i].reference_number != null)) ? result.Client[i].reference_number : 0, ((result.Client[i].client_name != undefined) && (result.Client[i].client_name != null)) ? result.Client[i].client_name : '',
											((result.Client[i].client_abbr != undefined) && (result.Client[i].client_abbr != null)) ? result.Client[i].client_abbr : '', ((result.Client[i].phone_mobile != undefined) && (result.Client[i].phone_mobile != null)) ? result.Client[i].phone_mobile : '', ((result.Client[i].phone != undefined) && (result.Client[i].phone != null)) ? result.Client[i].phone : '',
											((result.Client[i].fax != undefined) && (result.Client[i].fax != null)) ? result.Client[i].fax : '', ((result.Client[i].skype_name != undefined) && (result.Client[i].skype_name != null)) ? result.Client[i].skype_name : '', ((result.Client[i].email != undefined) && (result.Client[i].email != null)) ? result.Client[i].email : '',
											((result.Client[i].website != undefined) && (result.Client[i].website != null)) ? result.Client[i].website : '', ((result.Client[i].client_type_code != undefined) && (result.Client[i].client_type_code != null)) ? result.Client[i].client_type_code : 0, ((result.Client[i].description != undefined) && (result.Client[i].description != null)) ? result.Client[i].description : '',
											((result.Client[i].sub_number != undefined) && (result.Client[i].sub_number != null)) ? result.Client[i].sub_number : '', ((result.Client[i].unit_number != undefined) && (result.Client[i].unit_number != null)) ? result.Client[i].unit_number : '', ((result.Client[i].street_number != undefined) && (result.Client[i].street_number != null)) ? result.Client[i].street_number : '',
											((result.Client[i].street != undefined) && (result.Client[i].street != null)) ? result.Client[i].street : '', ((result.Client[i].locality_street_type_id != undefined) && (result.Client[i].locality_street_type_id != null)) ? result.Client[i].locality_street_type_id : 0, ((result.Client[i].street_type != undefined) && (result.Client[i].street_type != null)) ? result.Client[i].street_type : '',
											((result.Client[i].locality_suburb_id != undefined) && (result.Client[i].locality_suburb_id != null)) ? result.Client[i].locality_suburb_id : 0, ((result.Client[i].suburb != undefined) && (result.Client[i].suburb != null)) ? result.Client[i].suburb : '', ((result.Client[i].postcode != undefined) && (result.Client[i].postcode != null)) ? result.Client[i].postcode : '',
											((result.Client[i].locality_state_id != undefined) && (result.Client[i].locality_state_id != null)) ? result.Client[i].locality_state_id : 0, ((result.Client[i].latitude != undefined) && (result.Client[i].latitude != null)) ? result.Client[i].latitude : 0, ((result.Client[i].longitude != undefined) && (result.Client[i].longitude != null)) ? result.Client[i].longitude : 0,
											((result.Client[i].point != undefined) && (result.Client[i].point != null)) ? result.Client[i].point : '', ((result.Client[i].boundary != undefined) && (result.Client[i].boundary != null)) ? result.Client[i].boundary : '', ((result.Client[i].geo_source_code != undefined) && (result.Client[i].geo_source_code != null)) ? result.Client[i].geo_source_code : 0,
											((result.Client[i].geo_accuracy_code != undefined) && (result.Client[i].geo_accuracy_code != null)) ? result.Client[i].geo_accuracy_code : 0, ((result.Client[i].postal_address != undefined) && (result.Client[i].postal_address != null)) ? result.Client[i].postal_address : '', ((result.Client[i].abn != undefined) && (result.Client[i].abn != null)) ? result.Client[i].abn : '',
											((result.Client[i].account_external_reference != undefined) && (result.Client[i].account_external_reference != null)) ? result.Client[i].account_external_reference : '', ((result.Client[i].account_mark_up != undefined) && (result.Client[i].account_mark_up != null)) ? result.Client[i].account_mark_up : 0,
											((result.Client[i].account_payment_terms != undefined) && (result.Client[i].account_payment_terms != null)) ? result.Client[i].account_payment_terms : '', ((result.Client[i].account_payment_comments != undefined) && (result.Client[i].account_payment_comments != null)) ? result.Client[i].account_payment_comments : '',
											((result.Client[i].status_code != undefined) && (result.Client[i].status_code != null)) ? result.Client[i].status_code : 0, 0, ((result.Client[i].created != undefined) && (result.Client[i].created != null)) ? result.Client[i].created : '', ((result.Client[i].created_by != undefined) && (result.Client[i].created_by != null)) ? result.Client[i].created_by : 0,
											((result.Client[i].modified_by != undefined) && (result.Client[i].modified_by != null)) ? result.Client[i].modified_by : 0, ((result.Client[i].modified != undefined) && (result.Client[i].modified != null)) ? result.Client[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_client (id,local_id,company_id,reference_number,client_name,client_abbr,phone_mobile,phone,fax,skype_name,email,website,' + 'client_type_code,description,sub_number,unit_number,street_number,street,locality_street_type_id,street_type,' + 'locality_suburb_id,suburb,postcode,locality_state_id,latitude,longitude,point,boundary,geo_source_code,geo_accuracy_code,' + 'postal_address,abn,'
										+ 'account_external_reference,account_mark_up,account_payment_terms,account_payment_comments,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.Client[i].id != undefined) && (result.Client[i].id != null)) ? result.Client[i].id : '',
										((result.Client[i].local_id != undefined) && (result.Client[i].local_id != null)) ? result.Client[i].local_id : '', ((result.Client[i].company_id != undefined) && (result.Client[i].company_id != null)) ? result.Client[i].company_id : 0, ((result.Client[i].reference_number != undefined) && (result.Client[i].reference_number != null)) ? result.Client[i].reference_number : 0,
										((result.Client[i].client_name != undefined) && (result.Client[i].client_name != null)) ? result.Client[i].client_name : '', ((result.Client[i].client_abbr != undefined) && (result.Client[i].client_abbr != null)) ? result.Client[i].client_abbr : '', ((result.Client[i].phone_mobile != undefined) && (result.Client[i].phone_mobile != null)) ? result.Client[i].phone_mobile : '',
										((result.Client[i].phone != undefined) && (result.Client[i].phone != null)) ? result.Client[i].phone : '', ((result.Client[i].fax != undefined) && (result.Client[i].fax != null)) ? result.Client[i].fax : '', ((result.Client[i].skype_name != undefined) && (result.Client[i].skype_name != null)) ? result.Client[i].skype_name : '',
										((result.Client[i].email != undefined) && (result.Client[i].email != null)) ? result.Client[i].email : '', ((result.Client[i].website != undefined) && (result.Client[i].website != null)) ? result.Client[i].website : '', ((result.Client[i].client_type_code != undefined) && (result.Client[i].client_type_code != null)) ? result.Client[i].client_type_code : 0,
										((result.Client[i].description != undefined) && (result.Client[i].description != null)) ? result.Client[i].description : '', ((result.Client[i].sub_number != undefined) && (result.Client[i].sub_number != null)) ? result.Client[i].sub_number : '', ((result.Client[i].unit_number != undefined) && (result.Client[i].unit_number != null)) ? result.Client[i].unit_number : '',
										((result.Client[i].street_number != undefined) && (result.Client[i].street_number != null)) ? result.Client[i].street_number : '', ((result.Client[i].street != undefined) && (result.Client[i].street != null)) ? result.Client[i].street : '', ((result.Client[i].locality_street_type_id != undefined) && (result.Client[i].locality_street_type_id != null)) ? result.Client[i].locality_street_type_id : 0,
										((result.Client[i].street_type != undefined) && (result.Client[i].street_type != null)) ? result.Client[i].street_type : '', ((result.Client[i].locality_suburb_id != undefined) && (result.Client[i].locality_suburb_id != null)) ? result.Client[i].locality_suburb_id : 0, ((result.Client[i].suburb != undefined) && (result.Client[i].suburb != null)) ? result.Client[i].suburb : '',
										((result.Client[i].postcode != undefined) && (result.Client[i].postcode != null)) ? result.Client[i].postcode : '', ((result.Client[i].locality_state_id != undefined) && (result.Client[i].locality_state_id != null)) ? result.Client[i].locality_state_id : 0, ((result.Client[i].latitude != undefined) && (result.Client[i].latitude != null)) ? result.Client[i].latitude : 0,
										((result.Client[i].longitude != undefined) && (result.Client[i].longitude != null)) ? result.Client[i].longitude : 0, ((result.Client[i].point != undefined) && (result.Client[i].point != null)) ? result.Client[i].point : '', ((result.Client[i].boundary != undefined) && (result.Client[i].boundary != null)) ? result.Client[i].boundary : '',
										((result.Client[i].geo_source_code != undefined) && (result.Client[i].geo_source_code != null)) ? result.Client[i].geo_source_code : 0, ((result.Client[i].geo_accuracy_code != undefined) && (result.Client[i].geo_accuracy_code != null)) ? result.Client[i].geo_accuracy_code : 0, ((result.Client[i].postal_address != undefined) && (result.Client[i].postal_address != null)) ? result.Client[i].postal_address : '',
										((result.Client[i].abn != undefined) && (result.Client[i].abn != null)) ? result.Client[i].abn : '', ((result.Client[i].account_external_reference != undefined) && (result.Client[i].account_external_reference != null)) ? result.Client[i].account_external_reference : '', ((result.Client[i].account_mark_up != undefined) && (result.Client[i].account_mark_up != null)) ? result.Client[i].account_mark_up : 0,
										((result.Client[i].account_payment_terms != undefined) && (result.Client[i].account_payment_terms != null)) ? result.Client[i].account_payment_terms : '', ((result.Client[i].account_payment_comments != undefined) && (result.Client[i].account_payment_comments != null)) ? result.Client[i].account_payment_comments : '',
										((result.Client[i].status_code != undefined) && (result.Client[i].status_code != null)) ? result.Client[i].status_code : 0, 0, ((result.Client[i].created != undefined) && (result.Client[i].created != null)) ? result.Client[i].created : '', ((result.Client[i].created_by != undefined) && (result.Client[i].created_by != null)) ? result.Client[i].created_by : 0,
										((result.Client[i].modified_by != undefined) && (result.Client[i].modified_by != null)) ? result.Client[i].modified_by : 0, ((result.Client[i].modified != undefined) && (result.Client[i].modified != null)) ? result.Client[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_client_table');
			return;
		}
	},
	update_my_client_contact_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.ClientContact === undefined) || (result.ClientContact === null) || (result.ClientContact.length <= 0)) {
			} else {
				for (var i = 0, j = result.ClientContact.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_client_contact WHERE id=' + result.ClientContact[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.ClientContact[i].created === temp_created) && ((result.ClientContact[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_client_contact SET local_id=?,client_id=?,' + 'salutation_code=?,display_name=?,first_name=?,last_name=?,position=?,' + 'phone_mobile=?,phone=?,fax=?,skype_name=?,email=?,website=?,' + 'note=?,username=?,password=?,enable_login=?,status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? ' + 'WHERE id=' + result.ClientContact[i].id,
											((result.ClientContact[i].local_id != undefined) && (result.ClientContact[i].local_id != null)) ? result.ClientContact[i].local_id : '', ((result.ClientContact[i].client_id != undefined) && (result.ClientContact[i].client_id != null)) ? result.ClientContact[i].client_id : 0,
											((result.ClientContact[i].salutation_code != undefined) && (result.ClientContact[i].salutation_code != null)) ? result.ClientContact[i].salutation_code : 0, ((result.ClientContact[i].display_name != undefined) && (result.ClientContact[i].display_name != null)) ? result.ClientContact[i].display_name : '',
											((result.ClientContact[i].first_name != undefined) && (result.ClientContact[i].first_name != null)) ? result.ClientContact[i].first_name : '', ((result.ClientContact[i].last_name != undefined) && (result.ClientContact[i].last_name != null)) ? result.ClientContact[i].last_name : '',
											((result.ClientContact[i].position != undefined) && (result.ClientContact[i].position != null)) ? result.ClientContact[i].position : '', ((result.ClientContact[i].phone_mobile != undefined) && (result.ClientContact[i].phone_mobile != null)) ? result.ClientContact[i].phone_mobile : '', ((result.ClientContact[i].phone != undefined) && (result.ClientContact[i].phone != null)) ? result.ClientContact[i].phone
															: '', ((result.ClientContact[i].fax != undefined) && (result.ClientContact[i].fax != null)) ? result.ClientContact[i].fax : '', ((result.ClientContact[i].skype_name != undefined) && (result.ClientContact[i].skype_name != null)) ? result.ClientContact[i].skype_name : '',
											((result.ClientContact[i].email != undefined) && (result.ClientContact[i].email != null)) ? result.ClientContact[i].email : '', ((result.ClientContact[i].website != undefined) && (result.ClientContact[i].website != null)) ? result.ClientContact[i].website : '', ((result.ClientContact[i].note != undefined) && (result.ClientContact[i].note != null)) ? result.ClientContact[i].note : '',
											((result.ClientContact[i].username != undefined) && (result.ClientContact[i].username != null)) ? result.ClientContact[i].username : '', ((result.ClientContact[i].password != undefined) && (result.ClientContact[i].password != null)) ? result.ClientContact[i].password : '',
											((result.ClientContact[i].enable_login != undefined) && (result.ClientContact[i].enable_login != null)) ? result.ClientContact[i].enable_login : 0, ((result.ClientContact[i].status_code != undefined) && (result.ClientContact[i].status_code != null)) ? result.ClientContact[i].status_code : 0, 0,
											((result.ClientContact[i].created != undefined) && (result.ClientContact[i].created != null)) ? result.ClientContact[i].created : '', ((result.ClientContact[i].created_by != undefined) && (result.ClientContact[i].created_by != null)) ? result.ClientContact[i].created_by : 0,
											((result.ClientContact[i].modified_by != undefined) && (result.ClientContact[i].modified_by != null)) ? result.ClientContact[i].modified_by : 0, ((result.ClientContact[i].modified != undefined) && (result.ClientContact[i].modified != null)) ? result.ClientContact[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_client_contact (id,local_id,client_id,' + 'salutation_code,display_name,first_name,last_name,position,phone_mobile,' + 'phone,fax,skype_name,email,website,' + 'note,username,password,enable_login,status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
										((result.ClientContact[i].id != undefined) && (result.ClientContact[i].id != null)) ? result.ClientContact[i].id : 0, ((result.ClientContact[i].local_id != undefined) && (result.ClientContact[i].local_id != null)) ? result.ClientContact[i].local_id : '', ((result.ClientContact[i].client_id != undefined) && (result.ClientContact[i].client_id != null)) ? result.ClientContact[i].client_id : 0,
										((result.ClientContact[i].salutation_code != undefined) && (result.ClientContact[i].salutation_code != null)) ? result.ClientContact[i].salutation_code : 0, ((result.ClientContact[i].display_name != undefined) && (result.ClientContact[i].display_name != null)) ? result.ClientContact[i].display_name : '',
										((result.ClientContact[i].first_name != undefined) && (result.ClientContact[i].first_name != null)) ? result.ClientContact[i].first_name : '', ((result.ClientContact[i].last_name != undefined) && (result.ClientContact[i].last_name != null)) ? result.ClientContact[i].last_name : '', ((result.ClientContact[i].position != undefined) && (result.ClientContact[i].position != null)) ? result.ClientContact[i].position : '',
										((result.ClientContact[i].phone_mobile != undefined) && (result.ClientContact[i].phone_mobile != null)) ? result.ClientContact[i].phone_mobile : '', ((result.ClientContact[i].phone != undefined) && (result.ClientContact[i].phone != null)) ? result.ClientContact[i].phone : '', ((result.ClientContact[i].fax != undefined) && (result.ClientContact[i].fax != null)) ? result.ClientContact[i].fax : '',
										((result.ClientContact[i].skype_name != undefined) && (result.ClientContact[i].skype_name != null)) ? result.ClientContact[i].skype_name : '', ((result.ClientContact[i].email != undefined) && (result.ClientContact[i].email != null)) ? result.ClientContact[i].email : '', ((result.ClientContact[i].website != undefined) && (result.ClientContact[i].website != null)) ? result.ClientContact[i].website : '',
										((result.ClientContact[i].note != undefined) && (result.ClientContact[i].note != null)) ? result.ClientContact[i].note : '', ((result.ClientContact[i].username != undefined) && (result.ClientContact[i].username != null)) ? result.ClientContact[i].username : '', ((result.ClientContact[i].password != undefined) && (result.ClientContact[i].password != null)) ? result.ClientContact[i].password : '',
										((result.ClientContact[i].enable_login != undefined) && (result.ClientContact[i].enable_login != null)) ? result.ClientContact[i].enable_login : 0, ((result.ClientContact[i].status_code != undefined) && (result.ClientContact[i].status_code != null)) ? result.ClientContact[i].status_code : 0, 0,
										((result.ClientContact[i].created != undefined) && (result.ClientContact[i].created != null)) ? result.ClientContact[i].created : '', ((result.ClientContact[i].created_by != undefined) && (result.ClientContact[i].created_by != null)) ? result.ClientContact[i].created_by : 0,
										((result.ClientContact[i].modified_by != undefined) && (result.ClientContact[i].modified_by != null)) ? result.ClientContact[i].modified_by : 0, ((result.ClientContact[i].modified != undefined) && (result.ClientContact[i].modified != null)) ? result.ClientContact[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_client_contact_table');
			return;
		}
	},
	update_my_company_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.Company === undefined) || (result.Company === null) || (result.Company.length <= 0)) {
			} else {
				for (var i = 0, j = result.Company.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_company WHERE id=' + result.Company[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((result.Company[i].created === temp_created) && ((result.Company[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_company SET company_group_id=?,company_name=?,abn=?,corporation_name=?,' + 'phone=?,phone_alt=?,fax=?,email=?,website=?,sub_number=?,unit_number=?,' + 'street_number=?,street=?,locality_street_type_id=?,street_type=?,locality_suburb_id=?,suburb=?,postcode=?,locality_state_id=?,' + 'postal_address=?,logo_160x30=?,website_id=?,account_income_identifier=?,account_bank=?,account_bsb=?,account_number=?,'
											+ 'account_name=?,account_payment_terms=?,account_payment_comments=?,logo_banner=?,is_gst_exempt=?,active_material_location=?,total_user_accounts=?,' + 'owner_manager_user_id=?,invoice_template_id=?,tax=?,tax_amount=?,status_code=?,created=?,created_by=?,modified_by=?,modified=? ' + 'WHERE id=' + result.Company[i].id,
											((result.Company[i].company_group_id != undefined) && (result.Company[i].company_group_id != null)) ? result.Company[i].company_group_id : 0, ((result.Company[i].company_name != undefined) && (result.Company[i].company_name != null)) ? result.Company[i].company_name : '', ((result.Company[i].abn != undefined) && (result.Company[i].abn != null)) ? result.Company[i].abn : '',
											((result.Company[i].corporation_name != undefined) && (result.Company[i].corporation_name != null)) ? result.Company[i].corporation_name : '', ((result.Company[i].phone != undefined) && (result.Company[i].phone != null)) ? result.Company[i].phone : '', ((result.Company[i].phone_alt != undefined) && (result.Company[i].phone_alt != null)) ? result.Company[i].phone_alt : '',
											((result.Company[i].fax != undefined) && (result.Company[i].fax != null)) ? result.Company[i].fax : '', ((result.Company[i].email != undefined) && (result.Company[i].email != null)) ? result.Company[i].email : '', ((result.Company[i].website != undefined) && (result.Company[i].website != null)) ? result.Company[i].website : '',
											((result.Company[i].sub_number != undefined) && (result.Company[i].sub_number != null)) ? result.Company[i].sub_number : '', ((result.Company[i].unit_number != undefined) && (result.Company[i].unit_number != null)) ? result.Company[i].unit_number : '', ((result.Company[i].street_number != undefined) && (result.Company[i].street_number != null)) ? result.Company[i].street_number : '',
											((result.Company[i].street != undefined) && (result.Company[i].street != null)) ? result.Company[i].street : '', ((result.Company[i].locality_street_type_id != undefined) && (result.Company[i].locality_street_type_id != null)) ? result.Company[i].locality_street_type_id : 0, ((result.Company[i].street_type != undefined) && (result.Company[i].street_type != null)) ? result.Company[i].street_type : '',
											((result.Company[i].locality_suburb_id != undefined) && (result.Company[i].locality_suburb_id != null)) ? result.Company[i].locality_suburb_id : 0, ((result.Company[i].suburb != undefined) && (result.Company[i].suburb != null)) ? result.Company[i].suburb : '', ((result.Company[i].postcode != undefined) && (result.Company[i].postcode != null)) ? result.Company[i].postcode : '',
											((result.Company[i].locality_state_id != undefined) && (result.Company[i].locality_state_id != null)) ? result.Company[i].locality_state_id : 0, ((result.Company[i].postal_address != undefined) && (result.Company[i].postal_address != null)) ? result.Company[i].postal_address : '', ((result.Company[i].logo_160x30 != undefined) && (result.Company[i].logo_160x30 != null)) ? result.Company[i].logo_160x30 : '',
											((result.Company[i].website_id != undefined) && (result.Company[i].website_id != null)) ? result.Company[i].website_id : 0, ((result.Company[i].account_income_identifier != undefined) && (result.Company[i].account_income_identifier != null)) ? result.Company[i].account_income_identifier : '',
											((result.Company[i].account_bank != undefined) && (result.Company[i].account_bank != null)) ? result.Company[i].account_bank : '', ((result.Company[i].account_bsb != undefined) && (result.Company[i].account_bsb != null)) ? result.Company[i].account_bsb : '', ((result.Company[i].account_number != undefined) && (result.Company[i].account_number != null)) ? result.Company[i].account_number : '',
											((result.Company[i].account_name != undefined) && (result.Company[i].account_name != null)) ? result.Company[i].account_name : '', ((result.Company[i].account_payment_terms != undefined) && (result.Company[i].account_payment_terms != null)) ? result.Company[i].account_payment_terms : '',
											((result.Company[i].account_payment_comments != undefined) && (result.Company[i].account_payment_comments != null)) ? result.Company[i].account_payment_comments : '', ((result.Company[i].logo_banner != undefined) && (result.Company[i].logo_banner != null)) ? result.Company[i].logo_banner : '',
											((result.Company[i].is_gst_exempt != undefined) && (result.Company[i].is_gst_exempt != null)) ? result.Company[i].is_gst_exempt : 0, ((result.Company[i].active_material_location != undefined) && (result.Company[i].active_material_location != null)) ? result.Company[i].active_material_location : 0,
											((result.Company[i].total_user_accounts != undefined) && (result.Company[i].total_user_accounts != null)) ? result.Company[i].total_user_accounts : '', ((result.Company[i].owner_manager_user_id != undefined) && (result.Company[i].owner_manager_user_id != null)) ? result.Company[i].owner_manager_user_id : 0,
											((result.Company[i].invoice_template_id != undefined) && (result.Company[i].invoice_template_id != null)) ? result.Company[i].invoice_template_id : 0, ((result.Company[i].tax != undefined) && (result.Company[i].tax != null)) ? result.Company[i].tax : '', ((result.Company[i].tax_amount != undefined) && (result.Company[i].tax_amount != null)) ? result.Company[i].tax_amount : 0,
											((result.Company[i].status_code != undefined) && (result.Company[i].status_code != null)) ? result.Company[i].status_code : 0, ((result.Company[i].created != undefined) && (result.Company[i].created != null)) ? result.Company[i].created : '', ((result.Company[i].created_by != undefined) && (result.Company[i].created_by != null)) ? result.Company[i].created_by : 0,
											((result.Company[i].modified_by != undefined) && (result.Company[i].modified_by != null)) ? result.Company[i].modified_by : 0, ((result.Company[i].modified != undefined) && (result.Company[i].modified != null)) ? result.Company[i].modified : '');
							if (result.Company[i].id == parseInt(Ti.App.Properties.getString('current_company_id'))) {
								if ((result.Company[i].active_material_location != undefined) && (result.Company[i].active_material_location != null)) {
									Ti.App.Properties.setString('current_company_active_material_location', '0');
								} else {
									Ti.App.Properties.setString('current_company_active_material_location', result.Company[i].active_material_location);
								}
							}
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_company (id,company_group_id,company_name,abn,' + 'corporation_name,phone,phone_alt,fax,email,website,sub_number,unit_number,' + 'street_number,street,locality_street_type_id,street_type,locality_suburb_id,suburb,postcode,locality_state_id,postal_address,logo_160x30,' + 'website_id,account_income_identifier,account_bank,account_bsb,account_number,account_name,account_payment_terms,account_payment_comments,'
										+ 'logo_banner,is_gst_exempt,active_material_location,total_user_accounts,owner_manager_user_id,invoice_template_id,tax,tax_amount,status_code,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.Company[i].id != undefined) && (result.Company[i].id != null)) ? result.Company[i].id : 0,
										((result.Company[i].company_group_id != undefined) && (result.Company[i].company_group_id != null)) ? result.Company[i].company_group_id : 0, ((result.Company[i].company_name != undefined) && (result.Company[i].company_name != null)) ? result.Company[i].company_name : '', ((result.Company[i].abn != undefined) && (result.Company[i].abn != null)) ? result.Company[i].abn : '',
										((result.Company[i].corporation_name != undefined) && (result.Company[i].corporation_name != null)) ? result.Company[i].corporation_name : '', ((result.Company[i].phone != undefined) && (result.Company[i].phone != null)) ? result.Company[i].phone : '', ((result.Company[i].phone_alt != undefined) && (result.Company[i].phone_alt != null)) ? result.Company[i].phone_alt : '',
										((result.Company[i].fax != undefined) && (result.Company[i].fax != null)) ? result.Company[i].fax : '', ((result.Company[i].email != undefined) && (result.Company[i].email != null)) ? result.Company[i].email : '', ((result.Company[i].website != undefined) && (result.Company[i].website != null)) ? result.Company[i].website : '',
										((result.Company[i].sub_number != undefined) && (result.Company[i].sub_number != null)) ? result.Company[i].sub_number : '', ((result.Company[i].unit_number != undefined) && (result.Company[i].unit_number != null)) ? result.Company[i].unit_number : '', ((result.Company[i].street_number != undefined) && (result.Company[i].street_number != null)) ? result.Company[i].street_number : '',
										((result.Company[i].street != undefined) && (result.Company[i].street != null)) ? result.Company[i].street : '', ((result.Company[i].locality_street_type_id != undefined) && (result.Company[i].locality_street_type_id != null)) ? result.Company[i].locality_street_type_id : 0, ((result.Company[i].street_type != undefined) && (result.Company[i].street_type != null)) ? result.Company[i].street_type : '',
										((result.Company[i].locality_suburb_id != undefined) && (result.Company[i].locality_suburb_id != null)) ? result.Company[i].locality_suburb_id : 0, ((result.Company[i].suburb != undefined) && (result.Company[i].suburb != null)) ? result.Company[i].suburb : '', ((result.Company[i].postcode != undefined) && (result.Company[i].postcode != null)) ? result.Company[i].postcode : '',
										((result.Company[i].locality_state_id != undefined) && (result.Company[i].locality_state_id != null)) ? result.Company[i].locality_state_id : 0, ((result.Company[i].postal_address != undefined) && (result.Company[i].postal_address != null)) ? result.Company[i].postal_address : '', ((result.Company[i].logo_160x30 != undefined) && (result.Company[i].logo_160x30 != null)) ? result.Company[i].logo_160x30 : '',
										((result.Company[i].website_id != undefined) && (result.Company[i].website_id != null)) ? result.Company[i].website_id : 0, ((result.Company[i].account_income_identifier != undefined) && (result.Company[i].account_income_identifier != null)) ? result.Company[i].account_income_identifier : '', ((result.Company[i].account_bank != undefined) && (result.Company[i].account_bank != null)) ? result.Company[i].account_bank
														: '', ((result.Company[i].account_bsb != undefined) && (result.Company[i].account_bsb != null)) ? result.Company[i].account_bsb : '', ((result.Company[i].account_number != undefined) && (result.Company[i].account_number != null)) ? result.Company[i].account_number : '',
										((result.Company[i].account_name != undefined) && (result.Company[i].account_name != null)) ? result.Company[i].account_name : '', ((result.Company[i].account_payment_terms != undefined) && (result.Company[i].account_payment_terms != null)) ? result.Company[i].account_payment_terms : '',
										((result.Company[i].account_payment_comments != undefined) && (result.Company[i].account_payment_comments != null)) ? result.Company[i].account_payment_comments : '', ((result.Company[i].logo_banner != undefined) && (result.Company[i].logo_banner != null)) ? result.Company[i].logo_banner : '',
										((result.Company[i].is_gst_exempt != undefined) && (result.Company[i].is_gst_exempt != null)) ? result.Company[i].is_gst_exempt : 0, ((result.Company[i].active_material_location != undefined) && (result.Company[i].active_material_location != null)) ? result.Company[i].active_material_location : 0,
										((result.Company[i].total_user_accounts != undefined) && (result.Company[i].total_user_accounts != null)) ? result.Company[i].total_user_accounts : '', ((result.Company[i].owner_manager_user_id != undefined) && (result.Company[i].owner_manager_user_id != null)) ? result.Company[i].owner_manager_user_id : 0,
										((result.Company[i].invoice_template_id != undefined) && (result.Company[i].invoice_template_id != null)) ? result.Company[i].invoice_template_id : 0, ((result.Company[i].tax != undefined) && (result.Company[i].tax != null)) ? result.Company[i].tax : '', ((result.Company[i].tax_amount != undefined) && (result.Company[i].tax_amount != null)) ? result.Company[i].tax_amount : 0,
										((result.Company[i].status_code != undefined) && (result.Company[i].status_code != null)) ? result.Company[i].status_code : 0, ((result.Company[i].created != undefined) && (result.Company[i].created != null)) ? result.Company[i].created : '', ((result.Company[i].created_by != undefined) && (result.Company[i].created_by != null)) ? result.Company[i].created_by : 0,
										((result.Company[i].modified_by != undefined) && (result.Company[i].modified_by != null)) ? result.Company[i].modified_by : 0, ((result.Company[i].modified != undefined) && (result.Company[i].modified != null)) ? result.Company[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_company_table');
			return;
		}
	},
	update_my_job_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.Job === undefined) || (result.Job === null) || (result.Job.length <= 0)) {
			} else {
				for (var i = 0, j = result.Job.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job WHERE id=' + result.Job[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.Job[i].created === temp_created) && ((result.Job[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job SET local_id=?,company_id=?,client_id=?,job_priority_code=?,job_status_code=?,scheduled_from=?,' + 'scheduled_to=?,reference_number=?,order_reference=?,sp=?,sub_number=?,unit_number=?,street_number=?,street=?,locality_street_type_id=?,street_type=?,' + 'locality_suburb_id=?,suburb=?,postcode=?,locality_state_id=?,latitude=?,longitude=?,point=?,boundary=?,geo_source_code=?,geo_accuracy_code=?,'
											+ 'title=?,description=?,booking_note=?,allocated_hours=?,status_code=?,due=?,order_source_code=?,changed=?,exist_any_changed=?,is_task=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.Job[i].id, ((result.Job[i].local_id != undefined) && (result.Job[i].local_id != null)) ? result.Job[i].local_id : '',
											((result.Job[i].company_id != undefined) && (result.Job[i].company_id != null)) ? result.Job[i].company_id : 0, ((result.Job[i].client_id != undefined) && (result.Job[i].client_id != null)) ? result.Job[i].client_id : 0, ((result.Job[i].job_priority_code != undefined) && (result.Job[i].job_priority_code != null)) ? result.Job[i].job_priority_code : 0,
											((result.Job[i].job_status_code != undefined) && (result.Job[i].job_status_code != null)) ? result.Job[i].job_status_code : 0, ((result.Job[i].scheduled_from != undefined) && (result.Job[i].scheduled_from != null)) ? result.Job[i].scheduled_from : null, ((result.Job[i].scheduled_to != undefined) && (result.Job[i].scheduled_to != null)) ? result.Job[i].scheduled_to : null,
											((result.Job[i].reference_number != undefined) && (result.Job[i].reference_number != null)) ? result.Job[i].reference_number : 0, ((result.Job[i].order_reference != undefined) && (result.Job[i].order_reference != null)) ? result.Job[i].order_reference : '', ((result.Job[i].sp != undefined) && (result.Job[i].sp != null)) ? result.Job[i].sp : '',
											((result.Job[i].sub_number != undefined) && (result.Job[i].sub_number != null)) ? result.Job[i].sub_number : '', ((result.Job[i].unit_number != undefined) && (result.Job[i].unit_number != null)) ? result.Job[i].unit_number : '', ((result.Job[i].street_number != undefined) && (result.Job[i].street_number != null)) ? result.Job[i].street_number : '',
											((result.Job[i].street != undefined) && (result.Job[i].street != null)) ? result.Job[i].street : '', ((result.Job[i].locality_street_type_id != undefined) && (result.Job[i].locality_street_type_id != null)) ? result.Job[i].locality_street_type_id : 0, ((result.Job[i].street_type != undefined) && (result.Job[i].street_type != null)) ? result.Job[i].street_type : '',
											((result.Job[i].locality_suburb_id != undefined) && (result.Job[i].locality_suburb_id != null)) ? result.Job[i].locality_suburb_id : 0, ((result.Job[i].suburb != undefined) && (result.Job[i].suburb != null)) ? result.Job[i].suburb : '', ((result.Job[i].postcode != undefined) && (result.Job[i].postcode != null)) ? result.Job[i].postcode : '',
											((result.Job[i].locality_state_id != undefined) && (result.Job[i].locality_state_id != null)) ? result.Job[i].locality_state_id : 0, ((result.Job[i].latitude != undefined) && (result.Job[i].latitude != null)) ? result.Job[i].latitude : 0, ((result.Job[i].longitude != undefined) && (result.Job[i].longitude != null)) ? result.Job[i].longitude : 0,
											((result.Job[i].point != undefined) && (result.Job[i].point != null)) ? result.Job[i].point : '', ((result.Job[i].boundary != undefined) && (result.Job[i].boundary != null)) ? result.Job[i].boundary : '', ((result.Job[i].geo_source_code != undefined) && (result.Job[i].geo_source_code != null)) ? result.Job[i].geo_source_code : 0,
											((result.Job[i].geo_accuracy_code != undefined) && (result.Job[i].geo_accuracy_code != null)) ? result.Job[i].geo_accuracy_code : 0, ((result.Job[i].title != undefined) && (result.Job[i].title != null)) ? result.Job[i].title : '', ((result.Job[i].description != undefined) && (result.Job[i].description != null)) ? result.Job[i].description : '',
											((result.Job[i].booking_note != undefined) && (result.Job[i].booking_note != null)) ? result.Job[i].booking_note : '', ((result.Job[i].allocated_hours != undefined) && (result.Job[i].allocated_hours != null)) ? result.Job[i].allocated_hours : 0, ((result.Job[i].status_code != undefined) && (result.Job[i].status_code != null)) ? result.Job[i].status_code : 0,
											((result.Job[i].due != undefined) && (result.Job[i].due != null)) ? result.Job[i].due : '', ((result.Job[i].order_source_code != undefined) && (result.Job[i].order_source_code != null)) ? result.Job[i].order_source_code : 0, 0, 0, ((result.Job[i].is_task != undefined) && (result.Job[i].is_task != null)) ? result.Job[i].is_task : 0,
											((result.Job[i].created != undefined) && (result.Job[i].created != null)) ? result.Job[i].created : '', ((result.Job[i].created_by != undefined) && (result.Job[i].created_by != null)) ? result.Job[i].created_by : 0, ((result.Job[i].modified_by != undefined) && (result.Job[i].modified_by != null)) ? result.Job[i].modified_by : '',
											((result.Job[i].modified != undefined) && (result.Job[i].modified != null)) ? result.Job[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job (id,local_id,company_id,client_id,job_priority_code,job_status_code,scheduled_from,' + 'scheduled_to,reference_number,order_reference,sp,sub_number,unit_number,street_number,street,locality_street_type_id,street_type,' + 'locality_suburb_id,suburb,postcode,locality_state_id,latitude,longitude,point,boundary,geo_source_code,geo_accuracy_code,'
										+ 'title,description,booking_note,allocated_hours,status_code,due,order_source_code,changed,exist_any_changed,is_task,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.Job[i].id != undefined) && (result.Job[i].id != null)) ? result.Job[i].id : 0,
										((result.Job[i].local_id != undefined) && (result.Job[i].local_id != null)) ? result.Job[i].local_id : '', ((result.Job[i].company_id != undefined) && (result.Job[i].company_id != null)) ? result.Job[i].company_id : 0, ((result.Job[i].client_id != undefined) && (result.Job[i].client_id != null)) ? result.Job[i].client_id : 0,
										((result.Job[i].job_priority_code != undefined) && (result.Job[i].job_priority_code != null)) ? result.Job[i].job_priority_code : 0, ((result.Job[i].job_status_code != undefined) && (result.Job[i].job_status_code != null)) ? result.Job[i].job_status_code : 0, ((result.Job[i].scheduled_from != undefined) && (result.Job[i].scheduled_from != null)) ? result.Job[i].scheduled_from : null,
										((result.Job[i].scheduled_to != undefined) && (result.Job[i].scheduled_to != null)) ? result.Job[i].scheduled_to : null, ((result.Job[i].reference_number != undefined) && (result.Job[i].reference_number != null)) ? result.Job[i].reference_number : 0, ((result.Job[i].order_reference != undefined) && (result.Job[i].order_reference != null)) ? result.Job[i].order_reference : '',
										((result.Job[i].sp != undefined) && (result.Job[i].sp != null)) ? result.Job[i].sp : '', ((result.Job[i].sub_number != undefined) && (result.Job[i].sub_number != null)) ? result.Job[i].sub_number : '', ((result.Job[i].unit_number != undefined) && (result.Job[i].unit_number != null)) ? result.Job[i].unit_number : '',
										((result.Job[i].street_number != undefined) && (result.Job[i].street_number != null)) ? result.Job[i].street_number : '', ((result.Job[i].street != undefined) && (result.Job[i].street != null)) ? result.Job[i].street : '', ((result.Job[i].locality_street_type_id != undefined) && (result.Job[i].locality_street_type_id != null)) ? result.Job[i].locality_street_type_id : 0,
										((result.Job[i].street_type != undefined) && (result.Job[i].street_type != null)) ? result.Job[i].street_type : '', ((result.Job[i].locality_suburb_id != undefined) && (result.Job[i].locality_suburb_id != null)) ? result.Job[i].locality_suburb_id : 0, ((result.Job[i].suburb != undefined) && (result.Job[i].suburb != null)) ? result.Job[i].suburb : '',
										((result.Job[i].postcode != undefined) && (result.Job[i].postcode != null)) ? result.Job[i].postcode : '', ((result.Job[i].locality_state_id != undefined) && (result.Job[i].locality_state_id != null)) ? result.Job[i].locality_state_id : 0, ((result.Job[i].latitude != undefined) && (result.Job[i].latitude != null)) ? result.Job[i].latitude : 0,
										((result.Job[i].longitude != undefined) && (result.Job[i].longitude != null)) ? result.Job[i].longitude : 0, ((result.Job[i].point != undefined) && (result.Job[i].point != null)) ? result.Job[i].point : '', ((result.Job[i].boundary != undefined) && (result.Job[i].boundary != null)) ? result.Job[i].boundary : '',
										((result.Job[i].geo_source_code != undefined) && (result.Job[i].geo_source_code != null)) ? result.Job[i].geo_source_code : 0, ((result.Job[i].geo_accuracy_code != undefined) && (result.Job[i].geo_accuracy_code != null)) ? result.Job[i].geo_accuracy_code : 0, ((result.Job[i].title != undefined) && (result.Job[i].title != null)) ? result.Job[i].title : '',
										((result.Job[i].description != undefined) && (result.Job[i].description != null)) ? result.Job[i].description : '', ((result.Job[i].booking_note != undefined) && (result.Job[i].booking_note != null)) ? result.Job[i].booking_note : '', ((result.Job[i].allocated_hours != undefined) && (result.Job[i].allocated_hours != null)) ? result.Job[i].allocated_hours : 0,
										((result.Job[i].status_code != undefined) && (result.Job[i].status_code != null)) ? result.Job[i].status_code : 0, ((result.Job[i].due != undefined) && (result.Job[i].due != null)) ? result.Job[i].due : '', ((result.Job[i].order_source_code != undefined) && (result.Job[i].order_source_code != null)) ? result.Job[i].order_source_code : 0, 0, 0,
										((result.Job[i].is_task != undefined) && (result.Job[i].is_task != null)) ? result.Job[i].is_task : 0, ((result.Job[i].created != undefined) && (result.Job[i].created != null)) ? result.Job[i].created : '', ((result.Job[i].created_by != undefined) && (result.Job[i].created_by != null)) ? result.Job[i].created_by : 0,
										((result.Job[i].modified_by != undefined) && (result.Job[i].modified_by != null)) ? result.Job[i].modified_by : '', ((result.Job[i].modified != undefined) && (result.Job[i].modified != null)) ? result.Job[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_table');
			return;
		}
	},
	update_my_job_asset_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobAsset === undefined) || (result.JobAsset === null) || (result.JobAsset.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobAsset.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_asset WHERE id=' + result.JobAsset[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobAsset[i].created === temp_created) && ((result.JobAsset[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_asset SET local_id=?,job_id=?,job_asset_type_code=?,name=?,description=?,path=?,path_original=?,' + 'mime_type=?,height=?,width=?,file_size=?,status_code=?,is_local_record=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobAsset[i].id, ((result.JobAsset[i].local_id != undefined) && (result.JobAsset[i].local_id != null)) ? result.JobAsset[i].local_id : '',
											((result.JobAsset[i].job_id != undefined) && (result.JobAsset[i].job_id != null)) ? result.JobAsset[i].job_id : 0, ((result.JobAsset[i].job_asset_type_code != undefined) && (result.JobAsset[i].job_asset_type_code != null)) ? result.JobAsset[i].job_asset_type_code : 0, ((result.JobAsset[i].name != undefined) && (result.JobAsset[i].name != null)) ? result.JobAsset[i].name : '',
											((result.JobAsset[i].description != undefined) && (result.JobAsset[i].description != null)) ? result.JobAsset[i].description : '', ((result.JobAsset[i].path != undefined) && (result.JobAsset[i].path != null)) ? result.JobAsset[i].path : '', ((result.JobAsset[i].path_original != undefined) && (result.JobAsset[i].path_original != null)) ? result.JobAsset[i].path_original : '',
											((result.JobAsset[i].mime_type != undefined) && (result.JobAsset[i].mime_type != null)) ? result.JobAsset[i].mime_type : '', ((result.JobAsset[i].height != undefined) && (result.JobAsset[i].height != null)) ? result.JobAsset[i].height : 0, ((result.JobAsset[i].width != undefined) && (result.JobAsset[i].width != null)) ? result.JobAsset[i].width : 0,
											((result.JobAsset[i].file_size != undefined) && (result.JobAsset[i].file_size != null)) ? result.JobAsset[i].file_size : 0, ((result.JobAsset[i].status_code != undefined) && (result.JobAsset[i].status_code != null)) ? result.JobAsset[i].status_code : 0, 0, 0, ((result.JobAsset[i].created != undefined) && (result.JobAsset[i].created != null)) ? result.JobAsset[i].created : '',
											((result.JobAsset[i].created_by != undefined) && (result.JobAsset[i].created_by != null)) ? result.JobAsset[i].created_by : 0, ((result.JobAsset[i].modified_by != undefined) && (result.JobAsset[i].modified_by != null)) ? result.JobAsset[i].modified_by : 0, ((result.JobAsset[i].modified != undefined) && (result.JobAsset[i].modified != null)) ? result.JobAsset[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_asset (id,local_id,job_id,job_asset_type_code,name,description,' + 'path,path_original,mime_type,height,width,file_size,status_code,is_local_record,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobAsset[i].id != undefined) && (result.JobAsset[i].id != null)) ? result.JobAsset[i].id : 0,
										((result.JobAsset[i].local_id != undefined) && (result.JobAsset[i].local_id != null)) ? result.JobAsset[i].local_id : '', ((result.JobAsset[i].job_id != undefined) && (result.JobAsset[i].job_id != null)) ? result.JobAsset[i].job_id : 0, ((result.JobAsset[i].job_asset_type_code != undefined) && (result.JobAsset[i].job_asset_type_code != null)) ? result.JobAsset[i].job_asset_type_code : 0,
										((result.JobAsset[i].name != undefined) && (result.JobAsset[i].name != null)) ? result.JobAsset[i].name : '', ((result.JobAsset[i].description != undefined) && (result.JobAsset[i].description != null)) ? result.JobAsset[i].description : '', ((result.JobAsset[i].path != undefined) && (result.JobAsset[i].path != null)) ? result.JobAsset[i].path : '',
										((result.JobAsset[i].path_original != undefined) && (result.JobAsset[i].path_original != null)) ? result.JobAsset[i].path_original : '', ((result.JobAsset[i].mime_type != undefined) && (result.JobAsset[i].mime_type != null)) ? result.JobAsset[i].mime_type : '', ((result.JobAsset[i].height != undefined) && (result.JobAsset[i].height != null)) ? result.JobAsset[i].height : 0,
										((result.JobAsset[i].width != undefined) && (result.JobAsset[i].width != null)) ? result.JobAsset[i].width : 0, ((result.JobAsset[i].file_size != undefined) && (result.JobAsset[i].file_size != null)) ? result.JobAsset[i].file_size : 0, ((result.JobAsset[i].status_code != undefined) && (result.JobAsset[i].status_code != null)) ? result.JobAsset[i].status_code : 0, 0, 0,
										((result.JobAsset[i].created != undefined) && (result.JobAsset[i].created != null)) ? result.JobAsset[i].created : '', ((result.JobAsset[i].created_by != undefined) && (result.JobAsset[i].created_by != null)) ? result.JobAsset[i].created_by : 0, ((result.JobAsset[i].modified_by != undefined) && (result.JobAsset[i].modified_by != null)) ? result.JobAsset[i].modified_by : 0,
										((result.JobAsset[i].modified != undefined) && (result.JobAsset[i].modified != null)) ? result.JobAsset[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_asset_table');
			return;
		}
	},
	update_my_job_assigned_user_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobAssignedUser === undefined) || (result.JobAssignedUser === null) || (result.JobAssignedUser.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobAssignedUser.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_assigned_user WHERE id=' + result.JobAssignedUser[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobAssignedUser[i].created === temp_created) && ((result.JobAssignedUser[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_assigned_user SET local_id=?,job_id=?,manager_user_id=?,job_assigned_user_code=?,' + 'assigned_from=?,assigned_to=?,status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobAssignedUser[i].id, ((result.JobAssignedUser[i].local_id != undefined) && (result.JobAssignedUser[i].local_id != null)) ? result.JobAssignedUser[i].local_id : '',
											((result.JobAssignedUser[i].job_id != undefined) && (result.JobAssignedUser[i].job_id != null)) ? result.JobAssignedUser[i].job_id : 0, ((result.JobAssignedUser[i].manager_user_id != undefined) && (result.JobAssignedUser[i].manager_user_id != null)) ? result.JobAssignedUser[i].manager_user_id : 0,
											((result.JobAssignedUser[i].job_assigned_user_code != undefined) && (result.JobAssignedUser[i].job_assigned_user_code != null)) ? result.JobAssignedUser[i].job_assigned_user_code : 0, ((result.JobAssignedUser[i].assigned_from != undefined) && (result.JobAssignedUser[i].assigned_from != null)) ? result.JobAssignedUser[i].assigned_from : null,
											((result.JobAssignedUser[i].assigned_to != undefined) && (result.JobAssignedUser[i].assigned_to != null)) ? result.JobAssignedUser[i].assigned_to : null, ((result.JobAssignedUser[i].status_code != undefined) && (result.JobAssignedUser[i].status_code != null)) ? result.JobAssignedUser[i].status_code : 0, 0,
											((result.JobAssignedUser[i].created != undefined) && (result.JobAssignedUser[i].created != null)) ? result.JobAssignedUser[i].created : '', ((result.JobAssignedUser[i].created_by != undefined) && (result.JobAssignedUser[i].created_by != null)) ? result.JobAssignedUser[i].created_by : 0,
											((result.JobAssignedUser[i].modified_by != undefined) && (result.JobAssignedUser[i].modified_by != null)) ? result.JobAssignedUser[i].modified_by : 0, ((result.JobAssignedUser[i].modified != undefined) && (result.JobAssignedUser[i].modified != null)) ? result.JobAssignedUser[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_assigned_user (id,local_id,job_id,manager_user_id,job_assigned_user_code,' + 'assigned_from,assigned_to,status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobAssignedUser[i].id != undefined) && (result.JobAssignedUser[i].id != null)) ? result.JobAssignedUser[i].id : 0,
										((result.JobAssignedUser[i].local_id != undefined) && (result.JobAssignedUser[i].local_id != null)) ? result.JobAssignedUser[i].local_id : '', ((result.JobAssignedUser[i].job_id != undefined) && (result.JobAssignedUser[i].job_id != null)) ? result.JobAssignedUser[i].job_id : 0,
										((result.JobAssignedUser[i].manager_user_id != undefined) && (result.JobAssignedUser[i].manager_user_id != null)) ? result.JobAssignedUser[i].manager_user_id : 0, ((result.JobAssignedUser[i].job_assigned_user_code != undefined) && (result.JobAssignedUser[i].job_assigned_user_code != null)) ? result.JobAssignedUser[i].job_assigned_user_code : 0,
										((result.JobAssignedUser[i].assigned_from != undefined) && (result.JobAssignedUser[i].assigned_from != null)) ? result.JobAssignedUser[i].assigned_from : null, ((result.JobAssignedUser[i].assigned_to != undefined) && (result.JobAssignedUser[i].assigned_to != null)) ? result.JobAssignedUser[i].assigned_to : null,
										((result.JobAssignedUser[i].status_code != undefined) && (result.JobAssignedUser[i].status_code != null)) ? result.JobAssignedUser[i].status_code : 0, 0, ((result.JobAssignedUser[i].created != undefined) && (result.JobAssignedUser[i].created != null)) ? result.JobAssignedUser[i].created : '',
										((result.JobAssignedUser[i].created_by != undefined) && (result.JobAssignedUser[i].created_by != null)) ? result.JobAssignedUser[i].created_by : 0, ((result.JobAssignedUser[i].modified_by != undefined) && (result.JobAssignedUser[i].modified_by != null)) ? result.JobAssignedUser[i].modified_by : 0,
										((result.JobAssignedUser[i].modified != undefined) && (result.JobAssignedUser[i].modified != null)) ? result.JobAssignedUser[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_assigned_user_table');
			return;
		}
	},
	update_my_job_client_contact_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobClientContact === undefined) || (result.JobClientContact === null) || (result.JobClientContact.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobClientContact.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_client_contact WHERE id=' + result.JobClientContact[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobClientContact[i].created === temp_created) && ((result.JobClientContact[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_client_contact SET local_id=?,job_id=?,client_contact_id=?,note=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? ' + 'WHERE id=' + result.JobClientContact[i].id, ((result.JobClientContact[i].local_id != undefined) && (result.JobClientContact[i].local_id != null)) ? result.JobClientContact[i].local_id : '',
											((result.JobClientContact[i].job_id != undefined) && (result.JobClientContact[i].job_id != null)) ? result.JobClientContact[i].job_id : 0, ((result.JobClientContact[i].client_contact_id != undefined) && (result.JobClientContact[i].client_contact_id != null)) ? result.JobClientContact[i].client_contact_id : 0,
											((result.JobClientContact[i].note != undefined) && (result.JobClientContact[i].note != null)) ? result.JobClientContact[i].note : '', ((result.JobClientContact[i].status_code != undefined) && (result.JobClientContact[i].status_code != null)) ? result.JobClientContact[i].status_code : 0, 0,
											((result.JobClientContact[i].created != undefined) && (result.JobClientContact[i].created != null)) ? result.JobClientContact[i].created : '', ((result.JobClientContact[i].created_by != undefined) && (result.JobClientContact[i].created_by != null)) ? result.JobClientContact[i].created_by : 0,
											((result.JobClientContact[i].modified_by != undefined) && (result.JobClientContact[i].modified_by != null)) ? result.JobClientContact[i].modified_by : 0, ((result.JobClientContact[i].modified != undefined) && (result.JobClientContact[i].modified != null)) ? result.JobClientContact[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_client_contact (id,local_id,job_id,client_contact_id,note,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?)', ((result.JobClientContact[i].id != undefined) && (result.JobClientContact[i].id != null)) ? result.JobClientContact[i].id : 0,
										((result.JobClientContact[i].local_id != undefined) && (result.JobClientContact[i].local_id != null)) ? result.JobClientContact[i].local_id : '', ((result.JobClientContact[i].job_id != undefined) && (result.JobClientContact[i].job_id != null)) ? result.JobClientContact[i].job_id : 0,
										((result.JobClientContact[i].client_contact_id != undefined) && (result.JobClientContact[i].client_contact_id != null)) ? result.JobClientContact[i].client_contact_id : 0, ((result.JobClientContact[i].note != undefined) && (result.JobClientContact[i].note != null)) ? result.JobClientContact[i].note : '',
										((result.JobClientContact[i].status_code != undefined) && (result.JobClientContact[i].status_code != null)) ? result.JobClientContact[i].status_code : 0, 0, ((result.JobClientContact[i].created != undefined) && (result.JobClientContact[i].created != null)) ? result.JobClientContact[i].created : '',
										((result.JobClientContact[i].created_by != undefined) && (result.JobClientContact[i].created_by != null)) ? result.JobClientContact[i].created_by : 0, ((result.JobClientContact[i].modified_by != undefined) && (result.JobClientContact[i].modified_by != null)) ? result.JobClientContact[i].modified_by : 0,
										((result.JobClientContact[i].modified != undefined) && (result.JobClientContact[i].modified != null)) ? result.JobClientContact[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_client_contact_table');
			return;
		}
	},
	update_my_job_site_contact_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobSiteContact === undefined) || (result.JobSiteContact === null) || (result.JobSiteContact.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobSiteContact.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_site_contact WHERE id=' + result.JobSiteContact[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobSiteContact[i].created === temp_created) && ((result.JobSiteContact[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_site_contact SET local_id=?,job_id=?,salutation_code=?,display_name=?,first_name=?,last_name=?,phone_mobile=?,phone=?,phone_work=?,email=?,note=?,is_primary_contact=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? ' + 'WHERE id=' + result.JobSiteContact[i].id,
											((result.JobSiteContact[i].local_id != undefined) && (result.JobSiteContact[i].local_id != null)) ? result.JobSiteContact[i].local_id : '', ((result.JobSiteContact[i].job_id != undefined) && (result.JobSiteContact[i].job_id != null)) ? result.JobSiteContact[i].job_id : 0,
											((result.JobSiteContact[i].salutation_code != undefined) && (result.JobSiteContact[i].salutation_code != null)) ? result.JobSiteContact[i].salutation_code : 0, ((result.JobSiteContact[i].display_name != undefined) && (result.JobSiteContact[i].display_name != null)) ? result.JobSiteContact[i].display_name : '',
											((result.JobSiteContact[i].first_name != undefined) && (result.JobSiteContact[i].first_name != null)) ? result.JobSiteContact[i].first_name : '', ((result.JobSiteContact[i].last_name != undefined) && (result.JobSiteContact[i].last_name != null)) ? result.JobSiteContact[i].last_name : '',
											((result.JobSiteContact[i].phone_mobile != undefined) && (result.JobSiteContact[i].phone_mobile != null)) ? result.JobSiteContact[i].phone_mobile : '', ((result.JobSiteContact[i].phone != undefined) && (result.JobSiteContact[i].phone != null)) ? result.JobSiteContact[i].phone : '',
											((result.JobSiteContact[i].phone_work != undefined) && (result.JobSiteContact[i].phone_work != null)) ? result.JobSiteContact[i].phone_work : '', ((result.JobSiteContact[i].email != undefined) && (result.JobSiteContact[i].email != null)) ? result.JobSiteContact[i].email : '', ((result.JobSiteContact[i].note != undefined) && (result.JobSiteContact[i].note != null)) ? result.JobSiteContact[i].note : '',
											((result.JobSiteContact[i].is_primary_contact != undefined) && (result.JobSiteContact[i].is_primary_contact != null)) ? result.JobSiteContact[i].is_primary_contact : 0, ((result.JobSiteContact[i].status_code != undefined) && (result.JobSiteContact[i].status_code != null)) ? result.JobSiteContact[i].status_code : 0, 0,
											((result.JobSiteContact[i].created != undefined) && (result.JobSiteContact[i].created != null)) ? result.JobSiteContact[i].created : '', ((result.JobSiteContact[i].created_by != undefined) && (result.JobSiteContact[i].created_by != null)) ? result.JobSiteContact[i].created_by : 0,
											((result.JobSiteContact[i].modified_by != undefined) && (result.JobSiteContact[i].modified_by != null)) ? result.JobSiteContact[i].modified_by : 0, ((result.JobSiteContact[i].modified != undefined) && (result.JobSiteContact[i].modified != null)) ? result.JobSiteContact[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_site_contact (id,local_id,job_id,salutation_code,display_name,first_name,last_name,phone_mobile,phone,phone_work,email,note,' + 'is_primary_contact,status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobSiteContact[i].id != undefined) && (result.JobSiteContact[i].id != null)) ? result.JobSiteContact[i].id : 0,
										((result.JobSiteContact[i].local_id != undefined) && (result.JobSiteContact[i].local_id != null)) ? result.JobSiteContact[i].local_id : '', ((result.JobSiteContact[i].job_id != undefined) && (result.JobSiteContact[i].job_id != null)) ? result.JobSiteContact[i].job_id : 0,
										((result.JobSiteContact[i].salutation_code != undefined) && (result.JobSiteContact[i].salutation_code != null)) ? result.JobSiteContact[i].salutation_code : 0, ((result.JobSiteContact[i].display_name != undefined) && (result.JobSiteContact[i].display_name != null)) ? result.JobSiteContact[i].display_name : '',
										((result.JobSiteContact[i].first_name != undefined) && (result.JobSiteContact[i].first_name != null)) ? result.JobSiteContact[i].first_name : '', ((result.JobSiteContact[i].last_name != undefined) && (result.JobSiteContact[i].last_name != null)) ? result.JobSiteContact[i].last_name : '',
										((result.JobSiteContact[i].phone_mobile != undefined) && (result.JobSiteContact[i].phone_mobile != null)) ? result.JobSiteContact[i].phone_mobile : '', ((result.JobSiteContact[i].phone != undefined) && (result.JobSiteContact[i].phone != null)) ? result.JobSiteContact[i].phone : '',
										((result.JobSiteContact[i].phone_work != undefined) && (result.JobSiteContact[i].phone_work != null)) ? result.JobSiteContact[i].phone_work : '', ((result.JobSiteContact[i].email != undefined) && (result.JobSiteContact[i].email != null)) ? result.JobSiteContact[i].email : '', ((result.JobSiteContact[i].note != undefined) && (result.JobSiteContact[i].note != null)) ? result.JobSiteContact[i].note : '',
										((result.JobSiteContact[i].is_primary_contact != undefined) && (result.JobSiteContact[i].is_primary_contact != null)) ? result.JobSiteContact[i].is_primary_contact : 0, ((result.JobSiteContact[i].status_code != undefined) && (result.JobSiteContact[i].status_code != null)) ? result.JobSiteContact[i].status_code : 0, 0,
										((result.JobSiteContact[i].created != undefined) && (result.JobSiteContact[i].created != null)) ? result.JobSiteContact[i].created : '', ((result.JobSiteContact[i].created_by != undefined) && (result.JobSiteContact[i].created_by != null)) ? result.JobSiteContact[i].created_by : 0,
										((result.JobSiteContact[i].modified_by != undefined) && (result.JobSiteContact[i].modified_by != null)) ? result.JobSiteContact[i].modified_by : 0, ((result.JobSiteContact[i].modified != undefined) && (result.JobSiteContact[i].modified != null)) ? result.JobSiteContact[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_site_contact_table');
			return;
		}
	},
	update_my_job_contact_history_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobContactHistory === undefined) || (result.JobContactHistory === null) || (result.JobContactHistory.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobContactHistory.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_contact_history WHERE id=' + result.JobContactHistory[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobContactHistory[i].created === temp_created) && ((result.JobContactHistory[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_contact_history SET local_id=?,job_id=?,manager_user_id=?,contact_type_code=?,description=?,' + 'contacted=?,status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobContactHistory[i].id, ((result.JobContactHistory[i].local_id != undefined) && (result.JobContactHistory[i].local_id != null)) ? result.JobContactHistory[i].local_id : '',
											((result.JobContactHistory[i].job_id != undefined) && (result.JobContactHistory[i].job_id != null)) ? result.JobContactHistory[i].job_id : 0, ((result.JobContactHistory[i].manager_user_id != undefined) && (result.JobContactHistory[i].manager_user_id != null)) ? result.JobContactHistory[i].manager_user_id : 0,
											((result.JobContactHistory[i].contact_type_code != undefined) && (result.JobContactHistory[i].contact_type_code != null)) ? result.JobContactHistory[i].contact_type_code : 0, ((result.JobContactHistory[i].description != undefined) && (result.JobContactHistory[i].description != null)) ? result.JobContactHistory[i].description : '',
											((result.JobContactHistory[i].contacted != undefined) && (result.JobContactHistory[i].contacted != null)) ? result.JobContactHistory[i].contacted : '', ((result.JobContactHistory[i].status_code != undefined) && (result.JobContactHistory[i].status_code != null)) ? result.JobContactHistory[i].status_code : 0, 0,
											((result.JobContactHistory[i].created != undefined) && (result.JobContactHistory[i].created != null)) ? result.JobContactHistory[i].created : '', ((result.JobContactHistory[i].created_by != undefined) && (result.JobContactHistory[i].created_by != null)) ? result.JobContactHistory[i].created_by : 0,
											((result.JobContactHistory[i].modified_by != undefined) && (result.JobContactHistory[i].modified_by != null)) ? result.JobContactHistory[i].modified_by : 0, ((result.JobContactHistory[i].modified != undefined) && (result.JobContactHistory[i].modified != null)) ? result.JobContactHistory[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_contact_history (id,local_id,job_id,manager_user_id,contact_type_code,description,' + 'contacted,status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobContactHistory[i].id != undefined) && (result.JobContactHistory[i].id != null)) ? result.JobContactHistory[i].id : 0,
										((result.JobContactHistory[i].local_id != undefined) && (result.JobContactHistory[i].local_id != null)) ? result.JobContactHistory[i].local_id : '', ((result.JobContactHistory[i].job_id != undefined) && (result.JobContactHistory[i].job_id != null)) ? result.JobContactHistory[i].job_id : 0,
										((result.JobContactHistory[i].manager_user_id != undefined) && (result.JobContactHistory[i].manager_user_id != null)) ? result.JobContactHistory[i].manager_user_id : 0, ((result.JobContactHistory[i].contact_type_code != undefined) && (result.JobContactHistory[i].contact_type_code != null)) ? result.JobContactHistory[i].contact_type_code : 0,
										((result.JobContactHistory[i].description != undefined) && (result.JobContactHistory[i].description != null)) ? result.JobContactHistory[i].description : '', ((result.JobContactHistory[i].contacted != undefined) && (result.JobContactHistory[i].contacted != null)) ? result.JobContactHistory[i].contacted : '',
										((result.JobContactHistory[i].status_code != undefined) && (result.JobContactHistory[i].status_code != null)) ? result.JobContactHistory[i].status_code : 0, 0, ((result.JobContactHistory[i].created != undefined) && (result.JobContactHistory[i].created != null)) ? result.JobContactHistory[i].created : '',
										((result.JobContactHistory[i].created_by != undefined) && (result.JobContactHistory[i].created_by != null)) ? result.JobContactHistory[i].created_by : 0, ((result.JobContactHistory[i].modified_by != undefined) && (result.JobContactHistory[i].modified_by != null)) ? result.JobContactHistory[i].modified_by : 0,
										((result.JobContactHistory[i].modified != undefined) && (result.JobContactHistory[i].modified != null)) ? result.JobContactHistory[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_contact_history_table');
			return;
		}
	},
	update_my_job_contact_history_recipient_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobContactHistoryRecipient === undefined) || (result.JobContactHistoryRecipient === null) || (result.JobContactHistoryRecipient.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobContactHistoryRecipient.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_contact_history_recipient WHERE id=' + result.JobContactHistoryRecipient[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobContactHistoryRecipient[i].created === temp_created) && ((result.JobContactHistoryRecipient[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_contact_history_recipient SET job_contact_history_id=?,contact_message_id=?,model=?,pk_id=?,contact=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobContactHistoryRecipient[i].id,
											((result.JobContactHistoryRecipient[i].job_contact_history_id != undefined) && (result.JobContactHistoryRecipient[i].job_contact_history_id != null)) ? result.JobContactHistoryRecipient[i].job_contact_history_id : 0,
											((result.JobContactHistoryRecipient[i].contact_message_id != undefined) && (result.JobContactHistoryRecipient[i].contact_message_id != null)) ? result.JobContactHistoryRecipient[i].contact_message_id : 0, ((result.JobContactHistoryRecipient[i].model != undefined) && (result.JobContactHistoryRecipient[i].model != null)) ? result.JobContactHistoryRecipient[i].model : '',
											((result.JobContactHistoryRecipient[i].pk_id != undefined) && (result.JobContactHistoryRecipient[i].pk_id != null)) ? result.JobContactHistoryRecipient[i].pk_id : 0, ((result.JobContactHistoryRecipient[i].contact != undefined) && (result.JobContactHistoryRecipient[i].contact != null)) ? result.JobContactHistoryRecipient[i].contact : '',
											((result.JobContactHistoryRecipient[i].status_code != undefined) && (result.JobContactHistoryRecipient[i].status_code != null)) ? result.JobContactHistoryRecipient[i].status_code : 0, 0, ((result.JobContactHistoryRecipient[i].created != undefined) && (result.JobContactHistoryRecipient[i].created != null)) ? result.JobContactHistoryRecipient[i].created : '',
											((result.JobContactHistoryRecipient[i].created_by != undefined) && (result.JobContactHistoryRecipient[i].created_by != null)) ? result.JobContactHistoryRecipient[i].created_by : 0, ((result.JobContactHistoryRecipient[i].modified_by != undefined) && (result.JobContactHistoryRecipient[i].modified_by != null)) ? result.JobContactHistoryRecipient[i].modified_by : 0,
											((result.JobContactHistoryRecipient[i].modified != undefined) && (result.JobContactHistoryRecipient[i].modified != null)) ? result.JobContactHistoryRecipient[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_contact_history_recipient (id,job_contact_history_id,contact_message_id,model,pk_id,contact,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobContactHistoryRecipient[i].id != undefined) && (result.JobContactHistoryRecipient[i].id != null)) ? result.JobContactHistoryRecipient[i].id : 0,
										((result.JobContactHistoryRecipient[i].job_contact_history_id != undefined) && (result.JobContactHistoryRecipient[i].job_contact_history_id != null)) ? result.JobContactHistoryRecipient[i].job_contact_history_id : 0, ((result.JobContactHistoryRecipient[i].contact_message_id != undefined) && (result.JobContactHistoryRecipient[i].contact_message_id != null)) ? result.JobContactHistoryRecipient[i].contact_message_id
														: 0, ((result.JobContactHistoryRecipient[i].model != undefined) && (result.JobContactHistoryRecipient[i].model != null)) ? result.JobContactHistoryRecipient[i].model : '', ((result.JobContactHistoryRecipient[i].pk_id != undefined) && (result.JobContactHistoryRecipient[i].pk_id != null)) ? result.JobContactHistoryRecipient[i].pk_id : 0,
										((result.JobContactHistoryRecipient[i].contact != undefined) && (result.JobContactHistoryRecipient[i].contact != null)) ? result.JobContactHistoryRecipient[i].contact : '', ((result.JobContactHistoryRecipient[i].status_code != undefined) && (result.JobContactHistoryRecipient[i].status_code != null)) ? result.JobContactHistoryRecipient[i].status_code : 0, 0,
										((result.JobContactHistoryRecipient[i].created != undefined) && (result.JobContactHistoryRecipient[i].created != null)) ? result.JobContactHistoryRecipient[i].created : '', ((result.JobContactHistoryRecipient[i].created_by != undefined) && (result.JobContactHistoryRecipient[i].created_by != null)) ? result.JobContactHistoryRecipient[i].created_by : 0,
										((result.JobContactHistoryRecipient[i].modified_by != undefined) && (result.JobContactHistoryRecipient[i].modified_by != null)) ? result.JobContactHistoryRecipient[i].modified_by : 0, ((result.JobContactHistoryRecipient[i].modified != undefined) && (result.JobContactHistoryRecipient[i].modified != null)) ? result.JobContactHistoryRecipient[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_contact_history_recipient_table');
			return;
		}
	},
	update_my_job_note_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobNote === undefined) || (result.JobNote === null) || (result.JobNote.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobNote.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_note WHERE id=' + result.JobNote[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobNote[i].created === temp_created) && ((result.JobNote[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_note SET local_id=?,job_id=?,description=?,job_note_type_code=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobNote[i].id, ((result.JobNote[i].local_id != undefined) && (result.JobNote[i].local_id != null)) ? result.JobNote[i].local_id : '', ((result.JobNote[i].job_id != undefined) && (result.JobNote[i].job_id != null)) ? result.JobNote[i].job_id : 0,
											((result.JobNote[i].description != undefined) && (result.JobNote[i].description != null)) ? result.JobNote[i].description : '', ((result.JobNote[i].job_note_type_code != undefined) && (result.JobNote[i].job_note_type_code != null)) ? result.JobNote[i].job_note_type_code : 0, ((result.JobNote[i].status_code != undefined) && (result.JobNote[i].status_code != null)) ? result.JobNote[i].status_code : 0, 0,
											((result.JobNote[i].created != undefined) && (result.JobNote[i].created != null)) ? result.JobNote[i].created : '', ((result.JobNote[i].created_by != undefined) && (result.JobNote[i].created_by != null)) ? result.JobNote[i].created_by : 0, ((result.JobNote[i].modified_by != undefined) && (result.JobNote[i].modified_by != null)) ? result.JobNote[i].modified_by : 0,
											((result.JobNote[i].modified != undefined) && (result.JobNote[i].modified != null)) ? result.JobNote[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_note (id,local_id,job_id,description,job_note_type_code,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?)', ((result.JobNote[i].id != undefined) && (result.JobNote[i].id != null)) ? result.JobNote[i].id : 0, ((result.JobNote[i].local_id != undefined) && (result.JobNote[i].local_id != null)) ? result.JobNote[i].local_id : '',
										((result.JobNote[i].job_id != undefined) && (result.JobNote[i].job_id != null)) ? result.JobNote[i].job_id : 0, ((result.JobNote[i].description != undefined) && (result.JobNote[i].description != null)) ? result.JobNote[i].description : '', ((result.JobNote[i].job_note_type_code != undefined) && (result.JobNote[i].job_note_type_code != null)) ? result.JobNote[i].job_note_type_code : 0,
										((result.JobNote[i].status_code != undefined) && (result.JobNote[i].status_code != null)) ? result.JobNote[i].status_code : 0, 0, ((result.JobNote[i].created != undefined) && (result.JobNote[i].created != null)) ? result.JobNote[i].created : '', ((result.JobNote[i].created_by != undefined) && (result.JobNote[i].created_by != null)) ? result.JobNote[i].created_by : 0,
										((result.JobNote[i].modified_by != undefined) && (result.JobNote[i].modified_by != null)) ? result.JobNote[i].modified_by : 0, ((result.JobNote[i].modified != undefined) && (result.JobNote[i].modified != null)) ? result.JobNote[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_note_table');
			return;
		}
	},
	update_my_job_operation_log_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobOperationLog === undefined) || (result.JobOperationLog === null) || (result.JobOperationLog.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobOperationLog.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_operation_log WHERE id=' + result.JobOperationLog[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobOperationLog[i].created === temp_created) && ((result.JobOperationLog[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_operation_log SET local_id=?,job_id=?,job_operation_log_type_code=?,manager_user_id=?,description=?,' + 'latitude=?,longitude=?,point=?,geo_source_code=?,geo_accuracy_code=?,' + 'logged=?,status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobOperationLog[i].id,
											((result.JobOperationLog[i].local_id != undefined) && (result.JobOperationLog[i].local_id != null)) ? result.JobOperationLog[i].local_id : '', ((result.JobOperationLog[i].job_id != undefined) && (result.JobOperationLog[i].job_id != null)) ? result.JobOperationLog[i].job_id : 0,
											((result.JobOperationLog[i].job_operation_log_type_code != undefined) && (result.JobOperationLog[i].job_operation_log_type_code != null)) ? result.JobOperationLog[i].job_operation_log_type_code : 0, ((result.JobOperationLog[i].manager_user_id != undefined) && (result.JobOperationLog[i].manager_user_id != null)) ? result.JobOperationLog[i].manager_user_id : 0,
											((result.JobOperationLog[i].description != undefined) && (result.JobOperationLog[i].description != null)) ? result.JobOperationLog[i].description : '', ((result.JobOperationLog[i].latitude != undefined) && (result.JobOperationLog[i].latitude != null)) ? result.JobOperationLog[i].latitude : 0,
											((result.JobOperationLog[i].longitude != undefined) && (result.JobOperationLog[i].longitude != null)) ? result.JobOperationLog[i].longitude : 0, ((result.JobOperationLog[i].point != undefined) && (result.JobOperationLog[i].point != null)) ? result.JobOperationLog[i].point : '',
											((result.JobOperationLog[i].geo_source_code != undefined) && (result.JobOperationLog[i].geo_source_code != null)) ? result.JobOperationLog[i].geo_source_code : 0, ((result.JobOperationLog[i].geo_accuracy_code != undefined) && (result.JobOperationLog[i].geo_accuracy_code != null)) ? result.JobOperationLog[i].geo_accuracy_code : 0,
											((result.JobOperationLog[i].logged != undefined) && (result.JobOperationLog[i].logged != null)) ? result.JobOperationLog[i].logged : '', ((result.JobOperationLog[i].status_code != undefined) && (result.JobOperationLog[i].status_code != null)) ? result.JobOperationLog[i].status_code : 0, 0,
											((result.JobOperationLog[i].created != undefined) && (result.JobOperationLog[i].created != null)) ? result.JobOperationLog[i].created : '', ((result.JobOperationLog[i].created_by != undefined) && (result.JobOperationLog[i].created_by != null)) ? result.JobOperationLog[i].created_by : 0,
											((result.JobOperationLog[i].modified_by != undefined) && (result.JobOperationLog[i].modified_by != null)) ? result.JobOperationLog[i].modified_by : 0, ((result.JobOperationLog[i].modified != undefined) && (result.JobOperationLog[i].modified != null)) ? result.JobOperationLog[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_operation_log (id,local_id,job_id,job_operation_log_type_code,' + 'manager_user_id,description,latitude,longitude,point,geo_source_code,geo_accuracy_code,' + 'logged,status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobOperationLog[i].id != undefined) && (result.JobOperationLog[i].id != null)) ? result.JobOperationLog[i].id : 0,
										((result.JobOperationLog[i].local_id != undefined) && (result.JobOperationLog[i].local_id != null)) ? result.JobOperationLog[i].local_id : '', ((result.JobOperationLog[i].job_id != undefined) && (result.JobOperationLog[i].job_id != null)) ? result.JobOperationLog[i].job_id : 0,
										((result.JobOperationLog[i].job_operation_log_type_code != undefined) && (result.JobOperationLog[i].job_operation_log_type_code != null)) ? result.JobOperationLog[i].job_operation_log_type_code : 0, ((result.JobOperationLog[i].manager_user_id != undefined) && (result.JobOperationLog[i].manager_user_id != null)) ? result.JobOperationLog[i].manager_user_id : 0,
										((result.JobOperationLog[i].description != undefined) && (result.JobOperationLog[i].description != null)) ? result.JobOperationLog[i].description : '', ((result.JobOperationLog[i].latitude != undefined) && (result.JobOperationLog[i].latitude != null)) ? result.JobOperationLog[i].latitude : 0,
										((result.JobOperationLog[i].longitude != undefined) && (result.JobOperationLog[i].longitude != null)) ? result.JobOperationLog[i].longitude : 0, ((result.JobOperationLog[i].point != undefined) && (result.JobOperationLog[i].point != null)) ? result.JobOperationLog[i].point : '',
										((result.JobOperationLog[i].geo_source_code != undefined) && (result.JobOperationLog[i].geo_source_code != null)) ? result.JobOperationLog[i].geo_source_code : 0, ((result.JobOperationLog[i].geo_accuracy_code != undefined) && (result.JobOperationLog[i].geo_accuracy_code != null)) ? result.JobOperationLog[i].geo_accuracy_code : 0,
										((result.JobOperationLog[i].logged != undefined) && (result.JobOperationLog[i].logged != null)) ? result.JobOperationLog[i].logged : '', ((result.JobOperationLog[i].status_code != undefined) && (result.JobOperationLog[i].status_code != null)) ? result.JobOperationLog[i].status_code : 0, 0,
										((result.JobOperationLog[i].created != undefined) && (result.JobOperationLog[i].created != null)) ? result.JobOperationLog[i].created : '', ((result.JobOperationLog[i].created_by != undefined) && (result.JobOperationLog[i].created_by != null)) ? result.JobOperationLog[i].created_by : 0,
										((result.JobOperationLog[i].modified_by != undefined) && (result.JobOperationLog[i].modified_by != null)) ? result.JobOperationLog[i].modified_by : 0, ((result.JobOperationLog[i].modified != undefined) && (result.JobOperationLog[i].modified != null)) ? result.JobOperationLog[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_operation_log_table');
			return;
		}
	},
	update_my_job_library_item_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobLibraryItem === undefined) || (result.JobLibraryItem === null) || (result.JobLibraryItem.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobLibraryItem.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_library_item WHERE id=' + result.JobLibraryItem[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobLibraryItem[i].created === temp_created) && ((result.JobLibraryItem[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_library_item SET company_id=?,reference_number=?,job_library_item_type_code=?,item_name=?,item_abbr=?,' + 'description=?,price=?,inc_gst=?,is_gst_exempt=?,account_external_reference=?,status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobLibraryItem[i].id,
											((result.JobLibraryItem[i].company_id != undefined) && (result.JobLibraryItem[i].company_id != null)) ? result.JobLibraryItem[i].company_id : 0, ((result.JobLibraryItem[i].reference_number != undefined) && (result.JobLibraryItem[i].reference_number != null)) ? result.JobLibraryItem[i].reference_number : 0,
											((result.JobLibraryItem[i].job_library_item_type_code != undefined) && (result.JobLibraryItem[i].job_library_item_type_code != null)) ? result.JobLibraryItem[i].job_library_item_type_code : 0, ((result.JobLibraryItem[i].item_name != undefined) && (result.JobLibraryItem[i].item_name != null)) ? result.JobLibraryItem[i].item_name : '',
											((result.JobLibraryItem[i].item_abbr != undefined) && (result.JobLibraryItem[i].item_abbr != null)) ? result.JobLibraryItem[i].item_abbr : '', ((result.JobLibraryItem[i].description != undefined) && (result.JobLibraryItem[i].description != null)) ? result.JobLibraryItem[i].description : '',
											((result.JobLibraryItem[i].price != undefined) && (result.JobLibraryItem[i].price != null)) ? result.JobLibraryItem[i].price : 0, ((result.JobLibraryItem[i].inc_gst != undefined) && (result.JobLibraryItem[i].inc_gst != null)) ? result.JobLibraryItem[i].inc_gst : 0,
											((result.JobLibraryItem[i].is_gst_exempt != undefined) && (result.JobLibraryItem[i].is_gst_exempt != null)) ? result.JobLibraryItem[i].is_gst_exempt : 0, ((result.JobLibraryItem[i].account_external_reference != undefined) && (result.JobLibraryItem[i].account_external_reference != null)) ? result.JobLibraryItem[i].account_external_reference : '',
											((result.JobLibraryItem[i].status_code != undefined) && (result.JobLibraryItem[i].status_code != null)) ? result.JobLibraryItem[i].status_code : 0, 0, ((result.JobLibraryItem[i].created != undefined) && (result.JobLibraryItem[i].created != null)) ? result.JobLibraryItem[i].created : '',
											((result.JobLibraryItem[i].created_by != undefined) && (result.JobLibraryItem[i].created_by != null)) ? result.JobLibraryItem[i].created_by : 0, ((result.JobLibraryItem[i].modified_by != undefined) && (result.JobLibraryItem[i].modified_by != null)) ? result.JobLibraryItem[i].modified_by : 0,
											((result.JobLibraryItem[i].modified != undefined) && (result.JobLibraryItem[i].modified != null)) ? result.JobLibraryItem[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_library_item (id,company_id,reference_number,job_library_item_type_code,item_name,item_abbr,' + 'description,price,inc_gst,is_gst_exempt,account_external_reference,status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobLibraryItem[i].id != undefined) && (result.JobLibraryItem[i].id != null)) ? result.JobLibraryItem[i].id : 0,
										((result.JobLibraryItem[i].company_id != undefined) && (result.JobLibraryItem[i].company_id != null)) ? result.JobLibraryItem[i].company_id : 0, ((result.JobLibraryItem[i].reference_number != undefined) && (result.JobLibraryItem[i].reference_number != null)) ? result.JobLibraryItem[i].reference_number : 0,
										((result.JobLibraryItem[i].job_library_item_type_code != undefined) && (result.JobLibraryItem[i].job_library_item_type_code != null)) ? result.JobLibraryItem[i].job_library_item_type_code : 0, ((result.JobLibraryItem[i].item_name != undefined) && (result.JobLibraryItem[i].item_name != null)) ? result.JobLibraryItem[i].item_name : '',
										((result.JobLibraryItem[i].item_abbr != undefined) && (result.JobLibraryItem[i].item_abbr != null)) ? result.JobLibraryItem[i].item_abbr : '', ((result.JobLibraryItem[i].description != undefined) && (result.JobLibraryItem[i].description != null)) ? result.JobLibraryItem[i].description : '', ((result.JobLibraryItem[i].price != undefined) && (result.JobLibraryItem[i].price != null)) ? result.JobLibraryItem[i].price
														: 0, ((result.JobLibraryItem[i].inc_gst != undefined) && (result.JobLibraryItem[i].inc_gst != null)) ? result.JobLibraryItem[i].inc_gst : 0, ((result.JobLibraryItem[i].is_gst_exempt != undefined) && (result.JobLibraryItem[i].is_gst_exempt != null)) ? result.JobLibraryItem[i].is_gst_exempt : 0,
										((result.JobLibraryItem[i].account_external_reference != undefined) && (result.JobLibraryItem[i].account_external_reference != null)) ? result.JobLibraryItem[i].account_external_reference : '', ((result.JobLibraryItem[i].status_code != undefined) && (result.JobLibraryItem[i].status_code != null)) ? result.JobLibraryItem[i].status_code : 0, 0,
										((result.JobLibraryItem[i].created != undefined) && (result.JobLibraryItem[i].created != null)) ? result.JobLibraryItem[i].created : '', ((result.JobLibraryItem[i].created_by != undefined) && (result.JobLibraryItem[i].created_by != null)) ? result.JobLibraryItem[i].created_by : 0,
										((result.JobLibraryItem[i].modified_by != undefined) && (result.JobLibraryItem[i].modified_by != null)) ? result.JobLibraryItem[i].modified_by : 0, ((result.JobLibraryItem[i].modified != undefined) && (result.JobLibraryItem[i].modified != null)) ? result.JobLibraryItem[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_library_item_table');
			return;
		}
	},
	update_my_job_assigned_item_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobAssignedItem === undefined) || (result.JobAssignedItem === null) || (result.JobAssignedItem.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobAssignedItem.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_assigned_item WHERE id=' + result.JobAssignedItem[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobAssignedItem[i].created === temp_created) && ((result.JobAssignedItem[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_assigned_item SET local_id=?,job_id=?,job_library_item_id=?,materials_locations_id=?,units=?,item_order=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobAssignedItem[i].id, ((result.JobAssignedItem[i].local_id != undefined) && (result.JobAssignedItem[i].local_id != null)) ? result.JobAssignedItem[i].local_id : '',
											((result.JobAssignedItem[i].job_id != undefined) && (result.JobAssignedItem[i].job_id != null)) ? result.JobAssignedItem[i].job_id : 0, ((result.JobAssignedItem[i].job_library_item_id != undefined) && (result.JobAssignedItem[i].job_library_item_id != null)) ? result.JobAssignedItem[i].job_library_item_id : 0,
											((result.JobAssignedItem[i].materials_locations_id != undefined) && (result.JobAssignedItem[i].materials_locations_id != null)) ? result.JobAssignedItem[i].materials_locations_id : 0, ((result.JobAssignedItem[i].units != undefined) && (result.JobAssignedItem[i].units != null)) ? result.JobAssignedItem[i].units : 0,
											((result.JobAssignedItem[i].item_order != undefined) && (result.JobAssignedItem[i].item_order != null)) ? result.JobAssignedItem[i].item_order : 0, ((result.JobAssignedItem[i].status_code != undefined) && (result.JobAssignedItem[i].status_code != null)) ? result.JobAssignedItem[i].status_code : 0, 0,
											((result.JobAssignedItem[i].created != undefined) && (result.JobAssignedItem[i].created != null)) ? result.JobAssignedItem[i].created : '', ((result.JobAssignedItem[i].created_by != undefined) && (result.JobAssignedItem[i].created_by != null)) ? result.JobAssignedItem[i].created_by : 0,
											((result.JobAssignedItem[i].modified_by != undefined) && (result.JobAssignedItem[i].modified_by != null)) ? result.JobAssignedItem[i].modified_by : 0, ((result.JobAssignedItem[i].modified != undefined) && (result.JobAssignedItem[i].modified != null)) ? result.JobAssignedItem[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_assigned_item (id,local_id,job_id,job_library_item_id,materials_locations_id,units,item_order,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobAssignedItem[i].id != undefined) && (result.JobAssignedItem[i].id != null)) ? result.JobAssignedItem[i].id : '',
										((result.JobAssignedItem[i].local_id != undefined) && (result.JobAssignedItem[i].local_id != null)) ? result.JobAssignedItem[i].local_id : '', ((result.JobAssignedItem[i].job_id != undefined) && (result.JobAssignedItem[i].job_id != null)) ? result.JobAssignedItem[i].job_id : 0,
										((result.JobAssignedItem[i].job_library_item_id != undefined) && (result.JobAssignedItem[i].job_library_item_id != null)) ? result.JobAssignedItem[i].job_library_item_id : 0, ((result.JobAssignedItem[i].materials_locations_id != undefined) && (result.JobAssignedItem[i].materials_locations_id != null)) ? result.JobAssignedItem[i].materials_locations_id : 0,
										((result.JobAssignedItem[i].units != undefined) && (result.JobAssignedItem[i].units != null)) ? result.JobAssignedItem[i].units : 0, ((result.JobAssignedItem[i].item_order != undefined) && (result.JobAssignedItem[i].item_order != null)) ? result.JobAssignedItem[i].item_order : 0,
										((result.JobAssignedItem[i].status_code != undefined) && (result.JobAssignedItem[i].status_code != null)) ? result.JobAssignedItem[i].status_code : 0, 0, ((result.JobAssignedItem[i].created != undefined) && (result.JobAssignedItem[i].created != null)) ? result.JobAssignedItem[i].created : '',
										((result.JobAssignedItem[i].created_by != undefined) && (result.JobAssignedItem[i].created_by != null)) ? result.JobAssignedItem[i].created_by : 0, ((result.JobAssignedItem[i].modified_by != undefined) && (result.JobAssignedItem[i].modified_by != null)) ? result.JobAssignedItem[i].modified_by : 0,
										((result.JobAssignedItem[i].modified != undefined) && (result.JobAssignedItem[i].modified != null)) ? result.JobAssignedItem[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_assigned_item_table');
			return;
		}
	},
	update_my_job_status_log_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobStatusLog === undefined) || (result.JobStatusLog === null) || (result.JobStatusLog.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobStatusLog.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_status_log WHERE id=' + result.JobStatusLog[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobStatusLog[i].created === temp_created) && ((result.JobStatusLog[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_status_log SET local_id=?,job_id=?,job_status_code=?,manager_user_id=?,reason=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobStatusLog[i].id, ((result.JobStatusLog[i].local_id != undefined) && (result.JobStatusLog[i].local_id != null)) ? result.JobStatusLog[i].local_id : '',
											((result.JobStatusLog[i].job_id != undefined) && (result.JobStatusLog[i].job_id != null)) ? result.JobStatusLog[i].job_id : 0, ((result.JobStatusLog[i].job_status_code != undefined) && (result.JobStatusLog[i].job_status_code != null)) ? result.JobStatusLog[i].job_status_code : 0,
											((result.JobStatusLog[i].manager_user_id != undefined) && (result.JobStatusLog[i].manager_user_id != null)) ? result.JobStatusLog[i].manager_user_id : 0, ((result.JobStatusLog[i].reason != undefined) && (result.JobStatusLog[i].reason != null)) ? result.JobStatusLog[i].reason : '',
											((result.JobStatusLog[i].status_code != undefined) && (result.JobStatusLog[i].status_code != null)) ? result.JobStatusLog[i].status_code : 0, 0, ((result.JobStatusLog[i].created != undefined) && (result.JobStatusLog[i].created != null)) ? result.JobStatusLog[i].created : '', ((result.JobStatusLog[i].created_by != undefined) && (result.JobStatusLog[i].created_by != null)) ? result.JobStatusLog[i].created_by
															: 0, ((result.JobStatusLog[i].modified_by != undefined) && (result.JobStatusLog[i].modified_by != null)) ? result.JobStatusLog[i].modified_by : 0, ((result.JobStatusLog[i].modified != undefined) && (result.JobStatusLog[i].modified != null)) ? result.JobStatusLog[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_status_log (id,local_id,job_id,job_status_code,' + 'manager_user_id,reason,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobStatusLog[i].id != undefined) && (result.JobStatusLog[i].id != null)) ? result.JobStatusLog[i].id : 0,
										((result.JobStatusLog[i].local_id != undefined) && (result.JobStatusLog[i].local_id != null)) ? result.JobStatusLog[i].local_id : '', ((result.JobStatusLog[i].job_id != undefined) && (result.JobStatusLog[i].job_id != null)) ? result.JobStatusLog[i].job_id : 0, ((result.JobStatusLog[i].job_status_code != undefined) && (result.JobStatusLog[i].job_status_code != null)) ? result.JobStatusLog[i].job_status_code : 0,
										((result.JobStatusLog[i].manager_user_id != undefined) && (result.JobStatusLog[i].manager_user_id != null)) ? result.JobStatusLog[i].manager_user_id : 0, ((result.JobStatusLog[i].reason != undefined) && (result.JobStatusLog[i].reason != null)) ? result.JobStatusLog[i].reason : '', ((result.JobStatusLog[i].status_code != undefined) && (result.JobStatusLog[i].status_code != null)) ? result.JobStatusLog[i].status_code
														: 0, 0, ((result.JobStatusLog[i].created != undefined) && (result.JobStatusLog[i].created != null)) ? result.JobStatusLog[i].created : '', ((result.JobStatusLog[i].created_by != undefined) && (result.JobStatusLog[i].created_by != null)) ? result.JobStatusLog[i].created_by : 0,
										((result.JobStatusLog[i].modified_by != undefined) && (result.JobStatusLog[i].modified_by != null)) ? result.JobStatusLog[i].modified_by : 0, ((result.JobStatusLog[i].modified != undefined) && (result.JobStatusLog[i].modified != null)) ? result.JobStatusLog[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_status_log_table');
			return;
		}
	},
	update_my_quote_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.Quote === undefined) || (result.Quote === null) || (result.Quote.length <= 0)) {
			} else {
				for (var i = 0, j = result.Quote.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote WHERE id=' + result.Quote[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.Quote[i].created === temp_created) && ((result.Quote[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote SET local_id=?,company_id=?,client_id=?,quote_status_code=?,scheduled_from=?,' + 'scheduled_to=?,reference_number=?,order_reference=?,sp=?,sub_number=?,unit_number=?,street_number=?,street=?,locality_street_type_id=?,street_type=?,' + 'locality_suburb_id=?,suburb=?,postcode=?,locality_state_id=?,latitude=?,longitude=?,point=?,boundary=?,geo_source_code=?,geo_accuracy_code=?,'
											+ 'title=?,description=?,booking_note=?,allocated_hours=?,job_id=?,status_code=?,due=?,order_source_code=?,changed=?,exist_any_changed=?,is_task=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.Quote[i].id, ((result.Quote[i].local_id != undefined) && (result.Quote[i].local_id != null)) ? result.Quote[i].local_id : '',
											((result.Quote[i].company_id != undefined) && (result.Quote[i].company_id != null)) ? result.Quote[i].company_id : 0, ((result.Quote[i].client_id != undefined) && (result.Quote[i].client_id != null)) ? result.Quote[i].client_id : 0, ((result.Quote[i].quote_status_code != undefined) && (result.Quote[i].quote_status_code != null)) ? result.Quote[i].quote_status_code : 0,
											((result.Quote[i].scheduled_from != undefined) && (result.Quote[i].scheduled_from != null)) ? result.Quote[i].scheduled_from : '', ((result.Quote[i].scheduled_to != undefined) && (result.Quote[i].scheduled_to != null)) ? result.Quote[i].scheduled_to : '', ((result.Quote[i].reference_number != undefined) && (result.Quote[i].reference_number != null)) ? result.Quote[i].reference_number : 0,
											((result.Quote[i].order_reference != undefined) && (result.Quote[i].order_reference != null)) ? result.Quote[i].order_reference : '', ((result.Quote[i].sp != undefined) && (result.Quote[i].sp != null)) ? result.Quote[i].sp : '', ((result.Quote[i].sub_number != undefined) && (result.Quote[i].sub_number != null)) ? result.Quote[i].sub_number : '',
											((result.Quote[i].unit_number != undefined) && (result.Quote[i].unit_number != null)) ? result.Quote[i].unit_number : '', ((result.Quote[i].street_number != undefined) && (result.Quote[i].street_number != null)) ? result.Quote[i].street_number : '', ((result.Quote[i].street != undefined) && (result.Quote[i].street != null)) ? result.Quote[i].street : '',
											((result.Quote[i].locality_street_type_id != undefined) && (result.Quote[i].locality_street_type_id != null)) ? result.Quote[i].locality_street_type_id : 0, ((result.Quote[i].street_type != undefined) && (result.Quote[i].street_type != null)) ? result.Quote[i].street_type : '',
											((result.Quote[i].locality_suburb_id != undefined) && (result.Quote[i].locality_suburb_id != null)) ? result.Quote[i].locality_suburb_id : 0, ((result.Quote[i].suburb != undefined) && (result.Quote[i].suburb != null)) ? result.Quote[i].suburb : '', ((result.Quote[i].postcode != undefined) && (result.Quote[i].postcode != null)) ? result.Quote[i].postcode : '',
											((result.Quote[i].locality_state_id != undefined) && (result.Quote[i].locality_state_id != null)) ? result.Quote[i].locality_state_id : 0, ((result.Quote[i].latitude != undefined) && (result.Quote[i].latitude != null)) ? result.Quote[i].latitude : 0, ((result.Quote[i].longitude != undefined) && (result.Quote[i].longitude != null)) ? result.Quote[i].longitude : 0,
											((result.Quote[i].point != undefined) && (result.Quote[i].point != null)) ? result.Quote[i].point : '', ((result.Quote[i].boundary != undefined) && (result.Quote[i].boundary != null)) ? result.Quote[i].boundary : '', ((result.Quote[i].geo_source_code != undefined) && (result.Quote[i].geo_source_code != null)) ? result.Quote[i].geo_source_code : 0,
											((result.Quote[i].geo_accuracy_code != undefined) && (result.Quote[i].geo_accuracy_code != null)) ? result.Quote[i].geo_accuracy_code : 0, ((result.Quote[i].title != undefined) && (result.Quote[i].title != null)) ? result.Quote[i].title : '', ((result.Quote[i].description != undefined) && (result.Quote[i].description != null)) ? result.Quote[i].description : '',
											((result.Quote[i].booking_note != undefined) && (result.Quote[i].booking_note != null)) ? result.Quote[i].booking_note : '', ((result.Quote[i].allocated_hours != undefined) && (result.Quote[i].allocated_hours != null)) ? result.Quote[i].allocated_hours : 0, ((result.Quote[i].job_id != undefined) && (result.Quote[i].job_id != null)) ? result.Quote[i].job_id : 0,
											((result.Quote[i].status_code != undefined) && (result.Quote[i].status_code != null)) ? result.Quote[i].status_code : 0, ((result.Quote[i].due != undefined) && (result.Quote[i].due != null)) ? result.Quote[i].due : '', ((result.Quote[i].order_source_code != undefined) && (result.Quote[i].order_source_code != null)) ? result.Quote[i].order_source_code : 0, 0, 0,
											((result.Quote[i].is_task != undefined) && (result.Quote[i].is_task != null)) ? result.Quote[i].is_task : 0, ((result.Quote[i].created != undefined) && (result.Quote[i].created != null)) ? result.Quote[i].created : '', ((result.Quote[i].created_by != undefined) && (result.Quote[i].created_by != null)) ? result.Quote[i].created_by : 0,
											((result.Quote[i].modified_by != undefined) && (result.Quote[i].modified_by != null)) ? result.Quote[i].modified_by : '', ((result.Quote[i].modified != undefined) && (result.Quote[i].modified != null)) ? result.Quote[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote (id,local_id,company_id,client_id,quote_status_code,scheduled_from,' + 'scheduled_to,reference_number,order_reference,sp,sub_number,unit_number,street_number,street,locality_street_type_id,street_type,' + 'locality_suburb_id,suburb,postcode,locality_state_id,latitude,longitude,point,boundary,geo_source_code,geo_accuracy_code,'
										+ 'title,description,booking_note,allocated_hours,job_id,status_code,due,order_source_code,changed,exist_any_changed,is_task,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.Quote[i].id != undefined) && (result.Quote[i].id != null)) ? result.Quote[i].id : '',
										((result.Quote[i].local_id != undefined) && (result.Quote[i].local_id != null)) ? result.Quote[i].local_id : '', ((result.Quote[i].company_id != undefined) && (result.Quote[i].company_id != null)) ? result.Quote[i].company_id : 0, ((result.Quote[i].client_id != undefined) && (result.Quote[i].client_id != null)) ? result.Quote[i].client_id : 0,
										((result.Quote[i].quote_status_code != undefined) && (result.Quote[i].quote_status_code != null)) ? result.Quote[i].quote_status_code : 0, ((result.Quote[i].scheduled_from != undefined) && (result.Quote[i].scheduled_from != null)) ? result.Quote[i].scheduled_from : '', ((result.Quote[i].scheduled_to != undefined) && (result.Quote[i].scheduled_to != null)) ? result.Quote[i].scheduled_to : '',
										((result.Quote[i].reference_number != undefined) && (result.Quote[i].reference_number != null)) ? result.Quote[i].reference_number : 0, ((result.Quote[i].order_reference != undefined) && (result.Quote[i].order_reference != null)) ? result.Quote[i].order_reference : '', ((result.Quote[i].sp != undefined) && (result.Quote[i].sp != null)) ? result.Quote[i].sp : '',
										((result.Quote[i].sub_number != undefined) && (result.Quote[i].sub_number != null)) ? result.Quote[i].sub_number : '', ((result.Quote[i].unit_number != undefined) && (result.Quote[i].unit_number != null)) ? result.Quote[i].unit_number : '', ((result.Quote[i].street_number != undefined) && (result.Quote[i].street_number != null)) ? result.Quote[i].street_number : '',
										((result.Quote[i].street != undefined) && (result.Quote[i].street != null)) ? result.Quote[i].street : '', ((result.Quote[i].locality_street_type_id != undefined) && (result.Quote[i].locality_street_type_id != null)) ? result.Quote[i].locality_street_type_id : 0, ((result.Quote[i].street_type != undefined) && (result.Quote[i].street_type != null)) ? result.Quote[i].street_type : '',
										((result.Quote[i].locality_suburb_id != undefined) && (result.Quote[i].locality_suburb_id != null)) ? result.Quote[i].locality_suburb_id : 0, ((result.Quote[i].suburb != undefined) && (result.Quote[i].suburb != null)) ? result.Quote[i].suburb : '', ((result.Quote[i].postcode != undefined) && (result.Quote[i].postcode != null)) ? result.Quote[i].postcode : '',
										((result.Quote[i].locality_state_id != undefined) && (result.Quote[i].locality_state_id != null)) ? result.Quote[i].locality_state_id : 0, ((result.Quote[i].latitude != undefined) && (result.Quote[i].latitude != null)) ? result.Quote[i].latitude : 0, ((result.Quote[i].longitude != undefined) && (result.Quote[i].longitude != null)) ? result.Quote[i].longitude : 0,
										((result.Quote[i].point != undefined) && (result.Quote[i].point != null)) ? result.Quote[i].point : '', ((result.Quote[i].boundary != undefined) && (result.Quote[i].boundary != null)) ? result.Quote[i].boundary : '', ((result.Quote[i].geo_source_code != undefined) && (result.Quote[i].geo_source_code != null)) ? result.Quote[i].geo_source_code : 0,
										((result.Quote[i].geo_accuracy_code != undefined) && (result.Quote[i].geo_accuracy_code != null)) ? result.Quote[i].geo_accuracy_code : 0, ((result.Quote[i].title != undefined) && (result.Quote[i].title != null)) ? result.Quote[i].title : '', ((result.Quote[i].description != undefined) && (result.Quote[i].description != null)) ? result.Quote[i].description : '',
										((result.Quote[i].booking_note != undefined) && (result.Quote[i].booking_note != null)) ? result.Quote[i].booking_note : '', ((result.Quote[i].allocated_hours != undefined) && (result.Quote[i].allocated_hours != null)) ? result.Quote[i].allocated_hours : 0, ((result.Quote[i].job_id != undefined) && (result.Quote[i].job_id != null)) ? result.Quote[i].job_id : 0,
										((result.Quote[i].status_code != undefined) && (result.Quote[i].status_code != null)) ? result.Quote[i].status_code : 0, ((result.Quote[i].due != undefined) && (result.Quote[i].due != null)) ? result.Quote[i].due : '', ((result.Quote[i].order_source_code != undefined) && (result.Quote[i].order_source_code != null)) ? result.Quote[i].order_source_code : 0, 0, 0,
										((result.Quote[i].is_task != undefined) && (result.Quote[i].is_task != null)) ? result.Quote[i].is_task : 0, ((result.Quote[i].created != undefined) && (result.Quote[i].created != null)) ? result.Quote[i].created : '', ((result.Quote[i].created_by != undefined) && (result.Quote[i].created_by != null)) ? result.Quote[i].created_by : 0,
										((result.Quote[i].modified_by != undefined) && (result.Quote[i].modified_by != null)) ? result.Quote[i].modified_by : '', ((result.Quote[i].modified != undefined) && (result.Quote[i].modified != null)) ? result.Quote[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_table');
			return;
		}
	},
	update_my_quote_asset_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteAsset === undefined) || (result.QuoteAsset === null) || (result.QuoteAsset.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuoteAsset.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_asset WHERE id=' + result.QuoteAsset[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuoteAsset[i].created === temp_created) && ((result.QuoteAsset[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_asset SET local_id=?,quote_id=?,quote_asset_type_code=?,name=?,description=?,path=?,path_original=?,' + 'mime_type=?,height=?,width=?,file_size=?,status_code=?,is_local_record=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.QuoteAsset[i].id, ((result.QuoteAsset[i].local_id != undefined) && (result.QuoteAsset[i].local_id != null)) ? result.QuoteAsset[i].local_id : '',
											((result.QuoteAsset[i].quote_id != undefined) && (result.QuoteAsset[i].quote_id != null)) ? result.QuoteAsset[i].quote_id : 0, ((result.QuoteAsset[i].quote_asset_type_code != undefined) && (result.QuoteAsset[i].quote_asset_type_code != null)) ? result.QuoteAsset[i].quote_asset_type_code : 0, ((result.QuoteAsset[i].name != undefined) && (result.QuoteAsset[i].name != null)) ? result.QuoteAsset[i].name : '',
											((result.QuoteAsset[i].description != undefined) && (result.QuoteAsset[i].description != null)) ? result.QuoteAsset[i].description : '', ((result.QuoteAsset[i].path != undefined) && (result.QuoteAsset[i].path != null)) ? result.QuoteAsset[i].path : '', ((result.QuoteAsset[i].path_original != undefined) && (result.QuoteAsset[i].path_original != null)) ? result.QuoteAsset[i].path_original : '',
											((result.QuoteAsset[i].mime_type != undefined) && (result.QuoteAsset[i].mime_type != null)) ? result.QuoteAsset[i].mime_type : '', ((result.QuoteAsset[i].height != undefined) && (result.QuoteAsset[i].height != null)) ? result.QuoteAsset[i].height : 0, ((result.QuoteAsset[i].width != undefined) && (result.QuoteAsset[i].width != null)) ? result.QuoteAsset[i].width : 0,
											((result.QuoteAsset[i].file_size != undefined) && (result.QuoteAsset[i].file_size != null)) ? result.QuoteAsset[i].file_size : 0, ((result.QuoteAsset[i].status_code != undefined) && (result.QuoteAsset[i].status_code != null)) ? result.QuoteAsset[i].status_code : 0, 0, 0, ((result.QuoteAsset[i].created != undefined) && (result.QuoteAsset[i].created != null)) ? result.QuoteAsset[i].created : '',
											((result.QuoteAsset[i].created_by != undefined) && (result.QuoteAsset[i].created_by != null)) ? result.QuoteAsset[i].created_by : 0, ((result.QuoteAsset[i].modified_by != undefined) && (result.QuoteAsset[i].modified_by != null)) ? result.QuoteAsset[i].modified_by : 0, ((result.QuoteAsset[i].modified != undefined) && (result.QuoteAsset[i].modified != null)) ? result.QuoteAsset[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_asset (id,local_id,quote_id,quote_asset_type_code,name,description,' + 'path,path_original,mime_type,height,width,file_size,status_code,is_local_record,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.QuoteAsset[i].id != undefined) && (result.QuoteAsset[i].id != null)) ? result.QuoteAsset[i].id : 0,
										((result.QuoteAsset[i].local_id != undefined) && (result.QuoteAsset[i].local_id != null)) ? result.QuoteAsset[i].local_id : '', ((result.QuoteAsset[i].quote_id != undefined) && (result.QuoteAsset[i].quote_id != null)) ? result.QuoteAsset[i].quote_id : 0,
										((result.QuoteAsset[i].quote_asset_type_code != undefined) && (result.QuoteAsset[i].quote_asset_type_code != null)) ? result.QuoteAsset[i].quote_asset_type_code : 0, ((result.QuoteAsset[i].name != undefined) && (result.QuoteAsset[i].name != null)) ? result.QuoteAsset[i].name : '', ((result.QuoteAsset[i].description != undefined) && (result.QuoteAsset[i].description != null)) ? result.QuoteAsset[i].description : '',
										((result.QuoteAsset[i].path != undefined) && (result.QuoteAsset[i].path != null)) ? result.QuoteAsset[i].path : '', ((result.QuoteAsset[i].path_original != undefined) && (result.QuoteAsset[i].path_original != null)) ? result.QuoteAsset[i].path_original : '', ((result.QuoteAsset[i].mime_type != undefined) && (result.QuoteAsset[i].mime_type != null)) ? result.QuoteAsset[i].mime_type : '',
										((result.QuoteAsset[i].height != undefined) && (result.QuoteAsset[i].height != null)) ? result.QuoteAsset[i].height : 0, ((result.QuoteAsset[i].width != undefined) && (result.QuoteAsset[i].width != null)) ? result.QuoteAsset[i].width : 0, ((result.QuoteAsset[i].file_size != undefined) && (result.QuoteAsset[i].file_size != null)) ? result.QuoteAsset[i].file_size : 0,
										((result.QuoteAsset[i].status_code != undefined) && (result.QuoteAsset[i].status_code != null)) ? result.QuoteAsset[i].status_code : 0, 0, 0, ((result.QuoteAsset[i].created != undefined) && (result.QuoteAsset[i].created != null)) ? result.QuoteAsset[i].created : '', ((result.QuoteAsset[i].created_by != undefined) && (result.QuoteAsset[i].created_by != null)) ? result.QuoteAsset[i].created_by : 0,
										((result.QuoteAsset[i].modified_by != undefined) && (result.QuoteAsset[i].modified_by != null)) ? result.QuoteAsset[i].modified_by : 0, ((result.QuoteAsset[i].modified != undefined) && (result.QuoteAsset[i].modified != null)) ? result.QuoteAsset[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_asset_table');
			return;
		}
	},
	update_my_quote_client_contact_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteClientContact === undefined) || (result.QuoteClientContact === null) || (result.QuoteClientContact.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuoteClientContact.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_client_contact WHERE id=' + result.QuoteClientContact[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuoteClientContact[i].created === temp_created) && ((result.QuoteClientContact[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_client_contact SET local_id=?,quote_id=?,client_contact_id=?,note=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? ' + 'WHERE id=' + result.QuoteClientContact[i].id, ((result.QuoteClientContact[i].local_id != undefined) && (result.QuoteClientContact[i].local_id != null)) ? result.QuoteClientContact[i].local_id : '',
											((result.QuoteClientContact[i].quote_id != undefined) && (result.QuoteClientContact[i].quote_id != null)) ? result.QuoteClientContact[i].quote_id : 0, ((result.QuoteClientContact[i].client_contact_id != undefined) && (result.QuoteClientContact[i].client_contact_id != null)) ? result.QuoteClientContact[i].client_contact_id : 0,
											((result.QuoteClientContact[i].note != undefined) && (result.QuoteClientContact[i].note != null)) ? result.QuoteClientContact[i].note : '', ((result.QuoteClientContact[i].status_code != undefined) && (result.QuoteClientContact[i].status_code != null)) ? result.QuoteClientContact[i].status_code : 0, 0,
											((result.QuoteClientContact[i].created != undefined) && (result.QuoteClientContact[i].created != null)) ? result.QuoteClientContact[i].created : '', ((result.QuoteClientContact[i].created_by != undefined) && (result.QuoteClientContact[i].created_by != null)) ? result.QuoteClientContact[i].created_by : 0,
											((result.QuoteClientContact[i].modified_by != undefined) && (result.QuoteClientContact[i].modified_by != null)) ? result.QuoteClientContact[i].modified_by : 0, ((result.QuoteClientContact[i].modified != undefined) && (result.QuoteClientContact[i].modified != null)) ? result.QuoteClientContact[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_client_contact (id,local_id,quote_id,client_contact_id,note,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?)', ((result.QuoteClientContact[i].id != undefined) && (result.QuoteClientContact[i].id != null)) ? result.QuoteClientContact[i].id : 0,
										((result.QuoteClientContact[i].local_id != undefined) && (result.QuoteClientContact[i].local_id != null)) ? result.QuoteClientContact[i].local_id : '', ((result.QuoteClientContact[i].quote_id != undefined) && (result.QuoteClientContact[i].quote_id != null)) ? result.QuoteClientContact[i].quote_id : 0,
										((result.QuoteClientContact[i].client_contact_id != undefined) && (result.QuoteClientContact[i].client_contact_id != null)) ? result.QuoteClientContact[i].client_contact_id : 0, ((result.QuoteClientContact[i].note != undefined) && (result.QuoteClientContact[i].note != null)) ? result.QuoteClientContact[i].note : '',
										((result.QuoteClientContact[i].status_code != undefined) && (result.QuoteClientContact[i].status_code != null)) ? result.QuoteClientContact[i].status_code : 0, 0, ((result.QuoteClientContact[i].created != undefined) && (result.QuoteClientContact[i].created != null)) ? result.QuoteClientContact[i].created : '',
										((result.QuoteClientContact[i].created_by != undefined) && (result.QuoteClientContact[i].created_by != null)) ? result.QuoteClientContact[i].created_by : 0, ((result.QuoteClientContact[i].modified_by != undefined) && (result.QuoteClientContact[i].modified_by != null)) ? result.QuoteClientContact[i].modified_by : 0,
										((result.QuoteClientContact[i].modified != undefined) && (result.QuoteClientContact[i].modified != null)) ? result.QuoteClientContact[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_client_contact_table');
			return;
		}
	},
	update_my_quote_site_contact_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteSiteContact === undefined) || (result.QuoteSiteContact === null) || (result.QuoteSiteContact.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuoteSiteContact.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_site_contact WHERE id=' + result.QuoteSiteContact[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuoteSiteContact[i].created === temp_created) && ((result.QuoteSiteContact[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_site_contact SET local_id=?,quote_id=?,salutation_code=?,display_name=?,first_name=?,last_name=?,phone_mobile=?,phone=?,phone_work=?,email=?,note=?,is_primary_contact=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? ' + 'WHERE id=' + result.QuoteSiteContact[i].id,
											((result.QuoteSiteContact[i].local_id != undefined) && (result.QuoteSiteContact[i].local_id != null)) ? result.QuoteSiteContact[i].local_id : '', ((result.QuoteSiteContact[i].quote_id != undefined) && (result.QuoteSiteContact[i].quote_id != null)) ? result.QuoteSiteContact[i].quote_id : 0,
											((result.QuoteSiteContact[i].salutation_code != undefined) && (result.QuoteSiteContact[i].salutation_code != null)) ? result.QuoteSiteContact[i].salutation_code : 0, ((result.QuoteSiteContact[i].display_name != undefined) && (result.QuoteSiteContact[i].display_name != null)) ? result.QuoteSiteContact[i].display_name : '',
											((result.QuoteSiteContact[i].first_name != undefined) && (result.QuoteSiteContact[i].first_name != null)) ? result.QuoteSiteContact[i].first_name : '', ((result.QuoteSiteContact[i].last_name != undefined) && (result.QuoteSiteContact[i].last_name != null)) ? result.QuoteSiteContact[i].last_name : '',
											((result.QuoteSiteContact[i].phone_mobile != undefined) && (result.QuoteSiteContact[i].phone_mobile != null)) ? result.QuoteSiteContact[i].phone_mobile : '', ((result.QuoteSiteContact[i].phone != undefined) && (result.QuoteSiteContact[i].phone != null)) ? result.QuoteSiteContact[i].phone : '',
											((result.QuoteSiteContact[i].phone_work != undefined) && (result.QuoteSiteContact[i].phone_work != null)) ? result.QuoteSiteContact[i].phone_work : '', ((result.QuoteSiteContact[i].email != undefined) && (result.QuoteSiteContact[i].email != null)) ? result.QuoteSiteContact[i].email : '',
											((result.QuoteSiteContact[i].note != undefined) && (result.QuoteSiteContact[i].note != null)) ? result.QuoteSiteContact[i].note : '', ((result.QuoteSiteContact[i].is_primary_contact != undefined) && (result.QuoteSiteContact[i].is_primary_contact != null)) ? result.QuoteSiteContact[i].is_primary_contact : 0,
											((result.QuoteSiteContact[i].status_code != undefined) && (result.QuoteSiteContact[i].status_code != null)) ? result.QuoteSiteContact[i].status_code : 0, 0, ((result.QuoteSiteContact[i].created != undefined) && (result.QuoteSiteContact[i].created != null)) ? result.QuoteSiteContact[i].created : '',
											((result.QuoteSiteContact[i].created_by != undefined) && (result.QuoteSiteContact[i].created_by != null)) ? result.QuoteSiteContact[i].created_by : 0, ((result.QuoteSiteContact[i].modified_by != undefined) && (result.QuoteSiteContact[i].modified_by != null)) ? result.QuoteSiteContact[i].modified_by : 0,
											((result.QuoteSiteContact[i].modified != undefined) && (result.QuoteSiteContact[i].modified != null)) ? result.QuoteSiteContact[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_site_contact (id,local_id,quote_id,salutation_code,display_name,first_name,last_name,phone_mobile,phone,phone_work,email,note,' + 'is_primary_contact,status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.QuoteSiteContact[i].id != undefined) && (result.QuoteSiteContact[i].id != null)) ? result.QuoteSiteContact[i].id : 0,
										((result.QuoteSiteContact[i].local_id != undefined) && (result.QuoteSiteContact[i].local_id != null)) ? result.QuoteSiteContact[i].local_id : '', ((result.QuoteSiteContact[i].quote_id != undefined) && (result.QuoteSiteContact[i].quote_id != null)) ? result.QuoteSiteContact[i].quote_id : 0,
										((result.QuoteSiteContact[i].salutation_code != undefined) && (result.QuoteSiteContact[i].salutation_code != null)) ? result.QuoteSiteContact[i].salutation_code : 0, ((result.QuoteSiteContact[i].display_name != undefined) && (result.QuoteSiteContact[i].display_name != null)) ? result.QuoteSiteContact[i].display_name : '',
										((result.QuoteSiteContact[i].first_name != undefined) && (result.QuoteSiteContact[i].first_name != null)) ? result.QuoteSiteContact[i].first_name : '', ((result.QuoteSiteContact[i].last_name != undefined) && (result.QuoteSiteContact[i].last_name != null)) ? result.QuoteSiteContact[i].last_name : '',
										((result.QuoteSiteContact[i].phone_mobile != undefined) && (result.QuoteSiteContact[i].phone_mobile != null)) ? result.QuoteSiteContact[i].phone_mobile : '', ((result.QuoteSiteContact[i].phone != undefined) && (result.QuoteSiteContact[i].phone != null)) ? result.QuoteSiteContact[i].phone : '',
										((result.QuoteSiteContact[i].phone_work != undefined) && (result.QuoteSiteContact[i].phone_work != null)) ? result.QuoteSiteContact[i].phone_work : '', ((result.QuoteSiteContact[i].email != undefined) && (result.QuoteSiteContact[i].email != null)) ? result.QuoteSiteContact[i].email : '', ((result.QuoteSiteContact[i].note != undefined) && (result.QuoteSiteContact[i].note != null)) ? result.QuoteSiteContact[i].note
														: '', ((result.QuoteSiteContact[i].is_primary_contact != undefined) && (result.QuoteSiteContact[i].is_primary_contact != null)) ? result.QuoteSiteContact[i].is_primary_contact : 0, ((result.QuoteSiteContact[i].status_code != undefined) && (result.QuoteSiteContact[i].status_code != null)) ? result.QuoteSiteContact[i].status_code : 0, 0,
										((result.QuoteSiteContact[i].created != undefined) && (result.QuoteSiteContact[i].created != null)) ? result.QuoteSiteContact[i].created : '', ((result.QuoteSiteContact[i].created_by != undefined) && (result.QuoteSiteContact[i].created_by != null)) ? result.QuoteSiteContact[i].created_by : 0,
										((result.QuoteSiteContact[i].modified_by != undefined) && (result.QuoteSiteContact[i].modified_by != null)) ? result.QuoteSiteContact[i].modified_by : 0, ((result.QuoteSiteContact[i].modified != undefined) && (result.QuoteSiteContact[i].modified != null)) ? result.QuoteSiteContact[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_site_contact_table');
			return;
		}
	},
	update_my_quote_contact_history_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteContactHistory === undefined) || (result.QuoteContactHistory === null) || (result.QuoteContactHistory.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuoteContactHistory.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_contact_history WHERE id=' + result.QuoteContactHistory[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuoteContactHistory[i].created === temp_created) && ((result.QuoteContactHistory[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_contact_history SET local_id=?,quote_id=?,manager_user_id=?,contact_type_code=?,description=?,' + 'contacted=?,status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.QuoteContactHistory[i].id, ((result.QuoteContactHistory[i].local_id != undefined) && (result.QuoteContactHistory[i].local_id != null)) ? result.QuoteContactHistory[i].local_id : '',
											((result.QuoteContactHistory[i].quote_id != undefined) && (result.QuoteContactHistory[i].quote_id != null)) ? result.QuoteContactHistory[i].quote_id : 0, ((result.QuoteContactHistory[i].manager_user_id != undefined) && (result.QuoteContactHistory[i].manager_user_id != null)) ? result.QuoteContactHistory[i].manager_user_id : 0,
											((result.QuoteContactHistory[i].contact_type_code != undefined) && (result.QuoteContactHistory[i].contact_type_code != null)) ? result.QuoteContactHistory[i].contact_type_code : 0, ((result.QuoteContactHistory[i].description != undefined) && (result.QuoteContactHistory[i].description != null)) ? result.QuoteContactHistory[i].description : '',
											((result.QuoteContactHistory[i].contacted != undefined) && (result.QuoteContactHistory[i].contacted != null)) ? result.QuoteContactHistory[i].contacted : '', ((result.QuoteContactHistory[i].status_code != undefined) && (result.QuoteContactHistory[i].status_code != null)) ? result.QuoteContactHistory[i].status_code : 0, 0,
											((result.QuoteContactHistory[i].created != undefined) && (result.QuoteContactHistory[i].created != null)) ? result.QuoteContactHistory[i].created : '', ((result.QuoteContactHistory[i].created_by != undefined) && (result.QuoteContactHistory[i].created_by != null)) ? result.QuoteContactHistory[i].created_by : 0,
											((result.QuoteContactHistory[i].modified_by != undefined) && (result.QuoteContactHistory[i].modified_by != null)) ? result.QuoteContactHistory[i].modified_by : 0, ((result.QuoteContactHistory[i].modified != undefined) && (result.QuoteContactHistory[i].modified != null)) ? result.QuoteContactHistory[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_contact_history (id,local_id,quote_id,manager_user_id,contact_type_code,description,' + 'contacted,status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.QuoteContactHistory[i].id != undefined) && (result.QuoteContactHistory[i].id != null)) ? result.QuoteContactHistory[i].id : 0,
										((result.QuoteContactHistory[i].local_id != undefined) && (result.QuoteContactHistory[i].local_id != null)) ? result.QuoteContactHistory[i].local_id : '', ((result.QuoteContactHistory[i].quote_id != undefined) && (result.QuoteContactHistory[i].quote_id != null)) ? result.QuoteContactHistory[i].quote_id : 0,
										((result.QuoteContactHistory[i].manager_user_id != undefined) && (result.QuoteContactHistory[i].manager_user_id != null)) ? result.QuoteContactHistory[i].manager_user_id : 0, ((result.QuoteContactHistory[i].contact_type_code != undefined) && (result.QuoteContactHistory[i].contact_type_code != null)) ? result.QuoteContactHistory[i].contact_type_code : 0,
										((result.QuoteContactHistory[i].description != undefined) && (result.QuoteContactHistory[i].description != null)) ? result.QuoteContactHistory[i].description : '', ((result.QuoteContactHistory[i].contacted != undefined) && (result.QuoteContactHistory[i].contacted != null)) ? result.QuoteContactHistory[i].contacted : '',
										((result.QuoteContactHistory[i].status_code != undefined) && (result.QuoteContactHistory[i].status_code != null)) ? result.QuoteContactHistory[i].status_code : 0, 0, ((result.QuoteContactHistory[i].created != undefined) && (result.QuoteContactHistory[i].created != null)) ? result.QuoteContactHistory[i].created : '',
										((result.QuoteContactHistory[i].created_by != undefined) && (result.QuoteContactHistory[i].created_by != null)) ? result.QuoteContactHistory[i].created_by : 0, ((result.QuoteContactHistory[i].modified_by != undefined) && (result.QuoteContactHistory[i].modified_by != null)) ? result.QuoteContactHistory[i].modified_by : 0,
										((result.QuoteContactHistory[i].modified != undefined) && (result.QuoteContactHistory[i].modified != null)) ? result.QuoteContactHistory[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_contact_history_table');
			return;
		}
	},
	update_my_quote_contact_history_recipient_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteRecipient === undefined) || (result.QuoteRecipient === null) || (result.QuoteRecipient.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuoteRecipient.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_contact_history_recipient WHERE id=' + result.QuoteRecipient[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuoteRecipient[i].created === temp_created) && ((result.QuoteRecipient[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_contact_history_recipient SET quote_contact_history_id=?,contact_message_id=?,model=?,pk_id=?,contact=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.QuoteRecipient[i].id, ((result.QuoteContactHistoryRecipient[i].id != undefined) && (result.QuoteContactHistoryRecipient[i].id != null)) ? result.QuoteContactHistoryRecipient[i].id : 0,
											((result.QuoteContactHistoryRecipient[i].quote_contact_history_id != undefined) && (result.QuoteContactHistoryRecipient[i].quote_contact_history_id != null)) ? result.QuoteContactHistoryRecipient[i].quote_contact_history_id : 0,
											((result.QuoteContactHistoryRecipient[i].contact_message_id != undefined) && (result.QuoteContactHistoryRecipient[i].contact_message_id != null)) ? result.QuoteContactHistoryRecipient[i].contact_message_id : 0, ((result.QuoteContactHistoryRecipient[i].model != undefined) && (result.QuoteContactHistoryRecipient[i].model != null)) ? result.QuoteContactHistoryRecipient[i].model : '',
											((result.QuoteContactHistoryRecipient[i].pk_id != undefined) && (result.QuoteContactHistoryRecipient[i].pk_id != null)) ? result.QuoteContactHistoryRecipient[i].pk_id : 0, ((result.QuoteContactHistoryRecipient[i].contact != undefined) && (result.QuoteContactHistoryRecipient[i].contact != null)) ? result.QuoteContactHistoryRecipient[i].contact : '',
											((result.QuoteContactHistoryRecipient[i].status_code != undefined) && (result.QuoteContactHistoryRecipient[i].status_code != null)) ? result.QuoteContactHistoryRecipient[i].status_code : 0, 0, ((result.QuoteContactHistoryRecipient[i].created != undefined) && (result.QuoteContactHistoryRecipient[i].created != null)) ? result.QuoteContactHistoryRecipient[i].created : '',
											((result.QuoteContactHistoryRecipient[i].created_by != undefined) && (result.QuoteContactHistoryRecipient[i].created_by != null)) ? result.QuoteContactHistoryRecipient[i].created_by : 0, ((result.QuoteContactHistoryRecipient[i].modified_by != undefined) && (result.QuoteContactHistoryRecipient[i].modified_by != null)) ? result.QuoteContactHistoryRecipient[i].modified_by : 0,
											((result.QuoteContactHistoryRecipient[i].modified != undefined) && (result.QuoteContactHistoryRecipient[i].modified != null)) ? result.QuoteContactHistoryRecipient[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_contact_history_recipient (id,quote_contact_history_id,contact_message_id,model,pk_id,contact,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', ((result.QuoteContactHistoryRecipient[i].id != undefined) && (result.QuoteContactHistoryRecipient[i].id != null)) ? result.QuoteContactHistoryRecipient[i].id : 0,
										((result.QuoteContactHistoryRecipient[i].quote_contact_history_id != undefined) && (result.QuoteContactHistoryRecipient[i].quote_contact_history_id != null)) ? result.QuoteContactHistoryRecipient[i].quote_contact_history_id : 0,
										((result.QuoteContactHistoryRecipient[i].contact_message_id != undefined) && (result.QuoteContactHistoryRecipient[i].contact_message_id != null)) ? result.QuoteContactHistoryRecipient[i].contact_message_id : 0, ((result.QuoteContactHistoryRecipient[i].model != undefined) && (result.QuoteContactHistoryRecipient[i].model != null)) ? result.QuoteContactHistoryRecipient[i].model : '',
										((result.QuoteContactHistoryRecipient[i].pk_id != undefined) && (result.QuoteContactHistoryRecipient[i].pk_id != null)) ? result.QuoteContactHistoryRecipient[i].pk_id : 0, ((result.QuoteContactHistoryRecipient[i].contact != undefined) && (result.QuoteContactHistoryRecipient[i].contact != null)) ? result.QuoteContactHistoryRecipient[i].contact : '',
										((result.QuoteContactHistoryRecipient[i].status_code != undefined) && (result.QuoteContactHistoryRecipient[i].status_code != null)) ? result.QuoteContactHistoryRecipient[i].status_code : 0, 0, ((result.QuoteContactHistoryRecipient[i].created != undefined) && (result.QuoteContactHistoryRecipient[i].created != null)) ? result.QuoteContactHistoryRecipient[i].created : '',
										((result.QuoteContactHistoryRecipient[i].created_by != undefined) && (result.QuoteContactHistoryRecipient[i].created_by != null)) ? result.QuoteContactHistoryRecipient[i].created_by : 0, ((result.QuoteContactHistoryRecipient[i].modified_by != undefined) && (result.QuoteContactHistoryRecipient[i].modified_by != null)) ? result.QuoteContactHistoryRecipient[i].modified_by : 0,
										((result.QuoteContactHistoryRecipient[i].modified != undefined) && (result.QuoteContactHistoryRecipient[i].modified != null)) ? result.QuoteContactHistoryRecipient[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_contact_history_recipient_table');
			return;
		}
	},
	update_my_quote_note_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteNote === undefined) || (result.QuoteNote === null) || (result.QuoteNote.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuoteNote.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_note WHERE id=' + result.QuoteNote[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuoteNote[i].created === temp_created) && ((result.QuoteNote[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_note SET local_id=?,quote_id=?,description=?,quote_note_type_code=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.QuoteNote[i].id, ((result.QuoteNote[i].local_id != undefined) && (result.QuoteNote[i].local_id != null)) ? result.QuoteNote[i].local_id : '',
											((result.QuoteNote[i].quote_id != undefined) && (result.QuoteNote[i].quote_id != null)) ? result.QuoteNote[i].quote_id : 0, ((result.QuoteNote[i].description != undefined) && (result.QuoteNote[i].description != null)) ? result.QuoteNote[i].description : '',
											((result.QuoteNote[i].quote_note_type_code != undefined) && (result.QuoteNote[i].quote_note_type_code != null)) ? result.QuoteNote[i].quote_note_type_code : 0, ((result.QuoteNote[i].status_code != undefined) && (result.QuoteNote[i].status_code != null)) ? result.QuoteNote[i].status_code : 0, 0, ((result.QuoteNote[i].created != undefined) && (result.QuoteNote[i].created != null)) ? result.QuoteNote[i].created
															: '', ((result.QuoteNote[i].created_by != undefined) && (result.QuoteNote[i].created_by != null)) ? result.QuoteNote[i].created_by : 0, ((result.QuoteNote[i].modified_by != undefined) && (result.QuoteNote[i].modified_by != null)) ? result.QuoteNote[i].modified_by : 0,
											((result.QuoteNote[i].modified != undefined) && (result.QuoteNote[i].modified != null)) ? result.QuoteNote[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_note (id,local_id,quote_id,description,quote_note_type_code,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?)', ((result.QuoteNote[i].id != undefined) && (result.QuoteNote[i].id != null)) ? result.QuoteNote[i].id : 0, ((result.QuoteNote[i].local_id != undefined) && (result.QuoteNote[i].local_id != null)) ? result.QuoteNote[i].local_id : '',
										((result.QuoteNote[i].quote_id != undefined) && (result.QuoteNote[i].quote_id != null)) ? result.QuoteNote[i].quote_id : 0, ((result.QuoteNote[i].description != undefined) && (result.QuoteNote[i].description != null)) ? result.QuoteNote[i].description : '', ((result.QuoteNote[i].quote_note_type_code != undefined) && (result.QuoteNote[i].quote_note_type_code != null)) ? result.QuoteNote[i].quote_note_type_code : 0,
										((result.QuoteNote[i].status_code != undefined) && (result.QuoteNote[i].status_code != null)) ? result.QuoteNote[i].status_code : 0, 0, ((result.QuoteNote[i].created != undefined) && (result.QuoteNote[i].created != null)) ? result.QuoteNote[i].created : '', ((result.QuoteNote[i].created_by != undefined) && (result.QuoteNote[i].created_by != null)) ? result.QuoteNote[i].created_by : 0,
										((result.QuoteNote[i].modified_by != undefined) && (result.QuoteNote[i].modified_by != null)) ? result.QuoteNote[i].modified_by : 0, ((result.QuoteNote[i].modified != undefined) && (result.QuoteNote[i].modified != null)) ? result.QuoteNote[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_note_table');
			return;
		}
	},
	update_my_quote_assigned_user_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteAssignedUser === undefined) || (result.QuoteAssignedUser === null) || (result.QuoteAssignedUser.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuoteAssignedUser.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_assigned_user WHERE id=' + result.QuoteAssignedUser[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuoteAssignedUser[i].created === temp_created) && ((result.QuoteAssignedUser[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_assigned_user SET local_id=?,quote_id=?,manager_user_id=?,job_assigned_user_code=?,' + 'assigned_from=?,assigned_to=?,status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.QuoteAssignedUser[i].id, ((result.QuoteAssignedUser[i].local_id != undefined) && (result.QuoteAssignedUser[i].local_id != null)) ? result.QuoteAssignedUser[i].local_id : '',
											((result.QuoteAssignedUser[i].quote_id != undefined) && (result.QuoteAssignedUser[i].quote_id != null)) ? result.QuoteAssignedUser[i].quote_id : 0, ((result.QuoteAssignedUser[i].manager_user_id != undefined) && (result.QuoteAssignedUser[i].manager_user_id != null)) ? result.QuoteAssignedUser[i].manager_user_id : 0,
											((result.QuoteAssignedUser[i].job_assigned_user_code != undefined) && (result.QuoteAssignedUser[i].job_assigned_user_code != null)) ? result.QuoteAssignedUser[i].job_assigned_user_code : 0, ((result.QuoteAssignedUser[i].assigned_from != undefined) && (result.QuoteAssignedUser[i].assigned_from != null)) ? result.QuoteAssignedUser[i].assigned_from : null,
											((result.QuoteAssignedUser[i].assigned_to != undefined) && (result.QuoteAssignedUser[i].assigned_to != null)) ? result.QuoteAssignedUser[i].assigned_to : null, ((result.QuoteAssignedUser[i].status_code != undefined) && (result.QuoteAssignedUser[i].status_code != null)) ? result.QuoteAssignedUser[i].status_code : 0, 0,
											((result.QuoteAssignedUser[i].created != undefined) && (result.QuoteAssignedUser[i].created != null)) ? result.QuoteAssignedUser[i].created : '', ((result.QuoteAssignedUser[i].created_by != undefined) && (result.QuoteAssignedUser[i].created_by != null)) ? result.QuoteAssignedUser[i].created_by : 0,
											((result.QuoteAssignedUser[i].modified_by != undefined) && (result.QuoteAssignedUser[i].modified_by != null)) ? result.QuoteAssignedUser[i].modified_by : 0, ((result.QuoteAssignedUser[i].modified != undefined) && (result.QuoteAssignedUser[i].modified != null)) ? result.QuoteAssignedUser[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_assigned_user (id,local_id,quote_id,manager_user_id,job_assigned_user_code,' + 'assigned_from,assigned_to,status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.QuoteAssignedUser[i].id != undefined) && (result.QuoteAssignedUser[i].id != null)) ? result.QuoteAssignedUser[i].id : 0,
										((result.QuoteAssignedUser[i].local_id != undefined) && (result.QuoteAssignedUser[i].local_id != null)) ? result.QuoteAssignedUser[i].local_id : '', ((result.QuoteAssignedUser[i].quote_id != undefined) && (result.QuoteAssignedUser[i].quote_id != null)) ? result.QuoteAssignedUser[i].quote_id : 0,
										((result.QuoteAssignedUser[i].manager_user_id != undefined) && (result.QuoteAssignedUser[i].manager_user_id != null)) ? result.QuoteAssignedUser[i].manager_user_id : 0, ((result.QuoteAssignedUser[i].job_assigned_user_code != undefined) && (result.QuoteAssignedUser[i].job_assigned_user_code != null)) ? result.QuoteAssignedUser[i].job_assigned_user_code : 0,
										((result.QuoteAssignedUser[i].assigned_from != undefined) && (result.QuoteAssignedUser[i].assigned_from != null)) ? result.QuoteAssignedUser[i].assigned_from : null, ((result.QuoteAssignedUser[i].assigned_to != undefined) && (result.QuoteAssignedUser[i].assigned_to != null)) ? result.QuoteAssignedUser[i].assigned_to : null,
										((result.QuoteAssignedUser[i].status_code != undefined) && (result.QuoteAssignedUser[i].status_code != null)) ? result.QuoteAssignedUser[i].status_code : 0, 0, ((result.QuoteAssignedUser[i].created != undefined) && (result.QuoteAssignedUser[i].created != null)) ? result.QuoteAssignedUser[i].created : '',
										((result.QuoteAssignedUser[i].created_by != undefined) && (result.QuoteAssignedUser[i].created_by != null)) ? result.QuoteAssignedUser[i].created_by : 0, ((result.QuoteAssignedUser[i].modified_by != undefined) && (result.QuoteAssignedUser[i].modified_by != null)) ? result.QuoteAssignedUser[i].modified_by : 0,
										((result.QuoteAssignedUser[i].modified != undefined) && (result.QuoteAssignedUser[i].modified != null)) ? result.QuoteAssignedUser[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_assigned_user_table');
			return;
		}
	},
	update_my_quote_assigned_item_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteAssignedItem === undefined) || (result.QuoteAssignedItem === null) || (result.QuoteAssignedItem.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuoteAssignedItem.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_assigned_item WHERE id=' + result.QuoteAssignedItem[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuoteAssignedItem[i].created === temp_created) && ((result.QuoteAssignedItem[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_assigned_item SET local_id=?,quote_id=?,job_library_item_id=?,materials_locations_id=?,units=?,item_order=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.QuoteAssignedItem[i].id, ((result.QuoteAssignedItem[i].local_id != undefined) && (result.QuoteAssignedItem[i].local_id != null)) ? result.QuoteAssignedItem[i].local_id : '',
											((result.QuoteAssignedItem[i].quote_id != undefined) && (result.QuoteAssignedItem[i].quote_id != null)) ? result.QuoteAssignedItem[i].quote_id : 0, ((result.QuoteAssignedItem[i].job_library_item_id != undefined) && (result.QuoteAssignedItem[i].job_library_item_id != null)) ? result.QuoteAssignedItem[i].job_library_item_id : 0,
											((result.QuoteAssignedItem[i].materials_locations_id != undefined) && (result.QuoteAssignedItem[i].materials_locations_id != null)) ? result.QuoteAssignedItem[i].materials_locations_id : 0, ((result.QuoteAssignedItem[i].units != undefined) && (result.QuoteAssignedItem[i].units != null)) ? result.QuoteAssignedItem[i].units : 0,
											((result.QuoteAssignedItem[i].item_order != undefined) && (result.QuoteAssignedItem[i].item_order != null)) ? result.QuoteAssignedItem[i].item_order : 0, ((result.QuoteAssignedItem[i].status_code != undefined) && (result.QuoteAssignedItem[i].status_code != null)) ? result.QuoteAssignedItem[i].status_code : 0, 0,
											((result.QuoteAssignedItem[i].created != undefined) && (result.QuoteAssignedItem[i].created != null)) ? result.QuoteAssignedItem[i].created : '', ((result.QuoteAssignedItem[i].created_by != undefined) && (result.QuoteAssignedItem[i].created_by != null)) ? result.QuoteAssignedItem[i].created_by : 0,
											((result.QuoteAssignedItem[i].modified_by != undefined) && (result.QuoteAssignedItem[i].modified_by != null)) ? result.QuoteAssignedItem[i].modified_by : 0, ((result.QuoteAssignedItem[i].modified != undefined) && (result.QuoteAssignedItem[i].modified != null)) ? result.QuoteAssignedItem[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_assigned_item (id,local_id,quote_id,job_library_item_id,materials_locations_id,units,item_order,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.QuoteAssignedItem[i].id != undefined) && (result.QuoteAssignedItem[i].id != null)) ? result.QuoteAssignedItem[i].id : '',
										((result.QuoteAssignedItem[i].local_id != undefined) && (result.QuoteAssignedItem[i].local_id != null)) ? result.QuoteAssignedItem[i].local_id : '', ((result.QuoteAssignedItem[i].quote_id != undefined) && (result.QuoteAssignedItem[i].quote_id != null)) ? result.QuoteAssignedItem[i].quote_id : 0,
										((result.QuoteAssignedItem[i].job_library_item_id != undefined) && (result.QuoteAssignedItem[i].job_library_item_id != null)) ? result.QuoteAssignedItem[i].job_library_item_id : 0, ((result.QuoteAssignedItem[i].materials_locations_id != undefined) && (result.QuoteAssignedItem[i].materials_locations_id != null)) ? result.QuoteAssignedItem[i].materials_locations_id : 0,
										((result.QuoteAssignedItem[i].units != undefined) && (result.QuoteAssignedItem[i].units != null)) ? result.QuoteAssignedItem[i].units : 0, ((result.QuoteAssignedItem[i].item_order != undefined) && (result.QuoteAssignedItem[i].item_order != null)) ? result.QuoteAssignedItem[i].item_order : 0,
										((result.QuoteAssignedItem[i].status_code != undefined) && (result.QuoteAssignedItem[i].status_code != null)) ? result.QuoteAssignedItem[i].status_code : 0, 0, ((result.QuoteAssignedItem[i].created != undefined) && (result.QuoteAssignedItem[i].created != null)) ? result.QuoteAssignedItem[i].created : '',
										((result.QuoteAssignedItem[i].created_by != undefined) && (result.QuoteAssignedItem[i].created_by != null)) ? result.QuoteAssignedItem[i].created_by : 0, ((result.QuoteAssignedItem[i].modified_by != undefined) && (result.QuoteAssignedItem[i].modified_by != null)) ? result.QuoteAssignedItem[i].modified_by : 0,
										((result.QuoteAssignedItem[i].modified != undefined) && (result.QuoteAssignedItem[i].modified != null)) ? result.QuoteAssignedItem[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_assigned_item_table');
			return;
		}
	},
	update_my_quote_status_log_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteStatusLog === undefined) || (result.QuoteStatusLog === null) || (result.QuoteStatusLog.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuoteStatusLog.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_status_log WHERE id=' + result.QuoteStatusLog[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuoteStatusLog[i].created === temp_created) && ((result.QuoteStatusLog[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_status_log SET local_id=?,quote_id=?,quote_status_code=?,manager_user_id=?,reason=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.QuoteStatusLog[i].id, ((result.QuoteStatusLog[i].local_id != undefined) && (result.QuoteStatusLog[i].local_id != null)) ? result.QuoteStatusLog[i].local_id : '',
											((result.QuoteStatusLog[i].quote_id != undefined) && (result.QuoteStatusLog[i].quote_id != null)) ? result.QuoteStatusLog[i].quote_id : 0, ((result.QuoteStatusLog[i].quote_status_code != undefined) && (result.QuoteStatusLog[i].quote_status_code != null)) ? result.QuoteStatusLog[i].quote_status_code : 0,
											((result.QuoteStatusLog[i].manager_user_id != undefined) && (result.QuoteStatusLog[i].manager_user_id != null)) ? result.QuoteStatusLog[i].manager_user_id : 0, ((result.QuoteStatusLog[i].reason != undefined) && (result.QuoteStatusLog[i].reason != null)) ? result.QuoteStatusLog[i].reason : '',
											((result.QuoteStatusLog[i].status_code != undefined) && (result.QuoteStatusLog[i].status_code != null)) ? result.QuoteStatusLog[i].status_code : 0, 0, ((result.QuoteStatusLog[i].created != undefined) && (result.QuoteStatusLog[i].created != null)) ? result.QuoteStatusLog[i].created : '',
											((result.QuoteStatusLog[i].created_by != undefined) && (result.QuoteStatusLog[i].created_by != null)) ? result.QuoteStatusLog[i].created_by : 0, ((result.QuoteStatusLog[i].modified_by != undefined) && (result.QuoteStatusLog[i].modified_by != null)) ? result.QuoteStatusLog[i].modified_by : 0,
											((result.QuoteStatusLog[i].modified != undefined) && (result.QuoteStatusLog[i].modified != null)) ? result.QuoteStatusLog[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_status_log (id,local_id,quote_id,quote_status_code,' + 'manager_user_id,reason,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', ((result.QuoteStatusLog[i].id != undefined) && (result.QuoteStatusLog[i].id != null)) ? result.QuoteStatusLog[i].id : 0,
										((result.QuoteStatusLog[i].local_id != undefined) && (result.QuoteStatusLog[i].local_id != null)) ? result.QuoteStatusLog[i].local_id : '', ((result.QuoteStatusLog[i].quote_id != undefined) && (result.QuoteStatusLog[i].quote_id != null)) ? result.QuoteStatusLog[i].quote_id : 0,
										((result.QuoteStatusLog[i].quote_status_code != undefined) && (result.QuoteStatusLog[i].quote_status_code != null)) ? result.QuoteStatusLog[i].quote_status_code : 0, ((result.QuoteStatusLog[i].manager_user_id != undefined) && (result.QuoteStatusLog[i].manager_user_id != null)) ? result.QuoteStatusLog[i].manager_user_id : 0,
										((result.QuoteStatusLog[i].reason != undefined) && (result.QuoteStatusLog[i].reason != null)) ? result.QuoteStatusLog[i].reason : '', ((result.QuoteStatusLog[i].status_code != undefined) && (result.QuoteStatusLog[i].status_code != null)) ? result.QuoteStatusLog[i].status_code : 0, 0, ((result.QuoteStatusLog[i].created != undefined) && (result.QuoteStatusLog[i].created != null)) ? result.QuoteStatusLog[i].created
														: '', ((result.QuoteStatusLog[i].created_by != undefined) && (result.QuoteStatusLog[i].created_by != null)) ? result.QuoteStatusLog[i].created_by : 0, ((result.QuoteStatusLog[i].modified_by != undefined) && (result.QuoteStatusLog[i].modified_by != null)) ? result.QuoteStatusLog[i].modified_by : 0,
										((result.QuoteStatusLog[i].modified != undefined) && (result.QuoteStatusLog[i].modified != null)) ? result.QuoteStatusLog[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_status_log_table');
			return;
		}
	},
	update_my_quote_operation_log_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteOperationLog === undefined) || (result.QuoteOperationLog === null) || (result.QuoteOperationLog.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuoteOperationLog.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_operation_log WHERE id=' + result.QuoteOperationLog[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuoteOperationLog[i].created === temp_created) && ((result.QuoteOperationLog[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_operation_log SET local_id=?,quote_id=?,quote_operation_log_type_code=?,manager_user_id=?,description=?,' + 'latitude=?,longitude=?,point=?,geo_source_code=?,geo_accuracy_code=?,' + 'logged=?,status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.QuoteOperationLog[i].id,
											((result.QuoteOperationLog[i].local_id != undefined) && (result.QuoteOperationLog[i].local_id != null)) ? result.QuoteOperationLog[i].local_id : '', ((result.QuoteOperationLog[i].quote_id != undefined) && (result.QuoteOperationLog[i].quote_id != null)) ? result.QuoteOperationLog[i].quote_id : 0,
											((result.QuoteOperationLog[i].quote_operation_log_type_code != undefined) && (result.QuoteOperationLog[i].quote_operation_log_type_code != null)) ? result.QuoteOperationLog[i].quote_operation_log_type_code : 0, ((result.QuoteOperationLog[i].manager_user_id != undefined) && (result.QuoteOperationLog[i].manager_user_id != null)) ? result.QuoteOperationLog[i].manager_user_id : 0,
											((result.QuoteOperationLog[i].description != undefined) && (result.QuoteOperationLog[i].description != null)) ? result.QuoteOperationLog[i].description : '', ((result.QuoteOperationLog[i].latitude != undefined) && (result.QuoteOperationLog[i].latitude != null)) ? result.QuoteOperationLog[i].latitude : 0,
											((result.QuoteOperationLog[i].longitude != undefined) && (result.QuoteOperationLog[i].longitude != null)) ? result.QuoteOperationLog[i].longitude : 0, ((result.QuoteOperationLog[i].point != undefined) && (result.QuoteOperationLog[i].point != null)) ? result.QuoteOperationLog[i].point : '',
											((result.QuoteOperationLog[i].geo_source_code != undefined) && (result.QuoteOperationLog[i].geo_source_code != null)) ? result.QuoteOperationLog[i].geo_source_code : 0, ((result.QuoteOperationLog[i].geo_accuracy_code != undefined) && (result.QuoteOperationLog[i].geo_accuracy_code != null)) ? result.QuoteOperationLog[i].geo_accuracy_code : 0,
											((result.QuoteOperationLog[i].logged != undefined) && (result.QuoteOperationLog[i].logged != null)) ? result.QuoteOperationLog[i].logged : '', ((result.QuoteOperationLog[i].status_code != undefined) && (result.QuoteOperationLog[i].status_code != null)) ? result.QuoteOperationLog[i].status_code : 0, 0,
											((result.QuoteOperationLog[i].created != undefined) && (result.QuoteOperationLog[i].created != null)) ? result.QuoteOperationLog[i].created : '', ((result.QuoteOperationLog[i].created_by != undefined) && (result.QuoteOperationLog[i].created_by != null)) ? result.QuoteOperationLog[i].created_by : 0,
											((result.QuoteOperationLog[i].modified_by != undefined) && (result.QuoteOperationLog[i].modified_by != null)) ? result.QuoteOperationLog[i].modified_by : 0, ((result.QuoteOperationLog[i].modified != undefined) && (result.QuoteOperationLog[i].modified != null)) ? result.QuoteOperationLog[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_operation_log (id,local_id,quote_id,quote_operation_log_type_code,' + 'manager_user_id,description,latitude,longitude,point,geo_source_code,geo_accuracy_code,' + 'logged,status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.QuoteOperationLog[i].id != undefined) && (result.QuoteOperationLog[i].id != null)) ? result.QuoteOperationLog[i].id : 0,
										((result.QuoteOperationLog[i].local_id != undefined) && (result.QuoteOperationLog[i].local_id != null)) ? result.QuoteOperationLog[i].local_id : '', ((result.QuoteOperationLog[i].quote_id != undefined) && (result.QuoteOperationLog[i].quote_id != null)) ? result.QuoteOperationLog[i].quote_id : 0,
										((result.QuoteOperationLog[i].quote_operation_log_type_code != undefined) && (result.QuoteOperationLog[i].quote_operation_log_type_code != null)) ? result.QuoteOperationLog[i].quote_operation_log_type_code : 0, ((result.QuoteOperationLog[i].manager_user_id != undefined) && (result.QuoteOperationLog[i].manager_user_id != null)) ? result.QuoteOperationLog[i].manager_user_id : 0,
										((result.QuoteOperationLog[i].description != undefined) && (result.QuoteOperationLog[i].description != null)) ? result.QuoteOperationLog[i].description : '', ((result.QuoteOperationLog[i].latitude != undefined) && (result.QuoteOperationLog[i].latitude != null)) ? result.QuoteOperationLog[i].latitude : 0,
										((result.QuoteOperationLog[i].longitude != undefined) && (result.QuoteOperationLog[i].longitude != null)) ? result.QuoteOperationLog[i].longitude : 0, ((result.QuoteOperationLog[i].point != undefined) && (result.QuoteOperationLog[i].point != null)) ? result.QuoteOperationLog[i].point : '',
										((result.QuoteOperationLog[i].geo_source_code != undefined) && (result.QuoteOperationLog[i].geo_source_code != null)) ? result.QuoteOperationLog[i].geo_source_code : 0, ((result.QuoteOperationLog[i].geo_accuracy_code != undefined) && (result.QuoteOperationLog[i].geo_accuracy_code != null)) ? result.QuoteOperationLog[i].geo_accuracy_code : 0,
										((result.QuoteOperationLog[i].logged != undefined) && (result.QuoteOperationLog[i].logged != null)) ? result.QuoteOperationLog[i].logged : '', ((result.QuoteOperationLog[i].status_code != undefined) && (result.QuoteOperationLog[i].status_code != null)) ? result.QuoteOperationLog[i].status_code : 0, 0,
										((result.QuoteOperationLog[i].created != undefined) && (result.QuoteOperationLog[i].created != null)) ? result.QuoteOperationLog[i].created : '', ((result.QuoteOperationLog[i].created_by != undefined) && (result.QuoteOperationLog[i].created_by != null)) ? result.QuoteOperationLog[i].created_by : 0,
										((result.QuoteOperationLog[i].modified_by != undefined) && (result.QuoteOperationLog[i].modified_by != null)) ? result.QuoteOperationLog[i].modified_by : 0, ((result.QuoteOperationLog[i].modified != undefined) && (result.QuoteOperationLog[i].modified != null)) ? result.QuoteOperationLog[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_operation_log_table');
			return;
		}
	},
	update_my_summary_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.Summary === undefined) || (result.Summary === null) || (result.Summary.length <= 0)) {
			} else {
				for (var i = 0, j = result.Summary.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_summary WHERE id=?', result.Summary[i].manager_user_id);
					var data_row_count = data_rows.getRowCount();
					data_rows.close();
					if (data_row_count > 0) {
						Ti.API.info('update result.Summary[i].my_job_total_number_on_server:' + result.Summary[i].my_job_total_number_on_server);
						db.execute('UPDATE my_summary SET company_id=?,job_total_number_on_server=?,unassigned_job_total_number_on_server=?,my_job_total_number_on_server=?,my_job_status_number_on_server=?,job_status_number_on_server=?,' + 'quote_total_number_on_server=?,unassigned_quote_total_number_on_server=?,my_quote_total_number_on_server=?,my_quote_status_number_on_server=?,quote_status_number_on_server=?,'
										+ 'client_number_on_server=?,business_client_number_on_server=?,private_client_number_on_server=?,' + 'client_contact_number_on_server=?,library_item_number_on_selected_location=?,library_item_number_on_server=?,suppliers_number_on_server=? ' + 'WHERE id=' + result.Summary[i].manager_user_id, result.Summary[i].company_id, result.Summary[i].job_total_number_on_server,
										result.Summary[i].unassigned_job_total_number_on_server, result.Summary[i].my_job_total_number_on_server, result.Summary[i].my_job_status_number_on_server, result.Summary[i].job_status_number_on_server, result.Summary[i].quote_total_number_on_server, result.Summary[i].unassigned_quote_total_number_on_server, result.Summary[i].my_quote_total_number_on_server, result.Summary[i].my_quote_status_number_on_server,
										result.Summary[i].quote_status_number_on_server, result.Summary[i].client_number_on_server, result.Summary[i].business_client_number_on_server, result.Summary[i].private_client_number_on_server, result.Summary[i].client_contact_number_on_server, result.Summary[i].library_item_number_on_selected_location, result.Summary[i].library_item_number_on_server, result.Summary[i].suppliers_number_on_server);
					} else {
						Ti.API.info('insert result.Summary[i].my_job_total_number_on_server:' + result.Summary[i].my_job_total_number_on_server);
						db.execute('INSERT INTO my_summary (id,manager_user_id,company_id,' + 'job_total_number_on_server,unassigned_job_total_number_on_server,my_job_total_number_on_server,my_job_status_number_on_server,job_status_number_on_server,' + 'quote_total_number_on_server,unassigned_quote_total_number_on_server,my_quote_total_number_on_server,my_quote_status_number_on_server,quote_status_number_on_server,'
										+ 'client_number_on_server,business_client_number_on_server,private_client_number_on_server,' + 'client_contact_number_on_server,library_item_number_on_selected_location,library_item_number_on_server,suppliers_number_on_server)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', result.Summary[i].manager_user_id, result.Summary[i].manager_user_id, result.Summary[i].company_id,
										result.Summary[i].job_total_number_on_server, result.Summary[i].unassigned_job_total_number_on_server, result.Summary[i].my_job_total_number_on_server, result.Summary[i].my_job_status_number_on_server, result.Summary[i].job_status_number_on_server, result.Summary[i].quote_total_number_on_server, result.Summary[i].unassigned_quote_total_number_on_server, result.Summary[i].my_quote_total_number_on_server,
										result.Summary[i].my_quote_status_number_on_server, result.Summary[i].quote_status_number_on_server, result.Summary[i].client_number_on_server, result.Summary[i].business_client_number_on_server, result.Summary[i].private_client_number_on_server, result.Summary[i].client_contact_number_on_server, result.Summary[i].library_item_number_on_selected_location, result.Summary[i].library_item_number_on_server,
										result.Summary[i].suppliers_number_on_server);
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_summary_table');
			return;
		}
	},
	// signature tables
	update_my_job_signature_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobSignature === undefined) || (result.JobSignature === null) || (result.JobSignature.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobSignature.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_signature WHERE id=' + result.JobSignature[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobSignature[i].created === temp_created) && ((result.JobSignature[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_signature SET local_id=?,job_id=?,client_name=?,path=?,time=?,mime_type=?,width=?,height=?,file_size=?,is_local_record=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobSignature[i].id, ((result.JobSignature[i].local_id != undefined) && (result.JobSignature[i].local_id != null)) ? result.JobSignature[i].local_id : '',
											((result.JobSignature[i].job_id != undefined) && (result.JobSignature[i].job_id != null)) ? result.JobSignature[i].job_id : 0, ((result.JobSignature[i].client_name != undefined) && (result.JobSignature[i].client_name != null)) ? result.JobSignature[i].client_name : '', ((result.JobSignature[i].path != undefined) && (result.JobSignature[i].path != null)) ? result.JobSignature[i].path : '',
											((result.JobSignature[i].time != undefined) && (result.JobSignature[i].time != null)) ? result.JobSignature[i].time : '', ((result.JobSignature[i].mime_type != undefined) && (result.JobSignature[i].mime_type != null)) ? result.JobSignature[i].mime_type : '', ((result.JobSignature[i].width != undefined) && (result.JobSignature[i].width != null)) ? result.JobSignature[i].width : 0,
											((result.JobSignature[i].height != undefined) && (result.JobSignature[i].height != null)) ? result.JobSignature[i].height : 0, ((result.JobSignature[i].file_size != undefined) && (result.JobSignature[i].file_size != null)) ? result.JobSignature[i].file_size : 0, 0, ((result.JobSignature[i].status_code != undefined) && (result.JobSignature[i].status_code != null)) ? result.JobSignature[i].status_code : 0, 0,
											((result.JobSignature[i].created != undefined) && (result.JobSignature[i].created != null)) ? result.JobSignature[i].created : '', ((result.JobSignature[i].created_by != undefined) && (result.JobSignature[i].created_by != null)) ? result.JobSignature[i].created_by : 0, ((result.JobSignature[i].modified_by != undefined) && (result.JobSignature[i].modified_by != null)) ? result.JobSignature[i].modified_by : 0,
											((result.JobSignature[i].modified != undefined) && (result.JobSignature[i].modified != null)) ? result.JobSignature[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_signature (id,local_id,job_id,client_name,path,time,mime_type,width,height,file_size,is_local_record,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobSignature[i].id != undefined) && (result.JobSignature[i].id != null)) ? result.JobSignature[i].id : 0,
										((result.JobSignature[i].local_id != undefined) && (result.JobSignature[i].local_id != null)) ? result.JobSignature[i].local_id : '', ((result.JobSignature[i].job_id != undefined) && (result.JobSignature[i].job_id != null)) ? result.JobSignature[i].job_id : 0, ((result.JobSignature[i].client_name != undefined) && (result.JobSignature[i].client_name != null)) ? result.JobSignature[i].client_name : '',
										((result.JobSignature[i].path != undefined) && (result.JobSignature[i].path != null)) ? result.JobSignature[i].path : '', ((result.JobSignature[i].time != undefined) && (result.JobSignature[i].time != null)) ? result.JobSignature[i].time : '', ((result.JobSignature[i].mime_type != undefined) && (result.JobSignature[i].mime_type != null)) ? result.JobSignature[i].mime_type : '',
										((result.JobSignature[i].width != undefined) && (result.JobSignature[i].width != null)) ? result.JobSignature[i].width : 0, ((result.JobSignature[i].height != undefined) && (result.JobSignature[i].height != null)) ? result.JobSignature[i].height : 0, ((result.JobSignature[i].file_size != undefined) && (result.JobSignature[i].file_size != null)) ? result.JobSignature[i].file_size : 0, 0,
										((result.JobSignature[i].status_code != undefined) && (result.JobSignature[i].status_code != null)) ? result.JobSignature[i].status_code : 0, 0, ((result.JobSignature[i].created != undefined) && (result.JobSignature[i].created != null)) ? result.JobSignature[i].created : '', ((result.JobSignature[i].created_by != undefined) && (result.JobSignature[i].created_by != null)) ? result.JobSignature[i].created_by : 0,
										((result.JobSignature[i].modified_by != undefined) && (result.JobSignature[i].modified_by != null)) ? result.JobSignature[i].modified_by : 0, ((result.JobSignature[i].modified != undefined) && (result.JobSignature[i].modified != null)) ? result.JobSignature[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_signature_table');
			return;
		}
	},
	update_my_quote_signature_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteSignature === undefined) || (result.QuoteSignature === null) || (result.QuoteSignature.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuoteSignature.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_signature WHERE id=' + result.QuoteSignature[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuoteSignature[i].created === temp_created) && ((result.QuoteSignature[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_signature SET local_id=?,quote_id=?,client_name=?,path=?,time=?,mime_type=?,width=?,height=?,file_size=?,is_local_record=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.QuoteSignature[i].id, ((result.QuoteSignature[i].local_id != undefined) && (result.QuoteSignature[i].local_id != null)) ? result.QuoteSignature[i].local_id : '',
											((result.QuoteSignature[i].quote_id != undefined) && (result.QuoteSignature[i].quote_id != null)) ? result.QuoteSignature[i].quote_id : 0, ((result.QuoteSignature[i].client_name != undefined) && (result.QuoteSignature[i].client_name != null)) ? result.QuoteSignature[i].client_name : '', ((result.QuoteSignature[i].path != undefined) && (result.QuoteSignature[i].path != null)) ? result.QuoteSignature[i].path
															: '', ((result.QuoteSignature[i].time != undefined) && (result.QuoteSignature[i].time != null)) ? result.QuoteSignature[i].time : '', ((result.QuoteSignature[i].mime_type != undefined) && (result.QuoteSignature[i].mime_type != null)) ? result.QuoteSignature[i].mime_type : '',
											((result.QuoteSignature[i].width != undefined) && (result.QuoteSignature[i].width != null)) ? result.QuoteSignature[i].width : 0, ((result.QuoteSignature[i].height != undefined) && (result.QuoteSignature[i].height != null)) ? result.QuoteSignature[i].height : 0, ((result.QuoteSignature[i].file_size != undefined) && (result.QuoteSignature[i].file_size != null)) ? result.QuoteSignature[i].file_size : 0, 0,
											((result.QuoteSignature[i].status_code != undefined) && (result.QuoteSignature[i].status_code != null)) ? result.QuoteSignature[i].status_code : 0, 0, ((result.QuoteSignature[i].created != undefined) && (result.QuoteSignature[i].created != null)) ? result.QuoteSignature[i].created : '',
											((result.QuoteSignature[i].created_by != undefined) && (result.QuoteSignature[i].created_by != null)) ? result.QuoteSignature[i].created_by : 0, ((result.QuoteSignature[i].modified_by != undefined) && (result.QuoteSignature[i].modified_by != null)) ? result.QuoteSignature[i].modified_by : 0,
											((result.QuoteSignature[i].modified != undefined) && (result.QuoteSignature[i].modified != null)) ? result.QuoteSignature[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_signature (id,local_id,quote_id,client_name,path,time,mime_type,width,height,file_size,is_local_record,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.QuoteSignature[i].id != undefined) && (result.QuoteSignature[i].id != null)) ? result.QuoteSignature[i].id : 0,
										((result.QuoteSignature[i].local_id != undefined) && (result.QuoteSignature[i].local_id != null)) ? result.QuoteSignature[i].local_id : '', ((result.QuoteSignature[i].quote_id != undefined) && (result.QuoteSignature[i].quote_id != null)) ? result.QuoteSignature[i].quote_id : 0,
										((result.QuoteSignature[i].client_name != undefined) && (result.QuoteSignature[i].client_name != null)) ? result.QuoteSignature[i].client_name : '', ((result.QuoteSignature[i].path != undefined) && (result.QuoteSignature[i].path != null)) ? result.QuoteSignature[i].path : 0, ((result.QuoteSignature[i].time != undefined) && (result.QuoteSignature[i].time != null)) ? result.QuoteSignature[i].time : '',
										((result.QuoteSignature[i].mime_type != undefined) && (result.QuoteSignature[i].mime_type != null)) ? result.QuoteSignature[i].mime_type : '', ((result.QuoteSignature[i].width != undefined) && (result.QuoteSignature[i].width != null)) ? result.QuoteSignature[i].width : 0, ((result.QuoteSignature[i].height != undefined) && (result.QuoteSignature[i].height != null)) ? result.QuoteSignature[i].height : 0,
										((result.QuoteSignature[i].file_size != undefined) && (result.QuoteSignature[i].file_size != null)) ? result.QuoteSignature[i].file_size : 0, 0, ((result.QuoteSignature[i].status_code != undefined) && (result.QuoteSignature[i].status_code != null)) ? result.QuoteSignature[i].status_code : 0, 0,
										((result.QuoteSignature[i].created != undefined) && (result.QuoteSignature[i].created != null)) ? result.QuoteSignature[i].created : '', ((result.QuoteSignature[i].created_by != undefined) && (result.QuoteSignature[i].created_by != null)) ? result.QuoteSignature[i].created_by : 0,
										((result.QuoteSignature[i].modified_by != undefined) && (result.QuoteSignature[i].modified_by != null)) ? result.QuoteSignature[i].modified_by : 0, ((result.QuoteSignature[i].modified != undefined) && (result.QuoteSignature[i].modified != null)) ? result.QuoteSignature[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_signature_table');
			return;
		}
	},
	// job invoice tables
	update_my_job_invoice_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobInvoice === undefined) || (result.JobInvoice === null) || (result.JobInvoice.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobInvoice.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_invoice WHERE id=' + result.JobInvoice[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobInvoice[i].created === temp_created) && ((result.JobInvoice[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_invoice SET local_id=?,company_id=?,reference_number=?,job_id=?,total_amount=?,payment_terms=?,payment_comments=?,' + 'path=?,account_external_reference=?,is_export=?,is_merge_signature=?,export_modify_time=?,job_invoice_status_code=?,job_invoice_template_id=?,setup=?,invoice_date=?,'
											+ 'description=?,description_items=?,description_labour=?,mark_up=?,discount=?,hidematerial=?,hidelabour=?,status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobInvoice[i].id, ((result.JobInvoice[i].local_id != undefined) && (result.JobInvoice[i].local_id != null)) ? result.JobInvoice[i].local_id : '',
											((result.JobInvoice[i].company_id != undefined) && (result.JobInvoice[i].company_id != null)) ? result.JobInvoice[i].company_id : 0, ((result.JobInvoice[i].reference_number != undefined) && (result.JobInvoice[i].reference_number != null)) ? result.JobInvoice[i].reference_number : 0, ((result.JobInvoice[i].job_id != undefined) && (result.JobInvoice[i].job_id != null)) ? result.JobInvoice[i].job_id : 0,
											((result.JobInvoice[i].total_amount != undefined) && (result.JobInvoice[i].total_amount != null)) ? result.JobInvoice[i].total_amount : 0, ((result.JobInvoice[i].payment_terms != undefined) && (result.JobInvoice[i].payment_terms != null)) ? result.JobInvoice[i].payment_terms : '',
											((result.JobInvoice[i].payment_comments != undefined) && (result.JobInvoice[i].payment_comments != null)) ? result.JobInvoice[i].payment_comments : '', ((result.JobInvoice[i].path != undefined) && (result.JobInvoice[i].path != null)) ? result.JobInvoice[i].path : '',
											((result.JobInvoice[i].account_external_reference != undefined) && (result.JobInvoice[i].account_external_reference != null)) ? result.JobInvoice[i].account_external_reference : '', ((result.JobInvoice[i].is_export != undefined) && (result.JobInvoice[i].is_export != null)) ? result.JobInvoice[i].is_export : 0,
											((result.JobInvoice[i].is_merge_signature != undefined) && (result.JobInvoice[i].is_merge_signature != null)) ? result.JobInvoice[i].is_merge_signature : 0, ((result.JobInvoice[i].export_modify_time != undefined) && (result.JobInvoice[i].export_modify_time != null)) ? result.JobInvoice[i].export_modify_time : '',
											((result.JobInvoice[i].job_invoice_status_code != undefined) && (result.JobInvoice[i].job_invoice_status_code != null)) ? result.JobInvoice[i].job_invoice_status_code : 0, ((result.JobInvoice[i].job_invoice_template_id != undefined) && (result.JobInvoice[i].job_invoice_template_id != null)) ? result.JobInvoice[i].job_invoice_template_id : 0,
											((result.JobInvoice[i].setup != undefined) && (result.JobInvoice[i].setup != null)) ? result.JobInvoice[i].setup : '', ((result.JobInvoice[i].invoice_date != undefined) && (result.JobInvoice[i].invoice_date != null)) ? result.JobInvoice[i].invoice_date : '', ((result.JobInvoice[i].description != undefined) && (result.JobInvoice[i].description != null)) ? result.JobInvoice[i].description : '',
											((result.JobInvoice[i].description_items != undefined) && (result.JobInvoice[i].description_items != null)) ? result.JobInvoice[i].description_items : '', ((result.JobInvoice[i].description_labour != undefined) && (result.JobInvoice[i].description_labour != null)) ? result.JobInvoice[i].description_labour : '',
											((result.JobInvoice[i].mark_up != undefined) && (result.JobInvoice[i].mark_up != null)) ? result.JobInvoice[i].mark_up : 0, ((result.JobInvoice[i].discount != undefined) && (result.JobInvoice[i].discount != null)) ? result.JobInvoice[i].discount : 0, ((result.JobInvoice[i].hidematerial != undefined) && (result.JobInvoice[i].hidematerial != null)) ? result.JobInvoice[i].hidematerial : 0,
											((result.JobInvoice[i].hidelabour != undefined) && (result.JobInvoice[i].hidelabour != null)) ? result.JobInvoice[i].hidelabour : 0, ((result.JobInvoice[i].status_code != undefined) && (result.JobInvoice[i].status_code != null)) ? result.JobInvoice[i].status_code : 0, 0, ((result.JobInvoice[i].created != undefined) && (result.JobInvoice[i].created != null)) ? result.JobInvoice[i].created : '',
											((result.JobInvoice[i].created_by != undefined) && (result.JobInvoice[i].created_by != null)) ? result.JobInvoice[i].created_by : 0, ((result.JobInvoice[i].modified_by != undefined) && (result.JobInvoice[i].modified_by != null)) ? result.JobInvoice[i].modified_by : 0, ((result.JobInvoice[i].modified != undefined) && (result.JobInvoice[i].modified != null)) ? result.JobInvoice[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_invoice (id,local_id,company_id,reference_number,job_id,total_amount,payment_terms,payment_comments,' + 'path,account_external_reference,is_export,is_merge_signature,export_modify_time,job_invoice_status_code,job_invoice_template_id,setup,invoice_date,' + 'description,description_items,description_labour,mark_up,discount,hidematerial,hidelabour,status_code,changed,created,created_by,modified_by,modified)'
										+ 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobInvoice[i].id != undefined) && (result.JobInvoice[i].id != null)) ? result.JobInvoice[i].id : 0, ((result.JobInvoice[i].local_id != undefined) && (result.JobInvoice[i].local_id != null)) ? result.JobInvoice[i].local_id : '',
										((result.JobInvoice[i].company_id != undefined) && (result.JobInvoice[i].company_id != null)) ? result.JobInvoice[i].company_id : 0, ((result.JobInvoice[i].reference_number != undefined) && (result.JobInvoice[i].reference_number != null)) ? result.JobInvoice[i].reference_number : 0, ((result.JobInvoice[i].job_id != undefined) && (result.JobInvoice[i].job_id != null)) ? result.JobInvoice[i].job_id : 0,
										((result.JobInvoice[i].total_amount != undefined) && (result.JobInvoice[i].total_amount != null)) ? result.JobInvoice[i].total_amount : 0, ((result.JobInvoice[i].payment_terms != undefined) && (result.JobInvoice[i].payment_terms != null)) ? result.JobInvoice[i].payment_terms : '',
										((result.JobInvoice[i].payment_comments != undefined) && (result.JobInvoice[i].payment_comments != null)) ? result.JobInvoice[i].payment_comments : '', ((result.JobInvoice[i].path != undefined) && (result.JobInvoice[i].path != null)) ? result.JobInvoice[i].path : '',
										((result.JobInvoice[i].account_external_reference != undefined) && (result.JobInvoice[i].account_external_reference != null)) ? result.JobInvoice[i].account_external_reference : '', ((result.JobInvoice[i].is_export != undefined) && (result.JobInvoice[i].is_export != null)) ? result.JobInvoice[i].is_export : 0,
										((result.JobInvoice[i].is_merge_signature != undefined) && (result.JobInvoice[i].is_merge_signature != null)) ? result.JobInvoice[i].is_merge_signature : 0, ((result.JobInvoice[i].export_modify_time != undefined) && (result.JobInvoice[i].export_modify_time != null)) ? result.JobInvoice[i].export_modify_time : '',
										((result.JobInvoice[i].job_invoice_status_code != undefined) && (result.JobInvoice[i].job_invoice_status_code != null)) ? result.JobInvoice[i].job_invoice_status_code : 0, ((result.JobInvoice[i].job_invoice_template_id != undefined) && (result.JobInvoice[i].job_invoice_template_id != null)) ? result.JobInvoice[i].job_invoice_template_id : 0,
										((result.JobInvoice[i].setup != undefined) && (result.JobInvoice[i].setup != null)) ? result.JobInvoice[i].setup : '', ((result.JobInvoice[i].invoice_date != undefined) && (result.JobInvoice[i].invoice_date != null)) ? result.JobInvoice[i].invoice_date : '', ((result.JobInvoice[i].description != undefined) && (result.JobInvoice[i].description != null)) ? result.JobInvoice[i].description : '',
										((result.JobInvoice[i].description_items != undefined) && (result.JobInvoice[i].description_items != null)) ? result.JobInvoice[i].description_items : '', ((result.JobInvoice[i].description_labour != undefined) && (result.JobInvoice[i].description_labour != null)) ? result.JobInvoice[i].description_labour : '',
										((result.JobInvoice[i].mark_up != undefined) && (result.JobInvoice[i].mark_up != null)) ? result.JobInvoice[i].mark_up : 0, ((result.JobInvoice[i].discount != undefined) && (result.JobInvoice[i].discount != null)) ? result.JobInvoice[i].discount : 0, ((result.JobInvoice[i].hidematerial != undefined) && (result.JobInvoice[i].hidematerial != null)) ? result.JobInvoice[i].hidematerial : 0,
										((result.JobInvoice[i].hidelabour != undefined) && (result.JobInvoice[i].hidelabour != null)) ? result.JobInvoice[i].hidelabour : 0, ((result.JobInvoice[i].status_code != undefined) && (result.JobInvoice[i].status_code != null)) ? result.JobInvoice[i].status_code : 0, 0, ((result.JobInvoice[i].created != undefined) && (result.JobInvoice[i].created != null)) ? result.JobInvoice[i].created : '',
										((result.JobInvoice[i].created_by != undefined) && (result.JobInvoice[i].created_by != null)) ? result.JobInvoice[i].created_by : 0, ((result.JobInvoice[i].modified_by != undefined) && (result.JobInvoice[i].modified_by != null)) ? result.JobInvoice[i].modified_by : 0, ((result.JobInvoice[i].modified != undefined) && (result.JobInvoice[i].modified != null)) ? result.JobInvoice[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_invoice_table');
			return;
		}
	},
	update_my_job_invoice_item_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobInvoiceItem === undefined) || (result.JobInvoiceItem === null) || (result.JobInvoiceItem.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobInvoiceItem.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_invoice_item WHERE id=' + result.JobInvoiceItem[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobInvoiceItem[i].created === temp_created) && ((result.JobInvoiceItem[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_invoice_item SET job_invoice_id=?,job_library_item_id=?,job_assigned_item_id=?,item_order=?,item_name=?,' + 'item_abbr=?,description=?,price=?,units=?,inc_gst=?,is_gst_exempt=?,mark_up=?,account_external_reference=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobInvoiceItem[i].id,
											((result.JobInvoiceItem[i].job_invoice_id != undefined) && (result.JobInvoiceItem[i].job_invoice_id != null)) ? result.JobInvoiceItem[i].job_invoice_id : 0, ((result.JobInvoiceItem[i].job_library_item_id != undefined) && (result.JobInvoiceItem[i].job_library_item_id != null)) ? result.JobInvoiceItem[i].job_library_item_id : 0,
											((result.JobInvoiceItem[i].job_assigned_item_id != undefined) && (result.JobInvoiceItem[i].job_assigned_item_id != null)) ? result.JobInvoiceItem[i].job_assigned_item_id : 0, ((result.JobInvoiceItem[i].item_order != undefined) && (result.JobInvoiceItem[i].item_order != null)) ? result.JobInvoiceItem[i].item_order : 0,
											((result.JobInvoiceItem[i].item_name != undefined) && (result.JobInvoiceItem[i].item_name != null)) ? result.JobInvoiceItem[i].item_name : '', ((result.JobInvoiceItem[i].item_abbr != undefined) && (result.JobInvoiceItem[i].item_abbr != null)) ? result.JobInvoiceItem[i].item_abbr : '',
											((result.JobInvoiceItem[i].description != undefined) && (result.JobInvoiceItem[i].description != null)) ? result.JobInvoiceItem[i].description : '', ((result.JobInvoiceItem[i].price != undefined) && (result.JobInvoiceItem[i].price != null)) ? result.JobInvoiceItem[i].price : 0, ((result.JobInvoiceItem[i].units != undefined) && (result.JobInvoiceItem[i].units != null)) ? result.JobInvoiceItem[i].units : 0,
											((result.JobInvoiceItem[i].inc_gst != undefined) && (result.JobInvoiceItem[i].inc_gst != null)) ? result.JobInvoiceItem[i].inc_gst : 0, ((result.JobInvoiceItem[i].is_gst_exempt != undefined) && (result.JobInvoiceItem[i].is_gst_exempt != null)) ? result.JobInvoiceItem[i].is_gst_exempt : 0,
											((result.JobInvoiceItem[i].mark_up != undefined) && (result.JobInvoiceItem[i].mark_up != null)) ? result.JobInvoiceItem[i].mark_up : 0, ((result.JobInvoiceItem[i].account_external_reference != undefined) && (result.JobInvoiceItem[i].account_external_reference != null)) ? result.JobInvoiceItem[i].account_external_reference : '',
											((result.JobInvoiceItem[i].status_code != undefined) && (result.JobInvoiceItem[i].status_code != null)) ? result.JobInvoiceItem[i].status_code : 0, 0, ((result.JobInvoiceItem[i].created != undefined) && (result.JobInvoiceItem[i].created != null)) ? result.JobInvoiceItem[i].created : '',
											((result.JobInvoiceItem[i].created_by != undefined) && (result.JobInvoiceItem[i].created_by != null)) ? result.JobInvoiceItem[i].created_by : 0, ((result.JobInvoiceItem[i].modified_by != undefined) && (result.JobInvoiceItem[i].modified_by != null)) ? result.JobInvoiceItem[i].modified_by : 0,
											((result.JobInvoiceItem[i].modified != undefined) && (result.JobInvoiceItem[i].modified != null)) ? result.JobInvoiceItem[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_invoice_item (id,job_invoice_id,job_library_item_id,job_assigned_item_id,item_order,item_name,' + 'item_abbr,description,price,units,inc_gst,is_gst_exempt,mark_up,account_external_reference,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
										((result.JobInvoiceItem[i].id != undefined) && (result.JobInvoiceItem[i].id != null)) ? result.JobInvoiceItem[i].id : 0, ((result.JobInvoiceItem[i].job_invoice_id != undefined) && (result.JobInvoiceItem[i].job_invoice_id != null)) ? result.JobInvoiceItem[i].job_invoice_id : 0,
										((result.JobInvoiceItem[i].job_library_item_id != undefined) && (result.JobInvoiceItem[i].job_library_item_id != null)) ? result.JobInvoiceItem[i].job_library_item_id : 0, ((result.JobInvoiceItem[i].job_assigned_item_id != undefined) && (result.JobInvoiceItem[i].job_assigned_item_id != null)) ? result.JobInvoiceItem[i].job_assigned_item_id : 0,
										((result.JobInvoiceItem[i].item_order != undefined) && (result.JobInvoiceItem[i].item_order != null)) ? result.JobInvoiceItem[i].item_order : 0, ((result.JobInvoiceItem[i].item_name != undefined) && (result.JobInvoiceItem[i].item_name != null)) ? result.JobInvoiceItem[i].item_name : '',
										((result.JobInvoiceItem[i].item_abbr != undefined) && (result.JobInvoiceItem[i].item_abbr != null)) ? result.JobInvoiceItem[i].item_abbr : '', ((result.JobInvoiceItem[i].description != undefined) && (result.JobInvoiceItem[i].description != null)) ? result.JobInvoiceItem[i].description : '', ((result.JobInvoiceItem[i].price != undefined) && (result.JobInvoiceItem[i].price != null)) ? result.JobInvoiceItem[i].price
														: 0, ((result.JobInvoiceItem[i].units != undefined) && (result.JobInvoiceItem[i].units != null)) ? result.JobInvoiceItem[i].units : 0, ((result.JobInvoiceItem[i].inc_gst != undefined) && (result.JobInvoiceItem[i].inc_gst != null)) ? result.JobInvoiceItem[i].inc_gst : 0,
										((result.JobInvoiceItem[i].is_gst_exempt != undefined) && (result.JobInvoiceItem[i].is_gst_exempt != null)) ? result.JobInvoiceItem[i].is_gst_exempt : 0, ((result.JobInvoiceItem[i].mark_up != undefined) && (result.JobInvoiceItem[i].mark_up != null)) ? result.JobInvoiceItem[i].mark_up : 0,
										((result.JobInvoiceItem[i].account_external_reference != undefined) && (result.JobInvoiceItem[i].account_external_reference != null)) ? result.JobInvoiceItem[i].account_external_reference : '', ((result.JobInvoiceItem[i].status_code != undefined) && (result.JobInvoiceItem[i].status_code != null)) ? result.JobInvoiceItem[i].status_code : 0, 0,
										((result.JobInvoiceItem[i].created != undefined) && (result.JobInvoiceItem[i].created != null)) ? result.JobInvoiceItem[i].created : '', ((result.JobInvoiceItem[i].created_by != undefined) && (result.JobInvoiceItem[i].created_by != null)) ? result.JobInvoiceItem[i].created_by : 0,
										((result.JobInvoiceItem[i].modified_by != undefined) && (result.JobInvoiceItem[i].modified_by != null)) ? result.JobInvoiceItem[i].modified_by : 0, ((result.JobInvoiceItem[i].modified != undefined) && (result.JobInvoiceItem[i].modified != null)) ? result.JobInvoiceItem[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_invoice_item_table');
			return;
		}
	},
	update_my_job_invoice_operation_item_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobInvoiceOperationItem === undefined) || (result.JobInvoiceOperationItem === null) || (result.JobInvoiceOperationItem.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobInvoiceOperationItem.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_invoice_operation_item WHERE id=' + result.JobInvoiceOperationItem[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobInvoiceOperationItem[i].created === temp_created) && ((result.JobInvoiceOperationItem[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_invoice_operation_item SET job_invoice_id=?,job_operation_stopped_log_id=?,duration=?,rate_per_hour=?,price=?,' + 'is_gst_exempt=?,mark_up=?,manager_user_id=?,description=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobInvoiceOperationItem[i].id,
											((result.JobInvoiceOperationItem[i].job_invoice_id != undefined) && (result.JobInvoiceOperationItem[i].job_invoice_id != null)) ? result.JobInvoiceOperationItem[i].job_invoice_id : 0, ((result.JobInvoiceOperationItem[i].job_operation_stopped_log_id != undefined) && (result.JobInvoiceOperationItem[i].job_operation_stopped_log_id != null)) ? result.JobInvoiceOperationItem[i].job_operation_stopped_log_id : 0,
											((result.JobInvoiceOperationItem[i].duration != undefined) && (result.JobInvoiceOperationItem[i].duration != null)) ? result.JobInvoiceOperationItem[i].duration : 0, ((result.JobInvoiceOperationItem[i].rate_per_hour != undefined) && (result.JobInvoiceOperationItem[i].rate_per_hour != null)) ? result.JobInvoiceOperationItem[i].rate_per_hour : 0,
											((result.JobInvoiceOperationItem[i].price != undefined) && (result.JobInvoiceOperationItem[i].price != null)) ? result.JobInvoiceOperationItem[i].price : 0, ((result.JobInvoiceOperationItem[i].is_gst_exempt != undefined) && (result.JobInvoiceOperationItem[i].is_gst_exempt != null)) ? result.JobInvoiceOperationItem[i].is_gst_exempt : 0,
											((result.JobInvoiceOperationItem[i].mark_up != undefined) && (result.JobInvoiceOperationItem[i].mark_up != null)) ? result.JobInvoiceOperationItem[i].mark_up : 0, ((result.JobInvoiceOperationItem[i].manager_user_id != undefined) && (result.JobInvoiceOperationItem[i].manager_user_id != null)) ? result.JobInvoiceOperationItem[i].manager_user_id : 0,
											((result.JobInvoiceOperationItem[i].description != undefined) && (result.JobInvoiceOperationItem[i].description != null)) ? result.JobInvoiceOperationItem[i].description : '', ((result.JobInvoiceOperationItem[i].status_code != undefined) && (result.JobInvoiceOperationItem[i].status_code != null)) ? result.JobInvoiceOperationItem[i].status_code : 0, 0,
											((result.JobInvoiceOperationItem[i].created != undefined) && (result.JobInvoiceOperationItem[i].created != null)) ? result.JobInvoiceOperationItem[i].created : '', ((result.JobInvoiceOperationItem[i].created_by != undefined) && (result.JobInvoiceOperationItem[i].created_by != null)) ? result.JobInvoiceOperationItem[i].created_by : 0,
											((result.JobInvoiceOperationItem[i].modified_by != undefined) && (result.JobInvoiceOperationItem[i].modified_by != null)) ? result.JobInvoiceOperationItem[i].modified_by : 0, ((result.JobInvoiceOperationItem[i].modified != undefined) && (result.JobInvoiceOperationItem[i].modified != null)) ? result.JobInvoiceOperationItem[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_invoice_operation_item (id,job_invoice_id,job_operation_stopped_log_id,duration,rate_per_hour,price,' + 'is_gst_exempt,mark_up,manager_user_id,description,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobInvoiceOperationItem[i].id != undefined) && (result.JobInvoiceOperationItem[i].id != null)) ? result.JobInvoiceOperationItem[i].id : 0,
										((result.JobInvoiceOperationItem[i].job_invoice_id != undefined) && (result.JobInvoiceOperationItem[i].job_invoice_id != null)) ? result.JobInvoiceOperationItem[i].job_invoice_id : 0, ((result.JobInvoiceOperationItem[i].job_operation_stopped_log_id != undefined) && (result.JobInvoiceOperationItem[i].job_operation_stopped_log_id != null)) ? result.JobInvoiceOperationItem[i].job_operation_stopped_log_id : 0,
										((result.JobInvoiceOperationItem[i].duration != undefined) && (result.JobInvoiceOperationItem[i].duration != null)) ? result.JobInvoiceOperationItem[i].duration : 0, ((result.JobInvoiceOperationItem[i].rate_per_hour != undefined) && (result.JobInvoiceOperationItem[i].rate_per_hour != null)) ? result.JobInvoiceOperationItem[i].rate_per_hour : 0,
										((result.JobInvoiceOperationItem[i].price != undefined) && (result.JobInvoiceOperationItem[i].price != null)) ? result.JobInvoiceOperationItem[i].price : 0, ((result.JobInvoiceOperationItem[i].is_gst_exempt != undefined) && (result.JobInvoiceOperationItem[i].is_gst_exempt != null)) ? result.JobInvoiceOperationItem[i].is_gst_exempt : 0,
										((result.JobInvoiceOperationItem[i].mark_up != undefined) && (result.JobInvoiceOperationItem[i].mark_up != null)) ? result.JobInvoiceOperationItem[i].mark_up : 0, ((result.JobInvoiceOperationItem[i].manager_user_id != undefined) && (result.JobInvoiceOperationItem[i].manager_user_id != null)) ? result.JobInvoiceOperationItem[i].manager_user_id : 0,
										((result.JobInvoiceOperationItem[i].description != undefined) && (result.JobInvoiceOperationItem[i].description != null)) ? result.JobInvoiceOperationItem[i].description : '', ((result.JobInvoiceOperationItem[i].status_code != undefined) && (result.JobInvoiceOperationItem[i].status_code != null)) ? result.JobInvoiceOperationItem[i].status_code : 0, 0,
										((result.JobInvoiceOperationItem[i].created != undefined) && (result.JobInvoiceOperationItem[i].created != null)) ? result.JobInvoiceOperationItem[i].created : '', ((result.JobInvoiceOperationItem[i].created_by != undefined) && (result.JobInvoiceOperationItem[i].created_by != null)) ? result.JobInvoiceOperationItem[i].created_by : 0,
										((result.JobInvoiceOperationItem[i].modified_by != undefined) && (result.JobInvoiceOperationItem[i].modified_by != null)) ? result.JobInvoiceOperationItem[i].modified_by : 0, ((result.JobInvoiceOperationItem[i].modified != undefined) && (result.JobInvoiceOperationItem[i].modified != null)) ? result.JobInvoiceOperationItem[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_invoice_operation_item_table');
			return;
		}
	},
	update_my_job_invoice_receipt_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobInvoiceReceipt === undefined) || (result.JobInvoiceReceipt === null) || (result.JobInvoiceReceipt.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobInvoiceReceipt.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_invoice_receipt WHERE id=' + result.JobInvoiceReceipt[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobInvoiceReceipt[i].created === temp_created) && ((result.JobInvoiceReceipt[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_invoice_receipt SET local_id=?,company_id=?,reference_number=?,job_invoice_id=?,receipt_date=?,' + 'receipt_amount=?,receipt_status_code=?,note=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobInvoiceReceipt[i].id, ((result.JobInvoiceReceipt[i].local_id != undefined) && (result.JobInvoiceReceipt[i].local_id != null)) ? result.JobInvoiceReceipt[i].local_id : '',
											((result.JobInvoiceReceipt[i].company_id != undefined) && (result.JobInvoiceReceipt[i].company_id != null)) ? result.JobInvoiceReceipt[i].company_id : 0, ((result.JobInvoiceReceipt[i].reference_number != undefined) && (result.JobInvoiceReceipt[i].reference_number != null)) ? result.JobInvoiceReceipt[i].reference_number : 0,
											((result.JobInvoiceReceipt[i].job_invoice_id != undefined) && (result.JobInvoiceReceipt[i].job_invoice_id != null)) ? result.JobInvoiceReceipt[i].job_invoice_id : 0, ((result.JobInvoiceReceipt[i].receipt_date != undefined) && (result.JobInvoiceReceipt[i].receipt_date != null)) ? result.JobInvoiceReceipt[i].receipt_date : '',
											((result.JobInvoiceReceipt[i].receipt_amount != undefined) && (result.JobInvoiceReceipt[i].receipt_amount != null)) ? result.JobInvoiceReceipt[i].receipt_amount : 0, ((result.JobInvoiceReceipt[i].receipt_status_code != undefined) && (result.JobInvoiceReceipt[i].receipt_status_code != null)) ? result.JobInvoiceReceipt[i].receipt_status_code : 0,
											((result.JobInvoiceReceipt[i].note != undefined) && (result.JobInvoiceReceipt[i].note != null)) ? result.JobInvoiceReceipt[i].note : '', ((result.JobInvoiceReceipt[i].status_code != undefined) && (result.JobInvoiceReceipt[i].status_code != null)) ? result.JobInvoiceReceipt[i].status_code : 0, 0,
											((result.JobInvoiceReceipt[i].created != undefined) && (result.JobInvoiceReceipt[i].created != null)) ? result.JobInvoiceReceipt[i].created : '', ((result.JobInvoiceReceipt[i].created_by != undefined) && (result.JobInvoiceReceipt[i].created_by != null)) ? result.JobInvoiceReceipt[i].created_by : 0,
											((result.JobInvoiceReceipt[i].modified_by != undefined) && (result.JobInvoiceReceipt[i].modified_by != null)) ? result.JobInvoiceReceipt[i].modified_by : 0, ((result.JobInvoiceReceipt[i].modified != undefined) && (result.JobInvoiceReceipt[i].modified != null)) ? result.JobInvoiceReceipt[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_invoice_receipt (id,local_id,company_id,reference_number,' + 'job_invoice_id,receipt_date,receipt_amount,receipt_status_code,note,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobInvoiceReceipt[i].id != undefined) && (result.JobInvoiceReceipt[i].id != null)) ? result.JobInvoiceReceipt[i].id : 0,
										((result.JobInvoiceReceipt[i].local_id != undefined) && (result.JobInvoiceReceipt[i].local_id != null)) ? result.JobInvoiceReceipt[i].local_id : '', ((result.JobInvoiceReceipt[i].company_id != undefined) && (result.JobInvoiceReceipt[i].company_id != null)) ? result.JobInvoiceReceipt[i].company_id : 0,
										((result.JobInvoiceReceipt[i].reference_number != undefined) && (result.JobInvoiceReceipt[i].reference_number != null)) ? result.JobInvoiceReceipt[i].reference_number : 0, ((result.JobInvoiceReceipt[i].job_invoice_id != undefined) && (result.JobInvoiceReceipt[i].job_invoice_id != null)) ? result.JobInvoiceReceipt[i].job_invoice_id : 0,
										((result.JobInvoiceReceipt[i].receipt_date != undefined) && (result.JobInvoiceReceipt[i].receipt_date != null)) ? result.JobInvoiceReceipt[i].receipt_date : '', ((result.JobInvoiceReceipt[i].receipt_amount != undefined) && (result.JobInvoiceReceipt[i].receipt_amount != null)) ? result.JobInvoiceReceipt[i].receipt_amount : 0,
										((result.JobInvoiceReceipt[i].receipt_status_code != undefined) && (result.JobInvoiceReceipt[i].receipt_status_code != null)) ? result.JobInvoiceReceipt[i].receipt_status_code : 0, ((result.JobInvoiceReceipt[i].note != undefined) && (result.JobInvoiceReceipt[i].note != null)) ? result.JobInvoiceReceipt[i].note : '',
										((result.JobInvoiceReceipt[i].status_code != undefined) && (result.JobInvoiceReceipt[i].status_code != null)) ? result.JobInvoiceReceipt[i].status_code : 0, 0, ((result.JobInvoiceReceipt[i].created != undefined) && (result.JobInvoiceReceipt[i].created != null)) ? result.JobInvoiceReceipt[i].created : '',
										((result.JobInvoiceReceipt[i].created_by != undefined) && (result.JobInvoiceReceipt[i].created_by != null)) ? result.JobInvoiceReceipt[i].created_by : 0, ((result.JobInvoiceReceipt[i].modified_by != undefined) && (result.JobInvoiceReceipt[i].modified_by != null)) ? result.JobInvoiceReceipt[i].modified_by : 0,
										((result.JobInvoiceReceipt[i].modified != undefined) && (result.JobInvoiceReceipt[i].modified != null)) ? result.JobInvoiceReceipt[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_invoice_receipt_table');
			return;
		}
	},
	update_my_job_invoice_receipt_status_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobInvoiceReceiptStatus === undefined) || (result.JobInvoiceReceiptStatus === null) || (result.JobInvoiceReceiptStatus.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_job_invoice_receipt_status');
				for (var i = 0, j = result.JobInvoiceReceiptStatus.length; i < j; i++) {
					db.execute('INSERT INTO my_job_invoice_receipt_status (code,name,description,abbr)VALUES(?,?,?,?)', ((result.JobInvoiceReceiptStatus[i].code != undefined) && (result.JobInvoiceReceiptStatus[i].code != null)) ? result.JobInvoiceReceiptStatus[i].code : 0, ((result.JobInvoiceReceiptStatus[i].name != undefined) && (result.JobInvoiceReceiptStatus[i].name != null)) ? result.JobInvoiceReceiptStatus[i].name : '',
									((result.JobInvoiceReceiptStatus[i].description != undefined) && (result.JobInvoiceReceiptStatus[i].description != null)) ? result.JobInvoiceReceiptStatus[i].description : '', ((result.JobInvoiceReceiptStatus[i].abbr != undefined) && (result.JobInvoiceReceiptStatus[i].abbr != null)) ? result.JobInvoiceReceiptStatus[i].abbr : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_invoice_receipt_status_table');
			return;
		}
	},
	update_my_job_invoice_status_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobInvoiceStatusCode === undefined) || (result.JobInvoiceStatusCode === null) || (result.JobInvoiceStatusCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_job_invoice_status_code');
				for (var i = 0, j = result.JobInvoiceStatusCode.length; i < j; i++) {
					db.execute('INSERT INTO my_job_invoice_status_code (code,name,description,abbr)VALUES(?,?,?,?)', ((result.JobInvoiceStatusCode[i].code != undefined) && (result.JobInvoiceStatusCode[i].code != null)) ? result.JobInvoiceStatusCode[i].code : 0, ((result.JobInvoiceStatusCode[i].name != undefined) && (result.JobInvoiceStatusCode[i].name != null)) ? result.JobInvoiceStatusCode[i].name : '',
									((result.JobInvoiceStatusCode[i].description != undefined) && (result.JobInvoiceStatusCode[i].description != null)) ? result.JobInvoiceStatusCode[i].description : '', ((result.JobInvoiceStatusCode[i].abbr != undefined) && (result.JobInvoiceStatusCode[i].abbr != null)) ? result.JobInvoiceStatusCode[i].abbr : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_invoice_status_code_table');
			return;
		}
	},
	update_my_job_invoice_status_log_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobInvoiceStatusLog === undefined) || (result.JobInvoiceStatusLog === null) || (result.JobInvoiceStatusLog.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobInvoiceStatusLog.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_invoice_status_log WHERE id=' + result.JobInvoiceStatusLog[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobInvoiceStatusLog[i].created === temp_created) && ((result.JobInvoiceStatusLog[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_invoice_status_log SET local_id=?,job_invoice_id=?,job_invoice_status_code=?,manager_user_id=?,reason=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobInvoiceStatusLog[i].id, ((result.JobInvoiceStatusLog[i].local_id != undefined) && (result.JobInvoiceStatusLog[i].local_id != null)) ? result.JobInvoiceStatusLog[i].local_id : '',
											((result.JobInvoiceStatusLog[i].job_invoice_id != undefined) && (result.JobInvoiceStatusLog[i].job_invoice_id != null)) ? result.JobInvoiceStatusLog[i].job_invoice_id : 0, ((result.JobInvoiceStatusLog[i].job_invoice_status_code != undefined) && (result.JobInvoiceStatusLog[i].job_invoice_status_code != null)) ? result.JobInvoiceStatusLog[i].job_invoice_status_code : 0,
											((result.JobInvoiceStatusLog[i].manager_user_id != undefined) && (result.JobInvoiceStatusLog[i].manager_user_id != null)) ? result.JobInvoiceStatusLog[i].manager_user_id : 0, ((result.JobInvoiceStatusLog[i].reason != undefined) && (result.JobInvoiceStatusLog[i].reason != null)) ? result.JobInvoiceStatusLog[i].reason : '',
											((result.JobInvoiceStatusLog[i].status_code != undefined) && (result.JobInvoiceStatusLog[i].status_code != null)) ? result.JobInvoiceStatusLog[i].status_code : 0, 0, ((result.JobInvoiceStatusLog[i].created != undefined) && (result.JobInvoiceStatusLog[i].created != null)) ? result.JobInvoiceStatusLog[i].created : '',
											((result.JobInvoiceStatusLog[i].created_by != undefined) && (result.JobInvoiceStatusLog[i].created_by != null)) ? result.JobInvoiceStatusLog[i].created_by : 0, ((result.JobInvoiceStatusLog[i].modified_by != undefined) && (result.JobInvoiceStatusLog[i].modified_by != null)) ? result.JobInvoiceStatusLog[i].modified_by : 0,
											((result.JobInvoiceStatusLog[i].modified != undefined) && (result.JobInvoiceStatusLog[i].modified != null)) ? result.JobInvoiceStatusLog[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_invoice_status_log (id,local_id,job_invoice_id,job_invoice_status_code,manager_user_id,reason,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobInvoiceStatusLog[i].id != undefined) && (result.JobInvoiceStatusLog[i].id != null)) ? result.JobInvoiceStatusLog[i].id : 0,
										((result.JobInvoiceStatusLog[i].local_id != undefined) && (result.JobInvoiceStatusLog[i].local_id != null)) ? result.JobInvoiceStatusLog[i].local_id : '', ((result.JobInvoiceStatusLog[i].job_invoice_id != undefined) && (result.JobInvoiceStatusLog[i].job_invoice_id != null)) ? result.JobInvoiceStatusLog[i].job_invoice_id : 0,
										((result.JobInvoiceStatusLog[i].job_invoice_status_code != undefined) && (result.JobInvoiceStatusLog[i].job_invoice_status_code != null)) ? result.JobInvoiceStatusLog[i].job_invoice_status_code : 0, ((result.JobInvoiceStatusLog[i].manager_user_id != undefined) && (result.JobInvoiceStatusLog[i].manager_user_id != null)) ? result.JobInvoiceStatusLog[i].manager_user_id : 0,
										((result.JobInvoiceStatusLog[i].reason != undefined) && (result.JobInvoiceStatusLog[i].reason != null)) ? result.JobInvoiceStatusLog[i].reason : '', ((result.JobInvoiceStatusLog[i].status_code != undefined) && (result.JobInvoiceStatusLog[i].status_code != null)) ? result.JobInvoiceStatusLog[i].status_code : 0, 0,
										((result.JobInvoiceStatusLog[i].created != undefined) && (result.JobInvoiceStatusLog[i].created != null)) ? result.JobInvoiceStatusLog[i].created : '', ((result.JobInvoiceStatusLog[i].created_by != undefined) && (result.JobInvoiceStatusLog[i].created_by != null)) ? result.JobInvoiceStatusLog[i].created_by : 0,
										((result.JobInvoiceStatusLog[i].modified_by != undefined) && (result.JobInvoiceStatusLog[i].modified_by != null)) ? result.JobInvoiceStatusLog[i].modified_by : 0, ((result.JobInvoiceStatusLog[i].modified != undefined) && (result.JobInvoiceStatusLog[i].modified != null)) ? result.JobInvoiceStatusLog[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_invoice_status_log_table');
			return;
		}
	},
	update_my_job_invoice_template_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobInvoiceTemplate === undefined) || (result.JobInvoiceTemplate === null) || (result.JobInvoiceTemplate.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobInvoiceTemplate.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_invoice_template WHERE id=' + result.JobInvoiceTemplate[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobInvoiceTemplate[i].created === temp_created) && ((result.JobInvoiceTemplate[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_invoice_template SET company_id=?,reference_number=?,name=?,description=?,is_custom=?,' + 'show_head_detail=?,show_abn=?,show_address=?,show_phone=?,show_fax=?,show_email=?,show_bsb=?,' + 'path=?,status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobInvoiceTemplate[i].id,
											((result.JobInvoiceTemplate[i].company_id != undefined) && (result.JobInvoiceTemplate[i].company_id != null)) ? result.JobInvoiceTemplate[i].company_id : 0, ((result.JobInvoiceTemplate[i].reference_number != undefined) && (result.JobInvoiceTemplate[i].reference_number != null)) ? result.JobInvoiceTemplate[i].reference_number : 0,
											((result.JobInvoiceTemplate[i].name != undefined) && (result.JobInvoiceTemplate[i].name != null)) ? result.JobInvoiceTemplate[i].name : '', ((result.JobInvoiceTemplate[i].description != undefined) && (result.JobInvoiceTemplate[i].description != null)) ? result.JobInvoiceTemplate[i].description : '',
											((result.JobInvoiceTemplate[i].is_custom != undefined) && (result.JobInvoiceTemplate[i].is_custom != null)) ? result.JobInvoiceTemplate[i].is_custom : 0, ((result.JobInvoiceTemplate[i].show_head_detail != undefined) && (result.JobInvoiceTemplate[i].show_head_detail != null)) ? result.JobInvoiceTemplate[i].show_head_detail : 0,
											((result.JobInvoiceTemplate[i].show_abn != undefined) && (result.JobInvoiceTemplate[i].show_abn != null)) ? result.JobInvoiceTemplate[i].show_abn : 0, ((result.JobInvoiceTemplate[i].show_address != undefined) && (result.JobInvoiceTemplate[i].show_address != null)) ? result.JobInvoiceTemplate[i].show_address : 0,
											((result.JobInvoiceTemplate[i].show_phone != undefined) && (result.JobInvoiceTemplate[i].show_phone != null)) ? result.JobInvoiceTemplate[i].show_phone : 0, ((result.JobInvoiceTemplate[i].show_fax != undefined) && (result.JobInvoiceTemplate[i].show_fax != null)) ? result.JobInvoiceTemplate[i].show_fax : 0,
											((result.JobInvoiceTemplate[i].show_email != undefined) && (result.JobInvoiceTemplate[i].show_email != null)) ? result.JobInvoiceTemplate[i].show_email : 0, ((result.JobInvoiceTemplate[i].show_bsb != undefined) && (result.JobInvoiceTemplate[i].show_bsb != null)) ? result.JobInvoiceTemplate[i].show_bsb : 0,
											((result.JobInvoiceTemplate[i].path != undefined) && (result.JobInvoiceTemplate[i].path != null)) ? result.JobInvoiceTemplate[i].path : '', ((result.JobInvoiceTemplate[i].status_code != undefined) && (result.JobInvoiceTemplate[i].status_code != null)) ? result.JobInvoiceTemplate[i].status_code : 0, 0,
											((result.JobInvoiceTemplate[i].created != undefined) && (result.JobInvoiceTemplate[i].created != null)) ? result.JobInvoiceTemplate[i].created : '', ((result.JobInvoiceTemplate[i].created_by != undefined) && (result.JobInvoiceTemplate[i].created_by != null)) ? result.JobInvoiceTemplate[i].created_by : 0,
											((result.JobInvoiceTemplate[i].modified_by != undefined) && (result.JobInvoiceTemplate[i].modified_by != null)) ? result.JobInvoiceTemplate[i].modified_by : 0, ((result.JobInvoiceTemplate[i].modified != undefined) && (result.JobInvoiceTemplate[i].modified != null)) ? result.JobInvoiceTemplate[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_invoice_template (id,company_id,reference_number,name,description,is_custom,' + 'show_head_detail,show_abn,show_address,show_phone,show_fax,show_email,show_bsb,' + 'path,status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobInvoiceTemplate[i].id != undefined) && (result.JobInvoiceTemplate[i].id != null)) ? result.JobInvoiceTemplate[i].id : 0,
										((result.JobInvoiceTemplate[i].company_id != undefined) && (result.JobInvoiceTemplate[i].company_id != null)) ? result.JobInvoiceTemplate[i].company_id : 0, ((result.JobInvoiceTemplate[i].reference_number != undefined) && (result.JobInvoiceTemplate[i].reference_number != null)) ? result.JobInvoiceTemplate[i].reference_number : 0,
										((result.JobInvoiceTemplate[i].name != undefined) && (result.JobInvoiceTemplate[i].name != null)) ? result.JobInvoiceTemplate[i].name : '', ((result.JobInvoiceTemplate[i].description != undefined) && (result.JobInvoiceTemplate[i].description != null)) ? result.JobInvoiceTemplate[i].description : '',
										((result.JobInvoiceTemplate[i].is_custom != undefined) && (result.JobInvoiceTemplate[i].is_custom != null)) ? result.JobInvoiceTemplate[i].is_custom : 0, ((result.JobInvoiceTemplate[i].show_head_detail != undefined) && (result.JobInvoiceTemplate[i].show_head_detail != null)) ? result.JobInvoiceTemplate[i].show_head_detail : 0,
										((result.JobInvoiceTemplate[i].show_abn != undefined) && (result.JobInvoiceTemplate[i].show_abn != null)) ? result.JobInvoiceTemplate[i].show_abn : 0, ((result.JobInvoiceTemplate[i].show_address != undefined) && (result.JobInvoiceTemplate[i].show_address != null)) ? result.JobInvoiceTemplate[i].show_address : 0,
										((result.JobInvoiceTemplate[i].show_phone != undefined) && (result.JobInvoiceTemplate[i].show_phone != null)) ? result.JobInvoiceTemplate[i].show_phone : 0, ((result.JobInvoiceTemplate[i].show_fax != undefined) && (result.JobInvoiceTemplate[i].show_fax != null)) ? result.JobInvoiceTemplate[i].show_fax : 0,
										((result.JobInvoiceTemplate[i].show_email != undefined) && (result.JobInvoiceTemplate[i].show_email != null)) ? result.JobInvoiceTemplate[i].show_email : 0, ((result.JobInvoiceTemplate[i].show_bsb != undefined) && (result.JobInvoiceTemplate[i].show_bsb != null)) ? result.JobInvoiceTemplate[i].show_bsb : 0,
										((result.JobInvoiceTemplate[i].path != undefined) && (result.JobInvoiceTemplate[i].path != null)) ? result.JobInvoiceTemplate[i].path : '', ((result.JobInvoiceTemplate[i].status_code != undefined) && (result.JobInvoiceTemplate[i].status_code != null)) ? result.JobInvoiceTemplate[i].status_code : 0, 0,
										((result.JobInvoiceTemplate[i].created != undefined) && (result.JobInvoiceTemplate[i].created != null)) ? result.JobInvoiceTemplate[i].created : '', ((result.JobInvoiceTemplate[i].created_by != undefined) && (result.JobInvoiceTemplate[i].created_by != null)) ? result.JobInvoiceTemplate[i].created_by : 0,
										((result.JobInvoiceTemplate[i].modified_by != undefined) && (result.JobInvoiceTemplate[i].modified_by != null)) ? result.JobInvoiceTemplate[i].modified_by : 0, ((result.JobInvoiceTemplate[i].modified != undefined) && (result.JobInvoiceTemplate[i].modified != null)) ? result.JobInvoiceTemplate[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_invoice_template_table');
			return;
		}
	},
	// quote invoice table
	update_my_quote_invoice_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuotePrint === undefined) || (result.QuotePrint === null) || (result.QuotePrint.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuotePrint.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_invoice WHERE id=' + result.QuotePrint[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuotePrint[i].created === temp_created) && ((result.QuotePrint[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_invoice SET local_id=?,company_id=?,reference_number=?,quote_id=?,total_amount=?,payment_comments=?,' + 'path=?,is_merge_signature=?,quote_invoice_status_code=?,quote_invoice_template_id=?,invoice_date=?,' + 'description=?,mark_up=?,discount=?,hidematerial=?,status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.QuotePrint[i].id,
											((result.QuotePrint[i].local_id != undefined) && (result.QuotePrint[i].local_id != null)) ? result.QuotePrint[i].local_id : '', ((result.QuotePrint[i].company_id != undefined) && (result.QuotePrint[i].company_id != null)) ? result.QuotePrint[i].company_id : 0, ((result.QuotePrint[i].reference_number != undefined) && (result.QuotePrint[i].reference_number != null)) ? result.QuotePrint[i].reference_number : 0,
											((result.QuotePrint[i].quote_id != undefined) && (result.QuotePrint[i].quote_id != null)) ? result.QuotePrint[i].quote_id : 0, ((result.QuotePrint[i].total_amount != undefined) && (result.QuotePrint[i].total_amount != null)) ? result.QuotePrint[i].total_amount : 0, ((result.QuotePrint[i].quote_comments != undefined) && (result.QuotePrint[i].quote_comments != null)) ? result.QuotePrint[i].quote_comments : '',
											((result.QuotePrint[i].path != undefined) && (result.QuotePrint[i].path != null)) ? result.QuotePrint[i].path : '', ((result.QuotePrint[i].is_merge_signature != undefined) && (result.QuotePrint[i].is_merge_signature != null)) ? result.QuotePrint[i].is_merge_signature : 0,
											((result.QuotePrint[i].quote_print_status_code != undefined) && (result.QuotePrint[i].quote_print_status_code != null)) ? result.QuotePrint[i].quote_print_status_code : 0, ((result.QuotePrint[i].quote_print_template_id != undefined) && (result.QuotePrint[i].quote_print_template_id != null)) ? result.QuotePrint[i].quote_print_template_id : 0,
											((result.QuotePrint[i].quote_date != undefined) && (result.QuotePrint[i].quote_date != null)) ? result.QuotePrint[i].quote_date : '', ((result.QuotePrint[i].description != undefined) && (result.QuotePrint[i].description != null)) ? result.QuotePrint[i].description : '', ((result.QuotePrint[i].mark_up != undefined) && (result.QuotePrint[i].mark_up != null)) ? result.QuotePrint[i].mark_up : 0,
											((result.QuotePrint[i].discount != undefined) && (result.QuotePrint[i].discount != null)) ? result.QuotePrint[i].discount : 0, ((result.QuotePrint[i].hidematerial != undefined) && (result.QuotePrint[i].hidematerial != null)) ? result.QuotePrint[i].hidematerial : 0, ((result.QuotePrint[i].status_code != undefined) && (result.QuotePrint[i].status_code != null)) ? result.QuotePrint[i].status_code : 0, 0,
											((result.QuotePrint[i].created != undefined) && (result.QuotePrint[i].created != null)) ? result.QuotePrint[i].created : '', ((result.QuotePrint[i].created_by != undefined) && (result.QuotePrint[i].created_by != null)) ? result.QuotePrint[i].created_by : 0, ((result.QuotePrint[i].modified_by != undefined) && (result.QuotePrint[i].modified_by != null)) ? result.QuotePrint[i].modified_by : 0,
											((result.QuotePrint[i].modified != undefined) && (result.QuotePrint[i].modified != null)) ? result.QuotePrint[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_invoice (id,local_id,company_id,reference_number,quote_id,total_amount,payment_comments,' + 'path,is_merge_signature,quote_invoice_status_code,quote_invoice_template_id,invoice_date,' + 'description,mark_up,discount,hidematerial,status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
										((result.QuotePrint[i].id != undefined) && (result.QuotePrint[i].id != null)) ? result.QuotePrint[i].id : 0, ((result.QuotePrint[i].local_id != undefined) && (result.QuotePrint[i].local_id != null)) ? result.QuotePrint[i].local_id : '', ((result.QuotePrint[i].company_id != undefined) && (result.QuotePrint[i].company_id != null)) ? result.QuotePrint[i].company_id : 0,
										((result.QuotePrint[i].reference_number != undefined) && (result.QuotePrint[i].reference_number != null)) ? result.QuotePrint[i].reference_number : 0, ((result.QuotePrint[i].quote_id != undefined) && (result.QuotePrint[i].quote_id != null)) ? result.QuotePrint[i].quote_id : 0, ((result.QuotePrint[i].total_amount != undefined) && (result.QuotePrint[i].total_amount != null)) ? result.QuotePrint[i].total_amount : 0,
										((result.QuotePrint[i].quote_comments != undefined) && (result.QuotePrint[i].quote_comments != null)) ? result.QuotePrint[i].quote_comments : '', ((result.QuotePrint[i].path != undefined) && (result.QuotePrint[i].path != null)) ? result.QuotePrint[i].path : '', ((result.QuotePrint[i].is_merge_signature != undefined) && (result.QuotePrint[i].is_merge_signature != null)) ? result.QuotePrint[i].is_merge_signature : 0,
										((result.QuotePrint[i].quote_print_status_code != undefined) && (result.QuotePrint[i].quote_print_status_code != null)) ? result.QuotePrint[i].quote_print_status_code : 0, ((result.QuotePrint[i].quote_print_template_id != undefined) && (result.QuotePrint[i].quote_print_template_id != null)) ? result.QuotePrint[i].quote_print_template_id : 0,
										((result.QuotePrint[i].quote_date != undefined) && (result.QuotePrint[i].quote_date != null)) ? result.QuotePrint[i].quote_date : '', ((result.QuotePrint[i].description != undefined) && (result.QuotePrint[i].description != null)) ? result.QuotePrint[i].description : '', ((result.QuotePrint[i].mark_up != undefined) && (result.QuotePrint[i].mark_up != null)) ? result.QuotePrint[i].mark_up : 0,
										((result.QuotePrint[i].discount != undefined) && (result.QuotePrint[i].discount != null)) ? result.QuotePrint[i].discount : 0, ((result.QuotePrint[i].hidematerial != undefined) && (result.QuotePrint[i].hidematerial != null)) ? result.QuotePrint[i].hidematerial : 0, ((result.QuotePrint[i].status_code != undefined) && (result.QuotePrint[i].status_code != null)) ? result.QuotePrint[i].status_code : 0, 0,
										((result.QuotePrint[i].created != undefined) && (result.QuotePrint[i].created != null)) ? result.QuotePrint[i].created : '', ((result.QuotePrint[i].created_by != undefined) && (result.QuotePrint[i].created_by != null)) ? result.QuotePrint[i].created_by : 0, ((result.QuotePrint[i].modified_by != undefined) && (result.QuotePrint[i].modified_by != null)) ? result.QuotePrint[i].modified_by : 0,
										((result.QuotePrint[i].modified != undefined) && (result.QuotePrint[i].modified != null)) ? result.QuotePrint[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_invoice_table');
			return;
		}
	},
	update_my_quote_invoice_status_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuotePrintStatusCode === undefined) || (result.QuotePrintStatusCode === null) || (result.QuotePrintStatusCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_quote_invoice_status_code');
				for (var i = 0, j = result.QuotePrintStatusCode.length; i < j; i++) {
					db.execute('INSERT INTO my_quote_invoice_status_code (code,name,description,abbr)VALUES(?,?,?,?)', ((result.QuotePrintStatusCode[i].code != undefined) && (result.QuotePrintStatusCode[i].code != null)) ? result.QuotePrintStatusCode[i].code : 0, ((result.QuotePrintStatusCode[i].name != undefined) && (result.QuotePrintStatusCode[i].name != null)) ? result.QuotePrintStatusCode[i].name : '',
									((result.QuotePrintStatusCode[i].description != undefined) && (result.QuotePrintStatusCode[i].description != null)) ? result.QuotePrintStatusCode[i].description : '', ((result.QuotePrintStatusCode[i].abbr != undefined) && (result.QuotePrintStatusCode[i].abbr != null)) ? result.QuotePrintStatusCode[i].abbr : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_invoice_status_code_table');
			return;
		}
	},
	update_my_quote_invoice_template_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuotePrintTemplate === undefined) || (result.QuotePrintTemplate === null) || (result.QuotePrintTemplate.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuotePrintTemplate.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_invoice_template WHERE id=' + result.QuotePrintTemplate[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuotePrintTemplate[i].created === temp_created) && ((result.QuotePrintTemplate[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_invoice_template SET company_id=?,reference_number=?,name=?,description=?,' + 'path=?,status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.QuotePrintTemplate[i].id, ((result.QuotePrintTemplate[i].company_id != undefined) && (result.QuotePrintTemplate[i].company_id != null)) ? result.QuotePrintTemplate[i].company_id : 0,
											((result.QuotePrintTemplate[i].reference_number != undefined) && (result.QuotePrintTemplate[i].reference_number != null)) ? result.QuotePrintTemplate[i].reference_number : 0, ((result.QuotePrintTemplate[i].name != undefined) && (result.QuotePrintTemplate[i].name != null)) ? result.QuotePrintTemplate[i].name : '',
											((result.QuotePrintTemplate[i].description != undefined) && (result.QuotePrintTemplate[i].description != null)) ? result.QuotePrintTemplate[i].description : '', ((result.QuotePrintTemplate[i].path != undefined) && (result.QuotePrintTemplate[i].path != null)) ? result.QuotePrintTemplate[i].path : '',
											((result.QuotePrintTemplate[i].status_code != undefined) && (result.QuotePrintTemplate[i].status_code != null)) ? result.QuotePrintTemplate[i].status_code : 0, 0, ((result.QuotePrintTemplate[i].created != undefined) && (result.QuotePrintTemplate[i].created != null)) ? result.QuotePrintTemplate[i].created : '',
											((result.QuotePrintTemplate[i].created_by != undefined) && (result.QuotePrintTemplate[i].created_by != null)) ? result.QuotePrintTemplate[i].created_by : 0, ((result.QuotePrintTemplate[i].modified_by != undefined) && (result.QuotePrintTemplate[i].modified_by != null)) ? result.QuotePrintTemplate[i].modified_by : 0,
											((result.QuotePrintTemplate[i].modified != undefined) && (result.QuotePrintTemplate[i].modified != null)) ? result.QuotePrintTemplate[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_invoice_template (id,company_id,reference_number,name,description,' + 'path,status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', ((result.QuotePrintTemplate[i].id != undefined) && (result.QuotePrintTemplate[i].id != null)) ? result.QuotePrintTemplate[i].id : 0,
										((result.QuotePrintTemplate[i].company_id != undefined) && (result.QuotePrintTemplate[i].company_id != null)) ? result.QuotePrintTemplate[i].company_id : 0, ((result.QuotePrintTemplate[i].reference_number != undefined) && (result.QuotePrintTemplate[i].reference_number != null)) ? result.QuotePrintTemplate[i].reference_number : 0,
										((result.QuotePrintTemplate[i].name != undefined) && (result.QuotePrintTemplate[i].name != null)) ? result.QuotePrintTemplate[i].name : '', ((result.QuotePrintTemplate[i].description != undefined) && (result.QuotePrintTemplate[i].description != null)) ? result.QuotePrintTemplate[i].description : '',
										((result.QuotePrintTemplate[i].path != undefined) && (result.QuotePrintTemplate[i].path != null)) ? result.QuotePrintTemplate[i].path : '', ((result.QuotePrintTemplate[i].status_code != undefined) && (result.QuotePrintTemplate[i].status_code != null)) ? result.QuotePrintTemplate[i].status_code : 0, 0,
										((result.QuotePrintTemplate[i].created != undefined) && (result.QuotePrintTemplate[i].created != null)) ? result.QuotePrintTemplate[i].created : '', ((result.QuotePrintTemplate[i].created_by != undefined) && (result.QuotePrintTemplate[i].created_by != null)) ? result.QuotePrintTemplate[i].created_by : 0,
										((result.QuotePrintTemplate[i].modified_by != undefined) && (result.QuotePrintTemplate[i].modified_by != null)) ? result.QuotePrintTemplate[i].modified_by : 0, ((result.QuotePrintTemplate[i].modified != undefined) && (result.ManagerUserEmailSignature[i].modified != null)) ? result.ManagerUserEmailSignature[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_invoice_template_table');
			return;
		}
	},
	// email signature
	update_my_manager_user_email_signature_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.ManagerUserEmailSignature === undefined) || (result.ManagerUserEmailSignature === null) || (result.ManagerUserEmailSignature.length <= 0)) {
			} else {
				for (var i = 0, j = result.ManagerUserEmailSignature.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_manager_user_email_signature WHERE id=' + result.ManagerUserEmailSignature[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.ManagerUserEmailSignature[i].created === temp_created) && ((result.ManagerUserEmailSignature[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_manager_user_email_signature SET local_id=?,manager_user_id=?,title=?,signature=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.ManagerUserEmailSignature[i].id, ((result.ManagerUserEmailSignature[i].local_id != undefined) && (result.ManagerUserEmailSignature[i].local_id != null)) ? result.ManagerUserEmailSignature[i].local_id : 0,
											((result.ManagerUserEmailSignature[i].manager_user_id != undefined) && (result.ManagerUserEmailSignature[i].manager_user_id != null)) ? result.ManagerUserEmailSignature[i].manager_user_id : 0, ((result.ManagerUserEmailSignature[i].title != undefined) && (result.ManagerUserEmailSignature[i].title != null)) ? result.ManagerUserEmailSignature[i].title : '',
											((result.ManagerUserEmailSignature[i].signature != undefined) && (result.ManagerUserEmailSignature[i].signature != null)) ? result.ManagerUserEmailSignature[i].signature : '', ((result.ManagerUserEmailSignature[i].status_code != undefined) && (result.ManagerUserEmailSignature[i].status_code != null)) ? result.ManagerUserEmailSignature[i].status_code : 0, 0,
											((result.ManagerUserEmailSignature[i].created != undefined) && (result.ManagerUserEmailSignature[i].created != null)) ? result.ManagerUserEmailSignature[i].created : '', ((result.ManagerUserEmailSignature[i].created_by != undefined) && (result.ManagerUserEmailSignature[i].created_by != null)) ? result.ManagerUserEmailSignature[i].created_by : 0,
											((result.ManagerUserEmailSignature[i].modified_by != undefined) && (result.ManagerUserEmailSignature[i].modified_by != null)) ? result.ManagerUserEmailSignature[i].modified_by : 0, ((result.ManagerUserEmailSignature[i].modified != undefined) && (result.ManagerUserEmailSignature[i].modified != null)) ? result.ManagerUserEmailSignature[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_manager_user_email_signature (id,local_id,manager_user_id,title,signature,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?)', ((result.ManagerUserEmailSignature[i].id != undefined) && (result.ManagerUserEmailSignature[i].id != null)) ? result.ManagerUserEmailSignature[i].id : 0,
										((result.ManagerUserEmailSignature[i].local_id != undefined) && (result.ManagerUserEmailSignature[i].local_id != null)) ? result.ManagerUserEmailSignature[i].local_id : 0, ((result.ManagerUserEmailSignature[i].manager_user_id != undefined) && (result.ManagerUserEmailSignature[i].manager_user_id != null)) ? result.ManagerUserEmailSignature[i].manager_user_id : 0,
										((result.ManagerUserEmailSignature[i].title != undefined) && (result.ManagerUserEmailSignature[i].title != null)) ? result.ManagerUserEmailSignature[i].title : '', ((result.ManagerUserEmailSignature[i].signature != undefined) && (result.ManagerUserEmailSignature[i].signature != null)) ? result.ManagerUserEmailSignature[i].signature : '',
										((result.ManagerUserEmailSignature[i].status_code != undefined) && (result.ManagerUserEmailSignature[i].status_code != null)) ? result.ManagerUserEmailSignature[i].status_code : 0, 0, ((result.ManagerUserEmailSignature[i].created != undefined) && (result.ManagerUserEmailSignature[i].created != null)) ? result.ManagerUserEmailSignature[i].created : '',
										((result.ManagerUserEmailSignature[i].created_by != undefined) && (result.ManagerUserEmailSignature[i].created_by != null)) ? result.ManagerUserEmailSignature[i].created_by : 0, ((result.ManagerUserEmailSignature[i].modified_by != undefined) && (result.ManagerUserEmailSignature[i].modified_by != null)) ? result.ManagerUserEmailSignature[i].modified_by : 0,
										((result.ManagerUserEmailSignature[i].modified != undefined) && (result.ManagerUserEmailSignature[i].modified != null)) ? result.ManagerUserEmailSignature[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_manager_user_email_signature_table');
			return;
		}
	},
	update_my_materials_locations_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.MaterialsLocations === undefined) || (result.MaterialsLocations === null) || (result.MaterialsLocations.length <= 0)) {
			} else {
				for (var i = 0, j = result.MaterialsLocations.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_materials_locations WHERE id=' + result.MaterialsLocations[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.MaterialsLocations[i].created === temp_created) && ((result.MaterialsLocations[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_materials_locations SET company_id=?,reference_number=?,name=?,description=?,sub_number=?,unit_number=?,street_number=?,' + 'street=?,street_type=?,locality_street_type_id=?,postcode=?,suburb=?,locality_suburb_id=?,locality_state_id=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.MaterialsLocations[i].id,
											((result.MaterialsLocations[i].company_id != undefined) && (result.MaterialsLocations[i].company_id != null)) ? result.MaterialsLocations[i].company_id : 0, ((result.MaterialsLocations[i].reference_number != undefined) && (result.MaterialsLocations[i].reference_number != null)) ? result.MaterialsLocations[i].reference_number : 0,
											((result.MaterialsLocations[i].name != undefined) && (result.MaterialsLocations[i].name != null)) ? result.MaterialsLocations[i].name : '', ((result.MaterialsLocations[i].description != undefined) && (result.MaterialsLocations[i].description != null)) ? result.MaterialsLocations[i].description : '',
											((result.MaterialsLocations[i].sub_number != undefined) && (result.MaterialsLocations[i].sub_number != null)) ? result.MaterialsLocations[i].sub_number : '', ((result.MaterialsLocations[i].unit_number != undefined) && (result.MaterialsLocations[i].unit_number != null)) ? result.MaterialsLocations[i].unit_number : '',
											((result.MaterialsLocations[i].street_number != undefined) && (result.MaterialsLocations[i].street_number != null)) ? result.MaterialsLocations[i].street_number : '', ((result.MaterialsLocations[i].street != undefined) && (result.MaterialsLocations[i].street != null)) ? result.MaterialsLocations[i].street : '',
											((result.MaterialsLocations[i].street_type != undefined) && (result.MaterialsLocations[i].street_type != null)) ? result.MaterialsLocations[i].street_type : '', ((result.MaterialsLocations[i].locality_street_type_id != undefined) && (result.MaterialsLocations[i].locality_street_type_id != null)) ? result.MaterialsLocations[i].locality_street_type_id : 0,
											((result.MaterialsLocations[i].postcode != undefined) && (result.MaterialsLocations[i].postcode != null)) ? result.MaterialsLocations[i].postcode : '', ((result.MaterialsLocations[i].suburb != undefined) && (result.MaterialsLocations[i].suburb != null)) ? result.MaterialsLocations[i].suburb : '',
											((result.MaterialsLocations[i].locality_suburb_id != undefined) && (result.MaterialsLocations[i].locality_suburb_id != null)) ? result.MaterialsLocations[i].locality_suburb_id : 0, ((result.MaterialsLocations[i].locality_state_id != undefined) && (result.MaterialsLocations[i].locality_state_id != null)) ? result.MaterialsLocations[i].locality_state_id : 0,
											((result.MaterialsLocations[i].status_code != undefined) && (result.MaterialsLocations[i].status_code != null)) ? result.MaterialsLocations[i].status_code : 0, 0, ((result.MaterialsLocations[i].created != undefined) && (result.MaterialsLocations[i].created != null)) ? result.MaterialsLocations[i].created : '',
											((result.MaterialsLocations[i].created_by != undefined) && (result.MaterialsLocations[i].created_by != null)) ? result.MaterialsLocations[i].created_by : 0, ((result.MaterialsLocations[i].modified_by != undefined) && (result.MaterialsLocations[i].modified_by != null)) ? result.MaterialsLocations[i].modified_by : 0,
											((result.MaterialsLocations[i].modified != undefined) && (result.MaterialsLocations[i].modified != null)) ? result.MaterialsLocations[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_materials_locations (id,company_id,reference_number,name,description,sub_number,' + 'unit_number,street_number,street,street_type,locality_street_type_id,postcode,suburb,locality_suburb_id,locality_state_id,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
										((result.MaterialsLocations[i].id != undefined) && (result.MaterialsLocations[i].id != null)) ? result.MaterialsLocations[i].id : 0, ((result.MaterialsLocations[i].company_id != undefined) && (result.MaterialsLocations[i].company_id != null)) ? result.MaterialsLocations[i].company_id : 0,
										((result.MaterialsLocations[i].reference_number != undefined) && (result.MaterialsLocations[i].reference_number != null)) ? result.MaterialsLocations[i].reference_number : 0, ((result.MaterialsLocations[i].name != undefined) && (result.MaterialsLocations[i].name != null)) ? result.MaterialsLocations[i].name : '',
										((result.MaterialsLocations[i].description != undefined) && (result.MaterialsLocations[i].description != null)) ? result.MaterialsLocations[i].description : '', ((result.MaterialsLocations[i].sub_number != undefined) && (result.MaterialsLocations[i].sub_number != null)) ? result.MaterialsLocations[i].sub_number : '',
										((result.MaterialsLocations[i].unit_number != undefined) && (result.MaterialsLocations[i].unit_number != null)) ? result.MaterialsLocations[i].unit_number : '', ((result.MaterialsLocations[i].street_number != undefined) && (result.MaterialsLocations[i].street_number != null)) ? result.MaterialsLocations[i].street_number : '',
										((result.MaterialsLocations[i].street != undefined) && (result.MaterialsLocations[i].street != null)) ? result.MaterialsLocations[i].street : '', ((result.MaterialsLocations[i].street_type != undefined) && (result.MaterialsLocations[i].street_type != null)) ? result.MaterialsLocations[i].street_type : '',
										((result.MaterialsLocations[i].locality_street_type_id != undefined) && (result.MaterialsLocations[i].locality_street_type_id != null)) ? result.MaterialsLocations[i].locality_street_type_id : 0, ((result.MaterialsLocations[i].postcode != undefined) && (result.MaterialsLocations[i].postcode != null)) ? result.MaterialsLocations[i].postcode : '',
										((result.MaterialsLocations[i].suburb != undefined) && (result.MaterialsLocations[i].suburb != null)) ? result.MaterialsLocations[i].suburb : '', ((result.MaterialsLocations[i].locality_suburb_id != undefined) && (result.MaterialsLocations[i].locality_suburb_id != null)) ? result.MaterialsLocations[i].locality_suburb_id : 0,
										((result.MaterialsLocations[i].locality_state_id != undefined) && (result.MaterialsLocations[i].locality_state_id != null)) ? result.MaterialsLocations[i].locality_state_id : 0, ((result.MaterialsLocations[i].status_code != undefined) && (result.MaterialsLocations[i].status_code != null)) ? result.MaterialsLocations[i].status_code : 0, 0,
										((result.MaterialsLocations[i].created != undefined) && (result.MaterialsLocations[i].created != null)) ? result.MaterialsLocations[i].created : '', ((result.MaterialsLocations[i].created_by != undefined) && (result.MaterialsLocations[i].created_by != null)) ? result.MaterialsLocations[i].created_by : 0,
										((result.MaterialsLocations[i].modified_by != undefined) && (result.MaterialsLocations[i].modified_by != null)) ? result.MaterialsLocations[i].modified_by : 0, ((result.MaterialsLocations[i].modified != undefined) && (result.MaterialsLocations[i].modified != null)) ? result.MaterialsLocations[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_materials_locations_table');
			return;
		}
	},
	update_my_materials_stocks_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.MaterialsStocks === undefined) || (result.MaterialsStocks === null) || (result.MaterialsStocks.length <= 0)) {
			} else {
				for (var i = 0, j = result.MaterialsStocks.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_materials_stocks WHERE id=' + result.MaterialsStocks[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.MaterialsStocks[i].created === temp_created) && ((result.MaterialsStocks[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_materials_stocks SET company_id=?,reference_number=?,job_library_item_id=?,materials_locations_id=?,amount=?,description=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.MaterialsStocks[i].id, ((result.MaterialsStocks[i].company_id != undefined) && (result.MaterialsStocks[i].company_id != null)) ? result.MaterialsStocks[i].company_id : 0,
											((result.MaterialsStocks[i].reference_number != undefined) && (result.MaterialsStocks[i].reference_number != null)) ? result.MaterialsStocks[i].reference_number : 0, ((result.MaterialsStocks[i].job_library_item_id != undefined) && (result.MaterialsStocks[i].job_library_item_id != null)) ? result.MaterialsStocks[i].job_library_item_id : 0,
											((result.MaterialsStocks[i].materials_locations_id != undefined) && (result.MaterialsStocks[i].materials_locations_id != null)) ? result.MaterialsStocks[i].materials_locations_id : 0, ((result.MaterialsStocks[i].amount != undefined) && (result.MaterialsStocks[i].amount != null)) ? result.MaterialsStocks[i].amount : 0,
											((result.MaterialsStocks[i].description != undefined) && (result.MaterialsStocks[i].description != null)) ? result.MaterialsStocks[i].description : '', ((result.MaterialsStocks[i].status_code != undefined) && (result.MaterialsStocks[i].status_code != null)) ? result.MaterialsStocks[i].status_code : 0, 0,
											((result.MaterialsStocks[i].created != undefined) && (result.MaterialsStocks[i].created != null)) ? result.MaterialsStocks[i].created : '', ((result.MaterialsStocks[i].created_by != undefined) && (result.MaterialsStocks[i].created_by != null)) ? result.MaterialsStocks[i].created_by : 0,
											((result.MaterialsStocks[i].modified_by != undefined) && (result.MaterialsStocks[i].modified_by != null)) ? result.MaterialsStocks[i].modified_by : 0, ((result.MaterialsStocks[i].modified != undefined) && (result.MaterialsStocks[i].modified != null)) ? result.MaterialsStocks[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_materials_stocks (id,company_id,reference_number,job_library_item_id,materials_locations_id,amount,description,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.MaterialsStocks[i].id != undefined) && (result.MaterialsStocks[i].id != null)) ? result.MaterialsStocks[i].id : 0,
										((result.MaterialsStocks[i].company_id != undefined) && (result.MaterialsStocks[i].company_id != null)) ? result.MaterialsStocks[i].company_id : 0, ((result.MaterialsStocks[i].reference_number != undefined) && (result.MaterialsStocks[i].reference_number != null)) ? result.MaterialsStocks[i].reference_number : 0,
										((result.MaterialsStocks[i].job_library_item_id != undefined) && (result.MaterialsStocks[i].job_library_item_id != null)) ? result.MaterialsStocks[i].job_library_item_id : 0, ((result.MaterialsStocks[i].materials_locations_id != undefined) && (result.MaterialsStocks[i].materials_locations_id != null)) ? result.MaterialsStocks[i].materials_locations_id : 0,
										((result.MaterialsStocks[i].amount != undefined) && (result.MaterialsStocks[i].amount != null)) ? result.MaterialsStocks[i].amount : 0, ((result.MaterialsStocks[i].description != undefined) && (result.MaterialsStocks[i].description != null)) ? result.MaterialsStocks[i].description : '',
										((result.MaterialsStocks[i].status_code != undefined) && (result.MaterialsStocks[i].status_code != null)) ? result.MaterialsStocks[i].status_code : 0, 0, ((result.MaterialsStocks[i].created != undefined) && (result.MaterialsStocks[i].created != null)) ? result.MaterialsStocks[i].created : '',
										((result.MaterialsStocks[i].created_by != undefined) && (result.MaterialsStocks[i].created_by != null)) ? result.MaterialsStocks[i].created_by : 0, ((result.MaterialsStocks[i].modified_by != undefined) && (result.MaterialsStocks[i].modified_by != null)) ? result.MaterialsStocks[i].modified_by : 0,
										((result.MaterialsStocks[i].modified != undefined) && (result.MaterialsStocks[i].modified != null)) ? result.MaterialsStocks[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_materials_stocks_table');
			return;
		}
	},
	// manager user mobile code
	update_my_manager_user_mobile_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.ManagerUserMobileCode === undefined) || (result.ManagerUserMobileCode === null) || (result.ManagerUserMobileCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_manager_user_mobile_code');
				for (var i = 0, j = result.ManagerUserMobileCode.length; i < j; i++) {
					db.execute('INSERT INTO my_manager_user_mobile_code (code,name,description,abbr)VALUES(?,?,?,?)', ((result.ManagerUserMobileCode[i].code != undefined) && (result.ManagerUserMobileCode[i].code != null)) ? result.ManagerUserMobileCode[i].code : 0, ((result.ManagerUserMobileCode[i].name != undefined) && (result.ManagerUserMobileCode[i].name != null)) ? result.ManagerUserMobileCode[i].name : '',
									((result.ManagerUserMobileCode[i].description != undefined) && (result.ManagerUserMobileCode[i].description != null)) ? result.ManagerUserMobileCode[i].description : '', ((result.ManagerUserMobileCode[i].abbr != undefined) && (result.ManagerUserMobileCode[i].abbr != null)) ? result.ManagerUserMobileCode[i].abbr : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_manager_user_mobile_code_table');
			return;
		}
	},
	update_my_manager_user_mobile_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.ManagerUserMobile === undefined) || (result.ManagerUserMobile === null) || (result.ManagerUserMobile.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_manager_user_mobile');
				for (var i = 0, j = result.ManagerUserMobile.length; i < j; i++) {
					db.execute('INSERT INTO my_manager_user_mobile (system_id,mobile_code,manager_user_id,' + 'status_code,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?)', ((result.ManagerUserMobile[i].id != undefined) && (result.ManagerUserMobile[i].id != null)) ? result.ManagerUserMobile[i].id : 0,
									((result.ManagerUserMobile[i].mobile_code != undefined) && (result.ManagerUserMobile[i].mobile_code != null)) ? result.ManagerUserMobile[i].mobile_code : 0, ((result.ManagerUserMobile[i].manager_user_id != undefined) && (result.ManagerUserMobile[i].manager_user_id != null)) ? result.ManagerUserMobile[i].manager_user_id : 0,
									((result.ManagerUserMobile[i].status_code != undefined) && (result.ManagerUserMobile[i].status_code != null)) ? result.ManagerUserMobile[i].status_code : 0, ((result.ManagerUserMobile[i].created != undefined) && (result.ManagerUserMobile[i].created != null)) ? result.ManagerUserMobile[i].created : '',
									((result.ManagerUserMobile[i].created_by != undefined) && (result.ManagerUserMobile[i].created_by != null)) ? result.ManagerUserMobile[i].created_by : 0, ((result.ManagerUserMobile[i].modified_by != undefined) && (result.ManagerUserMobile[i].modified_by != null)) ? result.ManagerUserMobile[i].modified_by : 0,
									((result.ManagerUserMobile[i].modified != undefined) && (result.ManagerUserMobile[i].modified != null)) ? result.ManagerUserMobile[i].modified : '');
				}
				Ti.App.Properties.setBool('refresh_modules_list', true);
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_manager_user_mobile_table');
			return;
		}
	},
	// job invoice signature table.
	update_my_job_invoice_signature_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobInvoiceSignature === undefined) || (result.JobInvoiceSignature === null) || (result.JobInvoiceSignature.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobInvoiceSignature.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_invoice_signature WHERE id=' + result.JobInvoiceSignature[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobInvoiceSignature[i].created === temp_created) && ((result.JobInvoiceSignature[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_invoice_signature SET local_id=?,job_id=?,job_invoice_id=?,client_name=?,path=?,time=?,mime_type=?,width=?,height=?,file_size=?,is_local_record=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobInvoiceSignature[i].id,
											((result.JobInvoiceSignature[i].local_id != undefined) && (result.JobInvoiceSignature[i].local_id != null)) ? result.JobInvoiceSignature[i].local_id : '', ((result.JobInvoiceSignature[i].job_id != undefined) && (result.JobInvoiceSignature[i].job_id != null)) ? result.JobInvoiceSignature[i].job_id : 0,
											((result.JobInvoiceSignature[i].job_invoice_id != undefined) && (result.JobInvoiceSignature[i].job_invoice_id != null)) ? result.JobInvoiceSignature[i].job_invoice_id : 0, ((result.JobInvoiceSignature[i].client_name != undefined) && (result.JobInvoiceSignature[i].client_name != null)) ? result.JobInvoiceSignature[i].client_name : '',
											((result.JobInvoiceSignature[i].path != undefined) && (result.JobInvoiceSignature[i].path != null)) ? result.JobInvoiceSignature[i].path : '', ((result.JobInvoiceSignature[i].time != undefined) && (result.JobInvoiceSignature[i].time != null)) ? result.JobInvoiceSignature[i].time : '',
											((result.JobInvoiceSignature[i].mime_type != undefined) && (result.JobInvoiceSignature[i].mime_type != null)) ? result.JobInvoiceSignature[i].mime_type : '', ((result.JobInvoiceSignature[i].width != undefined) && (result.JobInvoiceSignature[i].width != null)) ? result.JobInvoiceSignature[i].width : 0,
											((result.JobInvoiceSignature[i].height != undefined) && (result.JobInvoiceSignature[i].height != null)) ? result.JobInvoiceSignature[i].height : 0, ((result.JobInvoiceSignature[i].file_size != undefined) && (result.JobInvoiceSignature[i].file_size != null)) ? result.JobInvoiceSignature[i].file_size : 0, 0,
											((result.JobInvoiceSignature[i].status_code != undefined) && (result.JobInvoiceSignature[i].status_code != null)) ? result.JobInvoiceSignature[i].status_code : 0, 0, ((result.JobInvoiceSignature[i].created != undefined) && (result.JobInvoiceSignature[i].created != null)) ? result.JobInvoiceSignature[i].created : '',
											((result.JobInvoiceSignature[i].created_by != undefined) && (result.JobInvoiceSignature[i].created_by != null)) ? result.JobInvoiceSignature[i].created_by : 0, ((result.JobInvoiceSignature[i].modified_by != undefined) && (result.JobInvoiceSignature[i].modified_by != null)) ? result.JobInvoiceSignature[i].modified_by : 0,
											((result.JobInvoiceSignature[i].modified != undefined) && (result.JobInvoiceSignature[i].modified != null)) ? result.JobInvoiceSignature[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_invoice_signature (id,local_id,job_id,job_invoice_id,client_name,path,time,mime_type,width,height,file_size,is_local_record,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobInvoiceSignature[i].id != undefined) && (result.JobInvoiceSignature[i].id != null)) ? result.JobInvoiceSignature[i].id : 0,
										((result.JobInvoiceSignature[i].local_id != undefined) && (result.JobInvoiceSignature[i].local_id != null)) ? result.JobInvoiceSignature[i].local_id : '', ((result.JobInvoiceSignature[i].job_id != undefined) && (result.JobInvoiceSignature[i].job_id != null)) ? result.JobInvoiceSignature[i].job_id : 0,
										((result.JobInvoiceSignature[i].job_invoice_id != undefined) && (result.JobInvoiceSignature[i].job_invoice_id != null)) ? result.JobInvoiceSignature[i].job_invoice_id : 0, ((result.JobInvoiceSignature[i].client_name != undefined) && (result.JobInvoiceSignature[i].client_name != null)) ? result.JobInvoiceSignature[i].client_name : '',
										((result.JobInvoiceSignature[i].path != undefined) && (result.JobInvoiceSignature[i].path != null)) ? result.JobInvoiceSignature[i].path : '', ((result.JobInvoiceSignature[i].time != undefined) && (result.JobInvoiceSignature[i].time != null)) ? result.JobInvoiceSignature[i].time : '',
										((result.JobInvoiceSignature[i].mime_type != undefined) && (result.JobInvoiceSignature[i].mime_type != null)) ? result.JobInvoiceSignature[i].mime_type : '', ((result.JobInvoiceSignature[i].width != undefined) && (result.JobInvoiceSignature[i].width != null)) ? result.JobInvoiceSignature[i].width : 0,
										((result.JobInvoiceSignature[i].height != undefined) && (result.JobInvoiceSignature[i].height != null)) ? result.JobInvoiceSignature[i].height : 0, ((result.JobInvoiceSignature[i].file_size != undefined) && (result.JobInvoiceSignature[i].file_size != null)) ? result.JobInvoiceSignature[i].file_size : 0, 0,
										((result.JobInvoiceSignature[i].status_code != undefined) && (result.JobInvoiceSignature[i].status_code != null)) ? result.JobInvoiceSignature[i].status_code : 0, 0, ((result.JobInvoiceSignature[i].created != undefined) && (result.JobInvoiceSignature[i].created != null)) ? result.JobInvoiceSignature[i].created : '',
										((result.JobInvoiceSignature[i].created_by != undefined) && (result.JobInvoiceSignature[i].created_by != null)) ? result.JobInvoiceSignature[i].created_by : 0, ((result.JobInvoiceSignature[i].modified_by != undefined) && (result.JobInvoiceSignature[i].modified_by != null)) ? result.JobInvoiceSignature[i].modified_by : 0,
										((result.JobInvoiceSignature[i].modified != undefined) && (result.JobInvoiceSignature[i].modified != null)) ? result.JobInvoiceSignature[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_invoice_signature_table');
			return;
		}
	},
	update_my_quote_invoice_signature_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteInvoiceSignature === undefined) || (result.QuoteInvoiceSignature === null) || (result.QuoteInvoiceSignature.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuoteInvoiceSignature.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_invoice_signature WHERE id=' + result.QuoteInvoiceSignature[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuoteInvoiceSignature[i].created === temp_created) && ((result.QuoteInvoiceSignature[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_invoice_signature SET local_id=?,quote_id=?,quote_print_id=?,client_name=?,path=?,time=?,mime_type=?,width=?,height=?,file_size=?,is_local_record=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.QuoteInvoiceSignature[i].id,
											((result.QuoteInvoiceSignature[i].local_id != undefined) && (result.QuoteInvoiceSignature[i].local_id != null)) ? result.QuoteInvoiceSignature[i].local_id : '', ((result.QuoteInvoiceSignature[i].quote_id != undefined) && (result.QuoteInvoiceSignature[i].quote_id != null)) ? result.QuoteInvoiceSignature[i].quote_id : 0,
											((result.QuoteInvoiceSignature[i].quote_print_id != undefined) && (result.QuoteInvoiceSignature[i].quote_print_id != null)) ? result.QuoteInvoiceSignature[i].quote_print_id : 0, ((result.QuoteInvoiceSignature[i].client_name != undefined) && (result.QuoteInvoiceSignature[i].client_name != null)) ? result.QuoteInvoiceSignature[i].client_name : '',
											((result.QuoteInvoiceSignature[i].path != undefined) && (result.QuoteInvoiceSignature[i].path != null)) ? result.QuoteInvoiceSignature[i].path : '', ((result.QuoteInvoiceSignature[i].time != undefined) && (result.QuoteInvoiceSignature[i].time != null)) ? result.QuoteInvoiceSignature[i].time : '',
											((result.QuoteInvoiceSignature[i].mime_type != undefined) && (result.QuoteInvoiceSignature[i].mime_type != null)) ? result.QuoteInvoiceSignature[i].mime_type : '', ((result.QuoteInvoiceSignature[i].width != undefined) && (result.QuoteInvoiceSignature[i].width != null)) ? result.QuoteInvoiceSignature[i].width : 0,
											((result.QuoteInvoiceSignature[i].height != undefined) && (result.QuoteInvoiceSignature[i].height != null)) ? result.QuoteInvoiceSignature[i].height : 0, ((result.QuoteInvoiceSignature[i].file_size != undefined) && (result.QuoteInvoiceSignature[i].file_size != null)) ? result.QuoteInvoiceSignature[i].file_size : 0, 0,
											((result.QuoteInvoiceSignature[i].status_code != undefined) && (result.QuoteInvoiceSignature[i].status_code != null)) ? result.QuoteInvoiceSignature[i].status_code : 0, 0, ((result.QuoteInvoiceSignature[i].created != undefined) && (result.QuoteInvoiceSignature[i].created != null)) ? result.QuoteInvoiceSignature[i].created : '',
											((result.QuoteInvoiceSignature[i].created_by != undefined) && (result.QuoteInvoiceSignature[i].created_by != null)) ? result.QuoteInvoiceSignature[i].created_by : 0, ((result.QuoteInvoiceSignature[i].modified_by != undefined) && (result.QuoteInvoiceSignature[i].modified_by != null)) ? result.QuoteInvoiceSignature[i].modified_by : 0,
											((result.QuoteInvoiceSignature[i].modified != undefined) && (result.QuoteInvoiceSignature[i].modified != null)) ? result.QuoteInvoiceSignature[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_invoice_signature (id,local_id,quote_id,quote_print_id,client_name,path,time,mime_type,width,height,file_size,is_local_record,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.QuoteInvoiceSignature[i].id != undefined) && (result.QuoteInvoiceSignature[i].id != null)) ? result.QuoteInvoiceSignature[i].id : 0,
										((result.QuoteInvoiceSignature[i].local_id != undefined) && (result.QuoteInvoiceSignature[i].local_id != null)) ? result.QuoteInvoiceSignature[i].local_id : '', ((result.QuoteInvoiceSignature[i].quote_id != undefined) && (result.QuoteInvoiceSignature[i].quote_id != null)) ? result.QuoteInvoiceSignature[i].quote_id : 0,
										((result.QuoteInvoiceSignature[i].quote_print_id != undefined) && (result.QuoteInvoiceSignature[i].quote_print_id != null)) ? result.QuoteInvoiceSignature[i].quote_print_id : 0, ((result.QuoteInvoiceSignature[i].client_name != undefined) && (result.QuoteInvoiceSignature[i].client_name != null)) ? result.QuoteInvoiceSignature[i].client_name : '',
										((result.QuoteInvoiceSignature[i].path != undefined) && (result.QuoteInvoiceSignature[i].path != null)) ? result.QuoteInvoiceSignature[i].path : 0, ((result.QuoteInvoiceSignature[i].time != undefined) && (result.QuoteInvoiceSignature[i].time != null)) ? result.QuoteInvoiceSignature[i].time : '',
										((result.QuoteInvoiceSignature[i].mime_type != undefined) && (result.QuoteInvoiceSignature[i].mime_type != null)) ? result.QuoteInvoiceSignature[i].mime_type : '', ((result.QuoteInvoiceSignature[i].width != undefined) && (result.QuoteInvoiceSignature[i].width != null)) ? result.QuoteInvoiceSignature[i].width : 0,
										((result.QuoteInvoiceSignature[i].height != undefined) && (result.QuoteInvoiceSignature[i].height != null)) ? result.QuoteInvoiceSignature[i].height : 0, ((result.QuoteInvoiceSignature[i].file_size != undefined) && (result.QuoteInvoiceSignature[i].file_size != null)) ? result.QuoteInvoiceSignature[i].file_size : 0, 0,
										((result.QuoteInvoiceSignature[i].status_code != undefined) && (result.QuoteInvoiceSignature[i].status_code != null)) ? result.QuoteInvoiceSignature[i].status_code : 0, 0, ((result.QuoteInvoiceSignature[i].created != undefined) && (result.QuoteInvoiceSignature[i].created != null)) ? result.QuoteInvoiceSignature[i].created : '',
										((result.QuoteInvoiceSignature[i].created_by != undefined) && (result.QuoteInvoiceSignature[i].created_by != null)) ? result.QuoteInvoiceSignature[i].created_by : 0, ((result.QuoteInvoiceSignature[i].modified_by != undefined) && (result.QuoteInvoiceSignature[i].modified_by != null)) ? result.QuoteInvoiceSignature[i].modified_by : 0,
										((result.QuoteInvoiceSignature[i].modified != undefined) && (result.QuoteInvoiceSignature[i].modified != null)) ? result.QuoteInvoiceSignature[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_invoice_signature_table');
			return;
		}
	},
	// custom report
	update_my_custom_report_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.CustomReport === undefined) || (result.CustomReport === null) || (result.CustomReport.length <= 0)) {
			} else {
				for (var i = 0, j = result.CustomReport.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_custom_report WHERE id=' + result.CustomReport[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.CustomReport[i].created === temp_created) && ((result.CustomReport[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_custom_report SET local_id=?,company_id=?,title=?,need_signature=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.CustomReport[i].id, ((result.CustomReport[i].local_id != undefined) && (result.CustomReport[i].local_id != null)) ? result.CustomReport[i].local_id : '',
											((result.CustomReport[i].company_id != undefined) && (result.CustomReport[i].company_id != null)) ? result.CustomReport[i].company_id : 0, ((result.CustomReport[i].title != undefined) && (result.CustomReport[i].title != null)) ? result.CustomReport[i].title : '', ((result.CustomReport[i].need_signature != undefined) && (result.CustomReport[i].need_signature != null)) ? result.CustomReport[i].need_signature
															: 0, ((result.CustomReport[i].status_code != undefined) && (result.CustomReport[i].status_code != null)) ? result.CustomReport[i].status_code : 0, 0, ((result.CustomReport[i].created != undefined) && (result.CustomReport[i].created != null)) ? result.CustomReport[i].created : '',
											((result.CustomReport[i].created_by != undefined) && (result.CustomReport[i].created_by != null)) ? result.CustomReport[i].created_by : 0, ((result.CustomReport[i].modified_by != undefined) && (result.CustomReport[i].modified_by != null)) ? result.CustomReport[i].modified_by : 0, ((result.CustomReport[i].modified != undefined) && (result.CustomReport[i].modified != null)) ? result.CustomReport[i].modified
															: '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_custom_report (id,local_id,company_id,title,need_signature,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?)', ((result.CustomReport[i].id != undefined) && (result.CustomReport[i].id != null)) ? result.CustomReport[i].id : 0, ((result.CustomReport[i].local_id != undefined) && (result.CustomReport[i].local_id != null)) ? result.CustomReport[i].local_id : '',
										((result.CustomReport[i].company_id != undefined) && (result.CustomReport[i].company_id != null)) ? result.CustomReport[i].company_id : 0, ((result.CustomReport[i].title != undefined) && (result.CustomReport[i].title != null)) ? result.CustomReport[i].title : '', ((result.CustomReport[i].need_signature != undefined) && (result.CustomReport[i].need_signature != null)) ? result.CustomReport[i].need_signature : 0,
										((result.CustomReport[i].status_code != undefined) && (result.CustomReport[i].status_code != null)) ? result.CustomReport[i].status_code : 0, 0, ((result.CustomReport[i].created != undefined) && (result.CustomReport[i].created != null)) ? result.CustomReport[i].created : '', ((result.CustomReport[i].created_by != undefined) && (result.CustomReport[i].created_by != null)) ? result.CustomReport[i].created_by : 0,
										((result.CustomReport[i].modified_by != undefined) && (result.CustomReport[i].modified_by != null)) ? result.CustomReport[i].modified_by : 0, ((result.CustomReport[i].modified != undefined) && (result.CustomReport[i].modified != null)) ? result.CustomReport[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_custom_report_table');
			return;
		}
	},
	update_my_custom_report_field_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.CustomReportField === undefined) || (result.CustomReportField === null) || (result.CustomReportField.length <= 0)) {
			} else {
				for (var i = 0, j = result.CustomReportField.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_custom_report_field WHERE id=' + result.CustomReportField[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.CustomReportField[i].created === temp_created) && ((result.CustomReportField[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_custom_report_field SET local_id=?,company_id=?,custom_report_id=?,field_title=?,field_type=?,field_position=?,is_break=?,field_option=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.CustomReportField[i].id, ((result.CustomReportField[i].local_id != undefined) && (result.CustomReportField[i].local_id != null)) ? result.CustomReportField[i].local_id : '',
											((result.CustomReportField[i].company_id != undefined) && (result.CustomReportField[i].company_id != null)) ? result.CustomReportField[i].company_id : 0, ((result.CustomReportField[i].custom_report_id != undefined) && (result.CustomReportField[i].custom_report_id != null)) ? result.CustomReportField[i].custom_report_id : 0,
											((result.CustomReportField[i].field_title != undefined) && (result.CustomReportField[i].field_title != null)) ? result.CustomReportField[i].field_title : '', ((result.CustomReportField[i].field_type != undefined) && (result.CustomReportField[i].field_type != null)) ? result.CustomReportField[i].field_type : '',
											((result.CustomReportField[i].field_position != undefined) && (result.CustomReportField[i].field_position != null)) ? result.CustomReportField[i].field_position : 0, ((result.CustomReportField[i].is_break != undefined) && (result.CustomReportField[i].is_break != null)) ? result.CustomReportField[i].is_break : 0,
											((result.CustomReportField[i].field_option != undefined) && (result.CustomReportField[i].field_option != null)) ? result.CustomReportField[i].field_option : '', ((result.CustomReportField[i].status_code != undefined) && (result.CustomReportField[i].status_code != null)) ? result.CustomReportField[i].status_code : 0, 0,
											((result.CustomReportField[i].created != undefined) && (result.CustomReportField[i].created != null)) ? result.CustomReportField[i].created : '', ((result.CustomReportField[i].created_by != undefined) && (result.CustomReportField[i].created_by != null)) ? result.CustomReportField[i].created_by : 0,
											((result.CustomReportField[i].modified_by != undefined) && (result.CustomReportField[i].modified_by != null)) ? result.CustomReportField[i].modified_by : 0, ((result.CustomReportField[i].modified != undefined) && (result.CustomReportField[i].modified != null)) ? result.CustomReportField[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_custom_report_field (id,local_id,company_id,custom_report_id,field_title,field_type,field_position,is_break,field_option,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.CustomReportField[i].id != undefined) && (result.CustomReportField[i].id != null)) ? result.CustomReportField[i].id : 0,
										((result.CustomReportField[i].local_id != undefined) && (result.CustomReportField[i].local_id != null)) ? result.CustomReportField[i].local_id : '', ((result.CustomReportField[i].company_id != undefined) && (result.CustomReportField[i].company_id != null)) ? result.CustomReportField[i].company_id : 0,
										((result.CustomReportField[i].custom_report_id != undefined) && (result.CustomReportField[i].custom_report_id != null)) ? result.CustomReportField[i].custom_report_id : 0, ((result.CustomReportField[i].field_title != undefined) && (result.CustomReportField[i].field_title != null)) ? result.CustomReportField[i].field_title : '',
										((result.CustomReportField[i].field_type != undefined) && (result.CustomReportField[i].field_type != null)) ? result.CustomReportField[i].field_type : '', ((result.CustomReportField[i].field_position != undefined) && (result.CustomReportField[i].field_position != null)) ? result.CustomReportField[i].field_position : 0,
										((result.CustomReportField[i].is_break != undefined) && (result.CustomReportField[i].is_break != null)) ? result.CustomReportField[i].is_break : 0, ((result.CustomReportField[i].field_option != undefined) && (result.CustomReportField[i].field_option != null)) ? result.CustomReportField[i].field_option : '',
										((result.CustomReportField[i].status_code != undefined) && (result.CustomReportField[i].status_code != null)) ? result.CustomReportField[i].status_code : 0, 0, ((result.CustomReportField[i].created != undefined) && (result.CustomReportField[i].created != null)) ? result.CustomReportField[i].created : '',
										((result.CustomReportField[i].created_by != undefined) && (result.CustomReportField[i].created_by != null)) ? result.CustomReportField[i].created_by : 0, ((result.CustomReportField[i].modified_by != undefined) && (result.CustomReportField[i].modified_by != null)) ? result.CustomReportField[i].modified_by : 0,
										((result.CustomReportField[i].modified != undefined) && (result.CustomReportField[i].modified != null)) ? result.CustomReportField[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_custom_report_field_table');
			return;
		}
	},
	update_my_job_custom_report_data_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobCustomReportData === undefined) || (result.JobCustomReportData === null) || (result.JobCustomReportData.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobCustomReportData.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_custom_report_data WHERE id=' + result.JobCustomReportData[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobCustomReportData[i].created === temp_created) && ((result.JobCustomReportData[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_custom_report_data SET local_id=?,custom_report_id=?,manager_user_id=?,job_id=?,custom_report_data=?,is_merge_signature=?,path=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobCustomReportData[i].id, ((result.JobCustomReportData[i].local_id != undefined) && (result.JobCustomReportData[i].local_id != null)) ? result.JobCustomReportData[i].local_id : '',
											((result.JobCustomReportData[i].custom_report_id != undefined) && (result.JobCustomReportData[i].custom_report_id != null)) ? result.JobCustomReportData[i].custom_report_id : 0, ((result.JobCustomReportData[i].manager_user_id != undefined) && (result.JobCustomReportData[i].manager_user_id != null)) ? result.JobCustomReportData[i].manager_user_id : 0,
											((result.JobCustomReportData[i].job_id != undefined) && (result.JobCustomReportData[i].job_id != null)) ? result.JobCustomReportData[i].job_id : 0, ((result.JobCustomReportData[i].custom_report_data != undefined) && (result.JobCustomReportData[i].custom_report_data != null)) ? result.JobCustomReportData[i].custom_report_data : '',
											((result.JobCustomReportData[i].is_merge_signature != undefined) && (result.JobCustomReportData[i].is_merge_signature != null)) ? result.JobCustomReportData[i].is_merge_signature : 0, ((result.JobCustomReportData[i].path != undefined) && (result.JobCustomReportData[i].path != null)) ? result.JobCustomReportData[i].path : '',
											((result.JobCustomReportData[i].status_code != undefined) && (result.JobCustomReportData[i].status_code != null)) ? result.JobCustomReportData[i].status_code : 0, 0, ((result.JobCustomReportData[i].created != undefined) && (result.JobCustomReportData[i].created != null)) ? result.JobCustomReportData[i].created : '',
											((result.JobCustomReportData[i].created_by != undefined) && (result.JobCustomReportData[i].created_by != null)) ? result.JobCustomReportData[i].created_by : 0, ((result.JobCustomReportData[i].modified_by != undefined) && (result.JobCustomReportData[i].modified_by != null)) ? result.JobCustomReportData[i].modified_by : 0,
											((result.JobCustomReportData[i].modified != undefined) && (result.JobCustomReportData[i].modified != null)) ? result.JobCustomReportData[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_custom_report_data (id,local_id,custom_report_id,manager_user_id,job_id,custom_report_data,is_merge_signature,path,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobCustomReportData[i].id != undefined) && (result.JobCustomReportData[i].id != null)) ? result.JobCustomReportData[i].id : 0,
										((result.JobCustomReportData[i].local_id != undefined) && (result.JobCustomReportData[i].local_id != null)) ? result.JobCustomReportData[i].local_id : '', ((result.JobCustomReportData[i].custom_report_id != undefined) && (result.JobCustomReportData[i].custom_report_id != null)) ? result.JobCustomReportData[i].custom_report_id : 0,
										((result.JobCustomReportData[i].manager_user_id != undefined) && (result.JobCustomReportData[i].manager_user_id != null)) ? result.JobCustomReportData[i].manager_user_id : 0, ((result.JobCustomReportData[i].job_id != undefined) && (result.JobCustomReportData[i].job_id != null)) ? result.JobCustomReportData[i].job_id : 0,
										((result.JobCustomReportData[i].custom_report_data != undefined) && (result.JobCustomReportData[i].custom_report_data != null)) ? result.JobCustomReportData[i].custom_report_data : '', ((result.JobCustomReportData[i].is_merge_signature != undefined) && (result.JobCustomReportData[i].is_merge_signature != null)) ? result.JobCustomReportData[i].is_merge_signature : 0,
										((result.JobCustomReportData[i].path != undefined) && (result.JobCustomReportData[i].path != null)) ? result.JobCustomReportData[i].path : '', ((result.JobCustomReportData[i].status_code != undefined) && (result.JobCustomReportData[i].status_code != null)) ? result.JobCustomReportData[i].status_code : 0, 0,
										((result.JobCustomReportData[i].created != undefined) && (result.JobCustomReportData[i].created != null)) ? result.JobCustomReportData[i].created : '', ((result.JobCustomReportData[i].created_by != undefined) && (result.JobCustomReportData[i].created_by != null)) ? result.JobCustomReportData[i].created_by : 0,
										((result.JobCustomReportData[i].modified_by != undefined) && (result.JobCustomReportData[i].modified_by != null)) ? result.JobCustomReportData[i].modified_by : 0, ((result.JobCustomReportData[i].modified != undefined) && (result.JobCustomReportData[i].modified != null)) ? result.JobCustomReportData[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_custom_report_data_table');
			return;
		}
	},
	update_my_quote_custom_report_data_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteCustomReportData === undefined) || (result.QuoteCustomReportData === null) || (result.QuoteCustomReportData.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuoteCustomReportData.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_custom_report_data WHERE id=' + result.QuoteCustomReportData[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuoteCustomReportData[i].created === temp_created) && ((result.QuoteCustomReportData[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_custom_report_data SET local_id=?,custom_report_id=?,manager_user_id=?,quote_id=?,custom_report_data=?,is_merge_signature=?,path=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.QuoteCustomReportData[i].id, ((result.QuoteCustomReportData[i].local_id != undefined) && (result.QuoteCustomReportData[i].local_id != null)) ? result.QuoteCustomReportData[i].local_id
											: '', ((result.QuoteCustomReportData[i].custom_report_id != undefined) && (result.QuoteCustomReportData[i].custom_report_id != null)) ? result.QuoteCustomReportData[i].custom_report_id : 0, ((result.QuoteCustomReportData[i].manager_user_id != undefined) && (result.QuoteCustomReportData[i].manager_user_id != null)) ? result.QuoteCustomReportData[i].manager_user_id : 0,
											((result.QuoteCustomReportData[i].quote_id != undefined) && (result.QuoteCustomReportData[i].quote_id != null)) ? result.QuoteCustomReportData[i].quote_id : 0, ((result.QuoteCustomReportData[i].custom_report_data != undefined) && (result.QuoteCustomReportData[i].custom_report_data != null)) ? result.QuoteCustomReportData[i].custom_report_data : '',
											((result.QuoteCustomReportData[i].is_merge_signature != undefined) && (result.QuoteCustomReportData[i].is_merge_signature != null)) ? result.QuoteCustomReportData[i].is_merge_signature : 0, ((result.QuoteCustomReportData[i].path != undefined) && (result.QuoteCustomReportData[i].path != null)) ? result.QuoteCustomReportData[i].path : '',
											((result.QuoteCustomReportData[i].status_code != undefined) && (result.QuoteCustomReportData[i].status_code != null)) ? result.QuoteCustomReportData[i].status_code : 0, 0, ((result.QuoteCustomReportData[i].created != undefined) && (result.QuoteCustomReportData[i].created != null)) ? result.QuoteCustomReportData[i].created : '',
											((result.QuoteCustomReportData[i].created_by != undefined) && (result.QuoteCustomReportData[i].created_by != null)) ? result.QuoteCustomReportData[i].created_by : 0, ((result.QuoteCustomReportData[i].modified_by != undefined) && (result.QuoteCustomReportData[i].modified_by != null)) ? result.QuoteCustomReportData[i].modified_by : 0,
											((result.QuoteCustomReportData[i].modified != undefined) && (result.QuoteCustomReportData[i].modified != null)) ? result.QuoteCustomReportData[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_custom_report_data (id,local_id,custom_report_id,manager_user_id,quote_id,custom_report_data,is_merge_signature,path,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.QuoteCustomReportData[i].id != undefined) && (result.QuoteCustomReportData[i].id != null)) ? result.QuoteCustomReportData[i].id : 0,
										((result.QuoteCustomReportData[i].local_id != undefined) && (result.QuoteCustomReportData[i].local_id != null)) ? result.QuoteCustomReportData[i].local_id : '', ((result.QuoteCustomReportData[i].custom_report_id != undefined) && (result.QuoteCustomReportData[i].custom_report_id != null)) ? result.QuoteCustomReportData[i].custom_report_id : 0,
										((result.QuoteCustomReportData[i].manager_user_id != undefined) && (result.QuoteCustomReportData[i].manager_user_id != null)) ? result.QuoteCustomReportData[i].manager_user_id : 0, ((result.QuoteCustomReportData[i].quote_id != undefined) && (result.QuoteCustomReportData[i].quote_id != null)) ? result.QuoteCustomReportData[i].quote_id : 0,
										((result.QuoteCustomReportData[i].custom_report_data != undefined) && (result.QuoteCustomReportData[i].custom_report_data != null)) ? result.QuoteCustomReportData[i].custom_report_data : '', ((result.QuoteCustomReportData[i].is_merge_signature != undefined) && (result.QuoteCustomReportData[i].is_merge_signature != null)) ? result.QuoteCustomReportData[i].is_merge_signature : 0,
										((result.QuoteCustomReportData[i].path != undefined) && (result.QuoteCustomReportData[i].path != null)) ? result.QuoteCustomReportData[i].path : '', ((result.QuoteCustomReportData[i].status_code != undefined) && (result.QuoteCustomReportData[i].status_code != null)) ? result.QuoteCustomReportData[i].status_code : 0, 0,
										((result.QuoteCustomReportData[i].created != undefined) && (result.QuoteCustomReportData[i].created != null)) ? result.QuoteCustomReportData[i].created : '', ((result.QuoteCustomReportData[i].created_by != undefined) && (result.QuoteCustomReportData[i].created_by != null)) ? result.QuoteCustomReportData[i].created_by : 0,
										((result.QuoteCustomReportData[i].modified_by != undefined) && (result.QuoteCustomReportData[i].modified_by != null)) ? result.QuoteCustomReportData[i].modified_by : 0, ((result.QuoteCustomReportData[i].modified != undefined) && (result.QuoteCustomReportData[i].modified != null)) ? result.QuoteCustomReportData[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_custom_report_data_table');
			return;
		}
	},
	update_my_job_custom_report_signature_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobCustomReportSignature === undefined) || (result.JobCustomReportSignature === null) || (result.JobCustomReportSignature.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobCustomReportSignature.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_custom_report_signature WHERE id=' + result.JobCustomReportSignature[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobCustomReportSignature[i].created === temp_created) && ((result.JobCustomReportSignature[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_custom_report_signature SET local_id=?,job_id=?,job_custom_report_data_id=?,client_name=?,path=?,time=?,mime_type=?,width=?,height=?,file_size=?,is_local_record=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobCustomReportSignature[i].id,
											((result.JobCustomReportSignature[i].local_id != undefined) && (result.JobCustomReportSignature[i].local_id != null)) ? result.JobCustomReportSignature[i].local_id : '', ((result.JobCustomReportSignature[i].job_id != undefined) && (result.JobCustomReportSignature[i].job_id != null)) ? result.JobCustomReportSignature[i].job_id : 0,
											((result.JobCustomReportSignature[i].job_custom_report_data_id != undefined) && (result.JobCustomReportSignature[i].job_custom_report_data_id != null)) ? result.JobCustomReportSignature[i].job_custom_report_data_id : 0, ((result.JobCustomReportSignature[i].client_name != undefined) && (result.JobCustomReportSignature[i].client_name != null)) ? result.JobCustomReportSignature[i].client_name : '',
											((result.JobCustomReportSignature[i].path != undefined) && (result.JobCustomReportSignature[i].path != null)) ? result.JobCustomReportSignature[i].path : '', ((result.JobCustomReportSignature[i].time != undefined) && (result.JobCustomReportSignature[i].time != null)) ? result.JobCustomReportSignature[i].time : '',
											((result.JobCustomReportSignature[i].mime_type != undefined) && (result.JobCustomReportSignature[i].mime_type != null)) ? result.JobCustomReportSignature[i].mime_type : '', ((result.JobCustomReportSignature[i].width != undefined) && (result.JobCustomReportSignature[i].width != null)) ? result.JobCustomReportSignature[i].width : 0,
											((result.JobCustomReportSignature[i].height != undefined) && (result.JobCustomReportSignature[i].height != null)) ? result.JobCustomReportSignature[i].height : 0, ((result.JobCustomReportSignature[i].file_size != undefined) && (result.JobCustomReportSignature[i].file_size != null)) ? result.JobCustomReportSignature[i].file_size : 0, 0,
											((result.JobCustomReportSignature[i].status_code != undefined) && (result.JobCustomReportSignature[i].status_code != null)) ? result.JobCustomReportSignature[i].status_code : 0, 0, ((result.JobCustomReportSignature[i].created != undefined) && (result.JobCustomReportSignature[i].created != null)) ? result.JobCustomReportSignature[i].created : '',
											((result.JobCustomReportSignature[i].created_by != undefined) && (result.JobCustomReportSignature[i].created_by != null)) ? result.JobCustomReportSignature[i].created_by : 0, ((result.JobCustomReportSignature[i].modified_by != undefined) && (result.JobCustomReportSignature[i].modified_by != null)) ? result.JobCustomReportSignature[i].modified_by : 0,
											((result.JobCustomReportSignature[i].modified != undefined) && (result.JobCustomReportSignature[i].modified != null)) ? result.JobCustomReportSignature[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_custom_report_signature (id,local_id,job_id,job_custom_report_data_id,client_name,path,time,mime_type,width,height,file_size,is_local_record,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobCustomReportSignature[i].id != undefined) && (result.JobCustomReportSignature[i].id != null)) ? result.JobCustomReportSignature[i].id : 0,
										((result.JobCustomReportSignature[i].local_id != undefined) && (result.JobCustomReportSignature[i].local_id != null)) ? result.JobCustomReportSignature[i].local_id : '', ((result.JobCustomReportSignature[i].job_id != undefined) && (result.JobCustomReportSignature[i].job_id != null)) ? result.JobCustomReportSignature[i].job_id : 0,
										((result.JobCustomReportSignature[i].job_custom_report_data_id != undefined) && (result.JobCustomReportSignature[i].job_custom_report_data_id != null)) ? result.JobCustomReportSignature[i].job_custom_report_data_id : 0, ((result.JobCustomReportSignature[i].client_name != undefined) && (result.JobCustomReportSignature[i].client_name != null)) ? result.JobCustomReportSignature[i].client_name : '',
										((result.JobCustomReportSignature[i].path != undefined) && (result.JobCustomReportSignature[i].path != null)) ? result.JobCustomReportSignature[i].path : '', ((result.JobCustomReportSignature[i].time != undefined) && (result.JobCustomReportSignature[i].time != null)) ? result.JobCustomReportSignature[i].time : '',
										((result.JobCustomReportSignature[i].mime_type != undefined) && (result.JobCustomReportSignature[i].mime_type != null)) ? result.JobCustomReportSignature[i].mime_type : '', ((result.JobCustomReportSignature[i].width != undefined) && (result.JobCustomReportSignature[i].width != null)) ? result.JobCustomReportSignature[i].width : 0,
										((result.JobCustomReportSignature[i].height != undefined) && (result.JobCustomReportSignature[i].height != null)) ? result.JobCustomReportSignature[i].height : 0, ((result.JobCustomReportSignature[i].file_size != undefined) && (result.JobCustomReportSignature[i].file_size != null)) ? result.JobCustomReportSignature[i].file_size : 0, 0,
										((result.JobCustomReportSignature[i].status_code != undefined) && (result.JobCustomReportSignature[i].status_code != null)) ? result.JobCustomReportSignature[i].status_code : 0, 0, ((result.JobCustomReportSignature[i].created != undefined) && (result.JobCustomReportSignature[i].created != null)) ? result.JobCustomReportSignature[i].created : '',
										((result.JobCustomReportSignature[i].created_by != undefined) && (result.JobCustomReportSignature[i].created_by != null)) ? result.JobCustomReportSignature[i].created_by : 0, ((result.JobCustomReportSignature[i].modified_by != undefined) && (result.JobCustomReportSignature[i].modified_by != null)) ? result.JobCustomReportSignature[i].modified_by : 0,
										((result.JobCustomReportSignature[i].modified != undefined) && (result.JobCustomReportSignature[i].modified != null)) ? result.JobCustomReportSignature[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_custom_report_signature_table');
			return;
		}
	},
	update_my_quote_custom_report_signature_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteCustomReportSignature === undefined) || (result.QuoteCustomReportSignature === null) || (result.QuoteCustomReportSignature.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuoteCustomReportSignature.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_custom_report_signature WHERE id=' + result.QuoteCustomReportSignature[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuoteCustomReportSignature[i].created === temp_created) && ((result.QuoteCustomReportSignature[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_custom_report_signature SET local_id=?,quote_id=?,quote_custom_report_data_id=?,client_name=?,path=?,time=?,mime_type=?,width=?,height=?,file_size=?,is_local_record=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.QuoteCustomReportSignature[i].id,
											((result.QuoteCustomReportSignature[i].local_id != undefined) && (result.QuoteCustomReportSignature[i].local_id != null)) ? result.QuoteCustomReportSignature[i].local_id : '', ((result.QuoteCustomReportSignature[i].quote_id != undefined) && (result.QuoteCustomReportSignature[i].quote_id != null)) ? result.QuoteCustomReportSignature[i].quote_id : 0,
											((result.QuoteCustomReportSignature[i].quote_custom_report_data_id != undefined) && (result.QuoteCustomReportSignature[i].quote_custom_report_data_id != null)) ? result.QuoteCustomReportSignature[i].quote_custom_report_data_id : 0, ((result.QuoteCustomReportSignature[i].client_name != undefined) && (result.QuoteCustomReportSignature[i].client_name != null)) ? result.QuoteCustomReportSignature[i].client_name
															: '', ((result.QuoteCustomReportSignature[i].path != undefined) && (result.QuoteCustomReportSignature[i].path != null)) ? result.QuoteCustomReportSignature[i].path : '', ((result.QuoteCustomReportSignature[i].time != undefined) && (result.QuoteCustomReportSignature[i].time != null)) ? result.QuoteCustomReportSignature[i].time : '',
											((result.QuoteCustomReportSignature[i].mime_type != undefined) && (result.QuoteCustomReportSignature[i].mime_type != null)) ? result.QuoteCustomReportSignature[i].mime_type : '', ((result.QuoteCustomReportSignature[i].width != undefined) && (result.QuoteCustomReportSignature[i].width != null)) ? result.QuoteCustomReportSignature[i].width : 0,
											((result.QuoteCustomReportSignature[i].height != undefined) && (result.QuoteCustomReportSignature[i].height != null)) ? result.QuoteCustomReportSignature[i].height : 0, ((result.QuoteCustomReportSignature[i].file_size != undefined) && (result.QuoteCustomReportSignature[i].file_size != null)) ? result.QuoteCustomReportSignature[i].file_size : 0, 0,
											((result.QuoteCustomReportSignature[i].status_code != undefined) && (result.QuoteCustomReportSignature[i].status_code != null)) ? result.QuoteCustomReportSignature[i].status_code : 0, 0, ((result.QuoteCustomReportSignature[i].created != undefined) && (result.QuoteCustomReportSignature[i].created != null)) ? result.QuoteCustomReportSignature[i].created : '',
											((result.QuoteCustomReportSignature[i].created_by != undefined) && (result.QuoteCustomReportSignature[i].created_by != null)) ? result.QuoteCustomReportSignature[i].created_by : 0, ((result.QuoteCustomReportSignature[i].modified_by != undefined) && (result.QuoteCustomReportSignature[i].modified_by != null)) ? result.QuoteCustomReportSignature[i].modified_by : 0,
											((result.QuoteCustomReportSignature[i].modified != undefined) && (result.QuoteCustomReportSignature[i].modified != null)) ? result.QuoteCustomReportSignature[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_custom_report_signature (id,local_id,quote_id,quote_custom_report_data_id,client_name,path,time,mime_type,width,height,file_size,is_local_record,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.QuoteCustomReportSignature[i].id != undefined) && (result.QuoteCustomReportSignature[i].id != null)) ? result.QuoteCustomReportSignature[i].id : 0,
										((result.QuoteCustomReportSignature[i].local_id != undefined) && (result.QuoteCustomReportSignature[i].local_id != null)) ? result.QuoteCustomReportSignature[i].local_id : '', ((result.QuoteCustomReportSignature[i].quote_id != undefined) && (result.QuoteCustomReportSignature[i].quote_id != null)) ? result.QuoteCustomReportSignature[i].quote_id : 0,
										((result.QuoteCustomReportSignature[i].quote_custom_report_data_id != undefined) && (result.QuoteCustomReportSignature[i].quote_custom_report_data_id != null)) ? result.QuoteCustomReportSignature[i].quote_custom_report_data_id : 0, ((result.QuoteCustomReportSignature[i].client_name != undefined) && (result.QuoteCustomReportSignature[i].client_name != null)) ? result.QuoteCustomReportSignature[i].client_name : '',
										((result.QuoteCustomReportSignature[i].path != undefined) && (result.QuoteCustomReportSignature[i].path != null)) ? result.QuoteCustomReportSignature[i].path : '', ((result.QuoteCustomReportSignature[i].time != undefined) && (result.QuoteCustomReportSignature[i].time != null)) ? result.QuoteCustomReportSignature[i].time : '',
										((result.QuoteCustomReportSignature[i].mime_type != undefined) && (result.QuoteCustomReportSignature[i].mime_type != null)) ? result.QuoteCustomReportSignature[i].mime_type : '', ((result.QuoteCustomReportSignature[i].width != undefined) && (result.QuoteCustomReportSignature[i].width != null)) ? result.QuoteCustomReportSignature[i].width : 0,
										((result.QuoteCustomReportSignature[i].height != undefined) && (result.QuoteCustomReportSignature[i].height != null)) ? result.QuoteCustomReportSignature[i].height : 0, ((result.QuoteCustomReportSignature[i].file_size != undefined) && (result.QuoteCustomReportSignature[i].file_size != null)) ? result.QuoteCustomReportSignature[i].file_size : 0, 0,
										((result.QuoteCustomReportSignature[i].status_code != undefined) && (result.QuoteCustomReportSignature[i].status_code != null)) ? result.QuoteCustomReportSignature[i].status_code : 0, 0, ((result.QuoteCustomReportSignature[i].created != undefined) && (result.QuoteCustomReportSignature[i].created != null)) ? result.QuoteCustomReportSignature[i].created : '',
										((result.QuoteCustomReportSignature[i].created_by != undefined) && (result.QuoteCustomReportSignature[i].created_by != null)) ? result.QuoteCustomReportSignature[i].created_by : 0, ((result.QuoteCustomReportSignature[i].modified_by != undefined) && (result.QuoteCustomReportSignature[i].modified_by != null)) ? result.QuoteCustomReportSignature[i].modified_by : 0,
										((result.QuoteCustomReportSignature[i].modified != undefined) && (result.QuoteCustomReportSignature[i].modified != null)) ? result.QuoteCustomReportSignature[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_custom_report_signature_table');
			return;
		}
	},
	// labour manual item
	update_my_job_operation_manual_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobOperationManual === undefined) || (result.JobOperationManual === null) || (result.JobOperationManual.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobOperationManual.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_operation_manual WHERE id=' + result.JobOperationManual[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobOperationManual[i].created === temp_created) && ((result.JobOperationManual[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_operation_manual SET local_id=?,company_id=?,job_id=?,operation_user=?,operation_time=?,operation_duration=?,operation_rate=?,operation_price=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobOperationManual[i].id,
											((result.JobOperationManual[i].local_id != undefined) && (result.JobOperationManual[i].local_id != null)) ? result.JobOperationManual[i].local_id : '', ((result.JobOperationManual[i].company_id != undefined) && (result.JobOperationManual[i].company_id != null)) ? result.JobOperationManual[i].company_id : 0,
											((result.JobOperationManual[i].job_id != undefined) && (result.JobOperationManual[i].job_id != null)) ? result.JobOperationManual[i].job_id : 0, ((result.JobOperationManual[i].operation_user != undefined) && (result.JobOperationManual[i].operation_user != null)) ? result.JobOperationManual[i].operation_user : '',
											((result.JobOperationManual[i].operation_time != undefined) && (result.JobOperationManual[i].operation_time != null)) ? result.JobOperationManual[i].operation_time : '', ((result.JobOperationManual[i].operation_duration != undefined) && (result.JobOperationManual[i].operation_duration != null)) ? result.JobOperationManual[i].operation_duration : '',
											((result.JobOperationManual[i].operation_rate != undefined) && (result.JobOperationManual[i].operation_rate != null)) ? result.JobOperationManual[i].operation_rate : '', ((result.JobOperationManual[i].operation_price != undefined) && (result.JobOperationManual[i].operation_price != null)) ? result.JobOperationManual[i].operation_price : 0,
											((result.JobOperationManual[i].status_code != undefined) && (result.JobOperationManual[i].status_code != null)) ? result.JobOperationManual[i].status_code : 0, 0, ((result.JobOperationManual[i].created != undefined) && (result.JobOperationManual[i].created != null)) ? result.JobOperationManual[i].created : '',
											((result.JobOperationManual[i].created_by != undefined) && (result.JobOperationManual[i].created_by != null)) ? result.JobOperationManual[i].created_by : 0, ((result.JobOperationManual[i].modified_by != undefined) && (result.JobOperationManual[i].modified_by != null)) ? result.JobOperationManual[i].modified_by : 0,
											((result.JobOperationManual[i].modified != undefined) && (result.JobOperationManual[i].modified != null)) ? result.JobOperationManual[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_operation_manual (id,local_id,company_id,job_id,operation_user,operation_time,operation_duration,operation_rate,operation_price,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobOperationManual[i].id != undefined) && (result.JobOperationManual[i].id != null)) ? result.JobOperationManual[i].id : 0,
										((result.JobOperationManual[i].local_id != undefined) && (result.JobOperationManual[i].local_id != null)) ? result.JobOperationManual[i].local_id : '', ((result.JobOperationManual[i].company_id != undefined) && (result.JobOperationManual[i].company_id != null)) ? result.JobOperationManual[i].company_id : 0,
										((result.JobOperationManual[i].job_id != undefined) && (result.JobOperationManual[i].job_id != null)) ? result.JobOperationManual[i].job_id : 0, ((result.JobOperationManual[i].operation_user != undefined) && (result.JobOperationManual[i].operation_user != null)) ? result.JobOperationManual[i].operation_user : '',
										((result.JobOperationManual[i].operation_time != undefined) && (result.JobOperationManual[i].operation_time != null)) ? result.JobOperationManual[i].operation_time : '', ((result.JobOperationManual[i].operation_duration != undefined) && (result.JobOperationManual[i].operation_duration != null)) ? result.JobOperationManual[i].operation_duration : '',
										((result.JobOperationManual[i].operation_rate != undefined) && (result.JobOperationManual[i].operation_rate != null)) ? result.JobOperationManual[i].operation_rate : '', ((result.JobOperationManual[i].operation_price != undefined) && (result.JobOperationManual[i].operation_price != null)) ? result.JobOperationManual[i].operation_price : 0,
										((result.JobOperationManual[i].status_code != undefined) && (result.JobOperationManual[i].status_code != null)) ? result.JobOperationManual[i].status_code : 0, 0, ((result.JobOperationManual[i].created != undefined) && (result.JobOperationManual[i].created != null)) ? result.JobOperationManual[i].created : '',
										((result.JobOperationManual[i].created_by != undefined) && (result.JobOperationManual[i].created_by != null)) ? result.JobOperationManual[i].created_by : 0, ((result.JobOperationManual[i].modified_by != undefined) && (result.JobOperationManual[i].modified_by != null)) ? result.JobOperationManual[i].modified_by : 0,
										((result.JobOperationManual[i].modified != undefined) && (result.JobOperationManual[i].modified != null)) ? result.JobOperationManual[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_operation_manual_table');
			return;
		}
	},
	update_my_job_assigned_operation_manual_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobAssignOperationManual === undefined) || (result.JobAssignOperationManual === null) || (result.JobAssignOperationManual.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobAssignOperationManual.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_assigned_operation_manual WHERE id=' + result.JobAssignOperationManual[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobAssignOperationManual[i].created === temp_created) && ((result.JobAssignOperationManual[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_assigned_operation_manual SET local_id=?,company_id=?,job_invoice_id=?,job_operation_manual_id=?,operation_user=?,operation_time=?,operation_duration=?,operation_rate=?,operation_price=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobAssignOperationManual[i].id,
											((result.JobAssignOperationManual[i].local_id != undefined) && (result.JobAssignOperationManual[i].local_id != null)) ? result.JobAssignOperationManual[i].local_id : '', ((result.JobAssignOperationManual[i].company_id != undefined) && (result.JobAssignOperationManual[i].company_id != null)) ? result.JobAssignOperationManual[i].company_id : 0,
											((result.JobAssignOperationManual[i].jobinvoice_id != undefined) && (result.JobAssignOperationManual[i].jobinvoice_id != null)) ? result.JobAssignOperationManual[i].jobinvoice_id : 0, ((result.JobAssignOperationManual[i].job_operation_manual_id != undefined) && (result.JobAssignOperationManual[i].job_operation_manual_id != null)) ? result.JobAssignOperationManual[i].job_operation_manual_id : 0,
											((result.JobAssignOperationManual[i].operation_user != undefined) && (result.JobAssignOperationManual[i].operation_user != null)) ? result.JobAssignOperationManual[i].operation_user : '', ((result.JobAssignOperationManual[i].operation_time != undefined) && (result.JobAssignOperationManual[i].operation_time != null)) ? result.JobAssignOperationManual[i].operation_time : '',
											((result.JobAssignOperationManual[i].operation_duration != undefined) && (result.JobAssignOperationManual[i].operation_duration != null)) ? result.JobAssignOperationManual[i].operation_duration : '', ((result.JobAssignOperationManual[i].operation_rate != undefined) && (result.JobAssignOperationManual[i].operation_rate != null)) ? result.JobAssignOperationManual[i].operation_rate : '',
											((result.JobAssignOperationManual[i].operation_price != undefined) && (result.JobAssignOperationManual[i].operation_price != null)) ? result.JobAssignOperationManual[i].operation_price : 0, ((result.JobAssignOperationManual[i].status_code != undefined) && (result.JobAssignOperationManual[i].status_code != null)) ? result.JobAssignOperationManual[i].status_code : 0, 0,
											((result.JobAssignOperationManual[i].created != undefined) && (result.JobAssignOperationManual[i].created != null)) ? result.JobAssignOperationManual[i].created : '', ((result.JobAssignOperationManual[i].created_by != undefined) && (result.JobAssignOperationManual[i].created_by != null)) ? result.JobAssignOperationManual[i].created_by : 0,
											((result.JobAssignOperationManual[i].modified_by != undefined) && (result.JobAssignOperationManual[i].modified_by != null)) ? result.JobAssignOperationManual[i].modified_by : 0, ((result.JobAssignOperationManual[i].modified != undefined) && (result.JobAssignOperationManual[i].modified != null)) ? result.JobAssignOperationManual[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_assigned_operation_manual (id,local_id,company_id,job_invoice_id,job_operation_manual_id,operation_user,operation_time,operation_duration,operation_rate,operation_price,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
										((result.JobAssignOperationManual[i].id != undefined) && (result.JobAssignOperationManual[i].id != null)) ? result.JobAssignOperationManual[i].id : 0, ((result.JobAssignOperationManual[i].local_id != undefined) && (result.JobAssignOperationManual[i].local_id != null)) ? result.JobAssignOperationManual[i].local_id : '',
										((result.JobAssignOperationManual[i].company_id != undefined) && (result.JobAssignOperationManual[i].company_id != null)) ? result.JobAssignOperationManual[i].company_id : 0, ((result.JobAssignOperationManual[i].jobinvoice_id != undefined) && (result.JobAssignOperationManual[i].jobinvoice_id != null)) ? result.JobAssignOperationManual[i].jobinvoice_id : 0,
										((result.JobAssignOperationManual[i].job_operation_manual_id != undefined) && (result.JobAssignOperationManual[i].job_operation_manual_id != null)) ? result.JobAssignOperationManual[i].job_operation_manual_id : 0, ((result.JobAssignOperationManual[i].operation_user != undefined) && (result.JobAssignOperationManual[i].operation_user != null)) ? result.JobAssignOperationManual[i].operation_user : '',
										((result.JobAssignOperationManual[i].operation_time != undefined) && (result.JobAssignOperationManual[i].operation_time != null)) ? result.JobAssignOperationManual[i].operation_time : '', ((result.JobAssignOperationManual[i].operation_duration != undefined) && (result.JobAssignOperationManual[i].operation_duration != null)) ? result.JobAssignOperationManual[i].operation_duration : '',
										((result.JobAssignOperationManual[i].operation_rate != undefined) && (result.JobAssignOperationManual[i].operation_rate != null)) ? result.JobAssignOperationManual[i].operation_rate : '', ((result.JobAssignOperationManual[i].operation_price != undefined) && (result.JobAssignOperationManual[i].operation_price != null)) ? result.JobAssignOperationManual[i].operation_price : 0,
										((result.JobAssignOperationManual[i].status_code != undefined) && (result.JobAssignOperationManual[i].status_code != null)) ? result.JobAssignOperationManual[i].status_code : 0, 0, ((result.JobAssignOperationManual[i].created != undefined) && (result.JobAssignOperationManual[i].created != null)) ? result.JobAssignOperationManual[i].created : '',
										((result.JobAssignOperationManual[i].created_by != undefined) && (result.JobAssignOperationManual[i].created_by != null)) ? result.JobAssignOperationManual[i].created_by : 0, ((result.JobAssignOperationManual[i].modified_by != undefined) && (result.JobAssignOperationManual[i].modified_by != null)) ? result.JobAssignOperationManual[i].modified_by : 0,
										((result.JobAssignOperationManual[i].modified != undefined) && (result.JobAssignOperationManual[i].modified != null)) ? result.JobAssignOperationManual[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_assigned_operation_manual_table');
			return;
		}
	},
	update_my_quote_operation_manual_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteOperationManual === undefined) || (result.QuoteOperationManual === null) || (result.QuoteOperationManual.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuoteOperationManual.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_operation_manual WHERE id=' + result.QuoteOperationManual[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuoteOperationManual[i].created === temp_created) && ((result.QuoteOperationManual[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_operation_manual SET local_id=?,company_id=?,quote_id=?,operation_user=?,operation_time=?,operation_duration=?,operation_rate=?,operation_price=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.QuoteOperationManual[i].id,
											((result.QuoteOperationManual[i].local_id != undefined) && (result.QuoteOperationManual[i].local_id != null)) ? result.QuoteOperationManual[i].local_id : '', ((result.QuoteOperationManual[i].company_id != undefined) && (result.QuoteOperationManual[i].company_id != null)) ? result.QuoteOperationManual[i].company_id : 0,
											((result.QuoteOperationManual[i].quote_id != undefined) && (result.QuoteOperationManual[i].quote_id != null)) ? result.QuoteOperationManual[i].quote_id : 0, ((result.QuoteOperationManual[i].operation_user != undefined) && (result.QuoteOperationManual[i].operation_user != null)) ? result.QuoteOperationManual[i].operation_user : '',
											((result.QuoteOperationManual[i].operation_time != undefined) && (result.QuoteOperationManual[i].operation_time != null)) ? result.QuoteOperationManual[i].operation_time : '', ((result.QuoteOperationManual[i].operation_duration != undefined) && (result.QuoteOperationManual[i].operation_duration != null)) ? result.QuoteOperationManual[i].operation_duration : '',
											((result.QuoteOperationManual[i].operation_rate != undefined) && (result.QuoteOperationManual[i].operation_rate != null)) ? result.QuoteOperationManual[i].operation_rate : '', ((result.QuoteOperationManual[i].operation_price != undefined) && (result.QuoteOperationManual[i].operation_price != null)) ? result.QuoteOperationManual[i].operation_price : 0,
											((result.QuoteOperationManual[i].status_code != undefined) && (result.QuoteOperationManual[i].status_code != null)) ? result.QuoteOperationManual[i].status_code : 0, 0, ((result.QuoteOperationManual[i].created != undefined) && (result.QuoteOperationManual[i].created != null)) ? result.QuoteOperationManual[i].created : '',
											((result.QuoteOperationManual[i].created_by != undefined) && (result.QuoteOperationManual[i].created_by != null)) ? result.QuoteOperationManual[i].created_by : 0, ((result.QuoteOperationManual[i].modified_by != undefined) && (result.QuoteOperationManual[i].modified_by != null)) ? result.QuoteOperationManual[i].modified_by : 0,
											((result.QuoteOperationManual[i].modified != undefined) && (result.QuoteOperationManual[i].modified != null)) ? result.QuoteOperationManual[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_operation_manual (id,local_id,company_id,quote_id,operation_user,operation_time,operation_duration,operation_rate,operation_price,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.QuoteOperationManual[i].id != undefined) && (result.QuoteOperationManual[i].id != null)) ? result.QuoteOperationManual[i].id : 0,
										((result.QuoteOperationManual[i].local_id != undefined) && (result.QuoteOperationManual[i].local_id != null)) ? result.QuoteOperationManual[i].local_id : '', ((result.QuoteOperationManual[i].company_id != undefined) && (result.QuoteOperationManual[i].company_id != null)) ? result.QuoteOperationManual[i].company_id : 0,
										((result.QuoteOperationManual[i].quote_id != undefined) && (result.QuoteOperationManual[i].quote_id != null)) ? result.QuoteOperationManual[i].quote_id : 0, ((result.QuoteOperationManual[i].operation_user != undefined) && (result.QuoteOperationManual[i].operation_user != null)) ? result.QuoteOperationManual[i].operation_user : '',
										((result.QuoteOperationManual[i].operation_time != undefined) && (result.QuoteOperationManual[i].operation_time != null)) ? result.QuoteOperationManual[i].operation_time : '', ((result.QuoteOperationManual[i].operation_duration != undefined) && (result.QuoteOperationManual[i].operation_duration != null)) ? result.QuoteOperationManual[i].operation_duration : '',
										((result.QuoteOperationManual[i].operation_rate != undefined) && (result.QuoteOperationManual[i].operation_rate != null)) ? result.QuoteOperationManual[i].operation_rate : '', ((result.QuoteOperationManual[i].operation_price != undefined) && (result.QuoteOperationManual[i].operation_price != null)) ? result.QuoteOperationManual[i].operation_price : 0,
										((result.QuoteOperationManual[i].status_code != undefined) && (result.QuoteOperationManual[i].status_code != null)) ? result.QuoteOperationManual[i].status_code : 0, 0, ((result.QuoteOperationManual[i].created != undefined) && (result.QuoteOperationManual[i].created != null)) ? result.QuoteOperationManual[i].created : '',
										((result.QuoteOperationManual[i].created_by != undefined) && (result.QuoteOperationManual[i].created_by != null)) ? result.QuoteOperationManual[i].created_by : 0, ((result.QuoteOperationManual[i].modified_by != undefined) && (result.QuoteOperationManual[i].modified_by != null)) ? result.QuoteOperationManual[i].modified_by : 0,
										((result.QuoteOperationManual[i].modified != undefined) && (result.QuoteOperationManual[i].modified != null)) ? result.QuoteOperationManual[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_operation_manual_table');
			return;
		}
	},
	update_my_quote_assigned_operation_manual_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.QuoteAssignOperationManual === undefined) || (result.QuoteAssignOperationManual === null) || (result.QuoteAssignOperationManual.length <= 0)) {
			} else {
				for (var i = 0, j = result.QuoteAssignOperationManual.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_quote_assigned_operation_manual WHERE id=' + result.QuoteAssignOperationManual[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.QuoteAssignOperationManual[i].created === temp_created) && ((result.QuoteAssignOperationManual[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_quote_assigned_operation_manual SET local_id=?,company_id=?,quote_print_id=?,quote_operation_manual_id=?,operation_user=?,operation_time=?,operation_duration=?,operation_rate=?,operation_price=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.QuoteAssignOperationManual[i].id,
											((result.QuoteAssignOperationManual[i].local_id != undefined) && (result.QuoteAssignOperationManual[i].local_id != null)) ? result.QuoteAssignOperationManual[i].local_id : '', ((result.QuoteAssignOperationManual[i].company_id != undefined) && (result.QuoteAssignOperationManual[i].company_id != null)) ? result.QuoteAssignOperationManual[i].company_id : 0,
											((result.QuoteAssignOperationManual[i].quoteprint_id != undefined) && (result.QuoteAssignOperationManual[i].quoteprint_id != null)) ? result.QuoteAssignOperationManual[i].quoteprint_id : 0, ((result.QuoteAssignOperationManual[i].quote_operation_manual_id != undefined) && (result.QuoteAssignOperationManual[i].quote_operation_manual_id != null)) ? result.QuoteAssignOperationManual[i].quote_operation_manual_id
															: 0, ((result.QuoteAssignOperationManual[i].operation_user != undefined) && (result.QuoteAssignOperationManual[i].operation_user != null)) ? result.QuoteAssignOperationManual[i].operation_user : '',
											((result.QuoteAssignOperationManual[i].operation_time != undefined) && (result.QuoteAssignOperationManual[i].operation_time != null)) ? result.QuoteAssignOperationManual[i].operation_time : '', ((result.QuoteAssignOperationManual[i].operation_duration != undefined) && (result.QuoteAssignOperationManual[i].operation_duration != null)) ? result.QuoteAssignOperationManual[i].operation_duration : '',
											((result.QuoteAssignOperationManual[i].operation_rate != undefined) && (result.QuoteAssignOperationManual[i].operation_rate != null)) ? result.QuoteAssignOperationManual[i].operation_rate : '', ((result.QuoteAssignOperationManual[i].operation_price != undefined) && (result.QuoteAssignOperationManual[i].operation_price != null)) ? result.QuoteAssignOperationManual[i].operation_price : 0,
											((result.QuoteAssignOperationManual[i].status_code != undefined) && (result.QuoteAssignOperationManual[i].status_code != null)) ? result.QuoteAssignOperationManual[i].status_code : 0, 0, ((result.QuoteAssignOperationManual[i].created != undefined) && (result.QuoteAssignOperationManual[i].created != null)) ? result.QuoteAssignOperationManual[i].created : '',
											((result.QuoteAssignOperationManual[i].created_by != undefined) && (result.QuoteAssignOperationManual[i].created_by != null)) ? result.QuoteAssignOperationManual[i].created_by : 0, ((result.QuoteAssignOperationManual[i].modified_by != undefined) && (result.QuoteAssignOperationManual[i].modified_by != null)) ? result.QuoteAssignOperationManual[i].modified_by : 0,
											((result.QuoteAssignOperationManual[i].modified != undefined) && (result.QuoteAssignOperationManual[i].modified != null)) ? result.QuoteAssignOperationManual[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_quote_assigned_operation_manual (id,local_id,company_id,quote_print_id,quote_operation_manual_id,operation_user,operation_time,operation_duration,operation_rate,operation_price,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
										((result.QuoteAssignOperationManual[i].id != undefined) && (result.QuoteAssignOperationManual[i].id != null)) ? result.QuoteAssignOperationManual[i].id : 0, ((result.QuoteAssignOperationManual[i].local_id != undefined) && (result.QuoteAssignOperationManual[i].local_id != null)) ? result.QuoteAssignOperationManual[i].local_id : '',
										((result.QuoteAssignOperationManual[i].company_id != undefined) && (result.QuoteAssignOperationManual[i].company_id != null)) ? result.QuoteAssignOperationManual[i].company_id : 0, ((result.QuoteAssignOperationManual[i].quoteprint_id != undefined) && (result.QuoteAssignOperationManual[i].quoteprint_id != null)) ? result.QuoteAssignOperationManual[i].quoteprint_id : 0,
										((result.QuoteAssignOperationManual[i].quote_operation_manual_id != undefined) && (result.QuoteAssignOperationManual[i].quote_operation_manual_id != null)) ? result.QuoteAssignOperationManual[i].quote_operation_manual_id : 0, ((result.QuoteAssignOperationManual[i].operation_user != undefined) && (result.QuoteAssignOperationManual[i].operation_user != null)) ? result.QuoteAssignOperationManual[i].operation_user : '',
										((result.QuoteAssignOperationManual[i].operation_time != undefined) && (result.QuoteAssignOperationManual[i].operation_time != null)) ? result.QuoteAssignOperationManual[i].operation_time : '', ((result.QuoteAssignOperationManual[i].operation_duration != undefined) && (result.QuoteAssignOperationManual[i].operation_duration != null)) ? result.QuoteAssignOperationManual[i].operation_duration : '',
										((result.QuoteAssignOperationManual[i].operation_rate != undefined) && (result.QuoteAssignOperationManual[i].operation_rate != null)) ? result.QuoteAssignOperationManual[i].operation_rate : '', ((result.QuoteAssignOperationManual[i].operation_price != undefined) && (result.QuoteAssignOperationManual[i].operation_price != null)) ? result.QuoteAssignOperationManual[i].operation_price : 0,
										((result.QuoteAssignOperationManual[i].status_code != undefined) && (result.QuoteAssignOperationManual[i].status_code != null)) ? result.QuoteAssignOperationManual[i].status_code : 0, 0, ((result.QuoteAssignOperationManual[i].created != undefined) && (result.QuoteAssignOperationManual[i].created != null)) ? result.QuoteAssignOperationManual[i].created : '',
										((result.QuoteAssignOperationManual[i].created_by != undefined) && (result.QuoteAssignOperationManual[i].created_by != null)) ? result.QuoteAssignOperationManual[i].created_by : 0, ((result.QuoteAssignOperationManual[i].modified_by != undefined) && (result.QuoteAssignOperationManual[i].modified_by != null)) ? result.QuoteAssignOperationManual[i].modified_by : 0,
										((result.QuoteAssignOperationManual[i].modified != undefined) && (result.QuoteAssignOperationManual[i].modified != null)) ? result.QuoteAssignOperationManual[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_quote_assigned_operation_manual_table');
			return;
		}
	},
	// update job count info table
	update_my_job_and_quote_count_info_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobCountInfo === undefined) || (result.JobCountInfo === null) || (result.JobCountInfo.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobCountInfo.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_and_quote_count_info WHERE date=\'' + result.JobCountInfo[i].date + '\'');
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						db.execute('UPDATE my_job_and_quote_count_info SET job_count=?,quote_count=? WHERE id=' + data_rows.fieldByName('id'), ((result.JobCountInfo[i].job_count != undefined) && (result.JobCountInfo[i].job_count != null)) ? result.JobCountInfo[i].job_count : 0, ((result.JobCountInfo[i].quote_count != undefined) && (result.JobCountInfo[i].quote_count != null)) ? result.JobCountInfo[i].quote_count : 0);
						data_rows.close();
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_and_quote_count_info (date,job_count,quote_count)' + 'VALUES(?,?,?)', ((result.JobCountInfo[i].date != undefined) && (result.JobCountInfo[i].date != null)) ? result.JobCountInfo[i].date : '', ((result.JobCountInfo[i].job_count != undefined) && (result.JobCountInfo[i].job_count != null)) ? result.JobCountInfo[i].job_count : 0,
										((result.JobCountInfo[i].quote_count != undefined) && (result.JobCountInfo[i].quote_count != null)) ? result.JobCountInfo[i].quote_count : 0);
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_and_quote_count_info_table');
			return;
		}
	},
	// update supplier tables
	update_my_supplier_type_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.SupplierTypeCode === undefined) || (result.SupplierTypeCode === null) || (result.SupplierTypeCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_supplier_type_code');
				for (var i = 0, j = result.SupplierTypeCode.length; i < j; i++) {
					db.execute('INSERT INTO my_supplier_type_code (code,name,description,abbr)VALUES(?,?,?,?)', ((result.SupplierTypeCode[i].code != undefined) && (result.SupplierTypeCode[i].code != null)) ? result.SupplierTypeCode[i].code : 0, ((result.SupplierTypeCode[i].name != undefined) && (result.SupplierTypeCode[i].name != null)) ? result.SupplierTypeCode[i].name : '',
									((result.SupplierTypeCode[i].description != undefined) && (result.SupplierTypeCode[i].description != null)) ? result.SupplierTypeCode[i].description : '', ((result.SupplierTypeCode[i].abbr != undefined) && (result.SupplierTypeCode[i].abbr != null)) ? result.SupplierTypeCode[i].abbr : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_supplier_type_code_table');
			return;
		}
	},
	update_my_suppliers_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.Suppliers === undefined) || (result.Suppliers === null) || (result.Suppliers.length <= 0)) {
			} else {
				for (var i = 0, j = result.Suppliers.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_suppliers WHERE id=' + result.Suppliers[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((result.Suppliers[i].created === temp_created) && ((result.Suppliers[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_suppliers SET local_id=?,company_id=?,reference_number=?,supplier_name=?,' + 'supplier_abbr=?,supplier_type_code=?,phone_mobile=?,phone=?,fax=?,skype_name=?,email=?,website=?,description=?,' + 'sub_number=?,unit_number=?,street_number=?,street=?,postcode=?,street_type=?,suburb=?,locality_street_id=?,locality_street_type_id=?,'
											+ 'locality_suburb_id=?,locality_state_id=?,locality_address_id=?,latitude=?,longitude=?,point=?,boundary=?,geo_source_code=?,geo_accuracy_code=?,' + 'postal_address=?,abn=?,billing_name=?,billing_sub_number=?,billing_unit_number=?,billing_street_number=?,billing_street=?,billing_street_type=?'
											+ 'billing_suburb=?,billing_postcode=?,billing_locality_street_id=?,billing_locality_street_type_id=?,billing_locality_suburb_id=?,billing_locality_state_id=?,billing_locality_address_id=?,' + 'account_external_reference=?,account_mark_up=?,account_payment_terms=?,account_payment_comments=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? ' + 'WHERE id=' + result.Suppliers[i].id,
											((result.Suppliers[i].local_id != undefined) && (result.Suppliers[i].local_id != null)) ? result.Suppliers[i].local_id : '', ((result.Suppliers[i].company_id != undefined) && (result.Suppliers[i].company_id != null)) ? result.Suppliers[i].company_id : 0, ((result.Suppliers[i].reference_number != undefined) && (result.Suppliers[i].reference_number != null)) ? result.Suppliers[i].reference_number : 0,
											((result.Suppliers[i].supplier_name != undefined) && (result.Suppliers[i].supplier_name != null)) ? result.Suppliers[i].supplier_name : '', ((result.Suppliers[i].supplier_abbr != undefined) && (result.Suppliers[i].supplier_abbr != null)) ? result.Suppliers[i].supplier_abbr : '',
											((result.Suppliers[i].supplier_type_code != undefined) && (result.Suppliers[i].supplier_type_code != null)) ? result.Suppliers[i].supplier_type_code : 0, ((result.Suppliers[i].phone_mobile != undefined) && (result.Suppliers[i].phone_mobile != null)) ? result.Suppliers[i].phone_mobile : '', ((result.Suppliers[i].phone != undefined) && (result.Suppliers[i].phone != null)) ? result.Suppliers[i].phone : '',
											((result.Suppliers[i].fax != undefined) && (result.Suppliers[i].fax != null)) ? result.Suppliers[i].fax : '', ((result.Suppliers[i].skype_name != undefined) && (result.Suppliers[i].skype_name != null)) ? result.Suppliers[i].skype_name : '', ((result.Suppliers[i].email != undefined) && (result.Suppliers[i].email != null)) ? result.Suppliers[i].email : '',
											((result.Suppliers[i].website != undefined) && (result.Suppliers[i].website != null)) ? result.Suppliers[i].website : '', ((result.Suppliers[i].description != undefined) && (result.Suppliers[i].description != null)) ? result.Suppliers[i].description : '', ((result.Suppliers[i].sub_number != undefined) && (result.Suppliers[i].sub_number != null)) ? result.Suppliers[i].sub_number : '',
											((result.Suppliers[i].unit_number != undefined) && (result.Suppliers[i].unit_number != null)) ? result.Suppliers[i].unit_number : '', ((result.Suppliers[i].street_number != undefined) && (result.Suppliers[i].street_number != null)) ? result.Suppliers[i].street_number : '', ((result.Suppliers[i].street != undefined) && (result.Suppliers[i].street != null)) ? result.Suppliers[i].street : '',
											((result.Suppliers[i].postcode != undefined) && (result.Suppliers[i].postcode != null)) ? result.Suppliers[i].postcode : '', ((result.Suppliers[i].street_type != undefined) && (result.Suppliers[i].street_type != null)) ? result.Suppliers[i].street_type : '', ((result.Suppliers[i].suburb != undefined) && (result.Suppliers[i].suburb != null)) ? result.Suppliers[i].suburb : '',
											((result.Suppliers[i].locality_street_id != undefined) && (result.Suppliers[i].locality_street_id != null)) ? result.Suppliers[i].locality_street_id : 0, ((result.Suppliers[i].locality_street_type_id != undefined) && (result.Suppliers[i].locality_street_type_id != null)) ? result.Suppliers[i].locality_street_type_id : 0,
											((result.Suppliers[i].locality_suburb_id != undefined) && (result.Suppliers[i].locality_suburb_id != null)) ? result.Suppliers[i].locality_suburb_id : 0, ((result.Suppliers[i].locality_state_id != undefined) && (result.Suppliers[i].locality_state_id != null)) ? result.Suppliers[i].locality_state_id : 0,
											((result.Suppliers[i].locality_address_id != undefined) && (result.Suppliers[i].locality_address_id != null)) ? result.Suppliers[i].locality_address_id : 0, ((result.Suppliers[i].latitude != undefined) && (result.Suppliers[i].latitude != null)) ? result.Suppliers[i].latitude : 0, ((result.Suppliers[i].longitude != undefined) && (result.Suppliers[i].longitude != null)) ? result.Suppliers[i].longitude : 0,
											((result.Suppliers[i].point != undefined) && (result.Suppliers[i].point != null)) ? result.Suppliers[i].point : '', ((result.Suppliers[i].boundary != undefined) && (result.Suppliers[i].boundary != null)) ? result.Suppliers[i].boundary : '', ((result.Suppliers[i].geo_source_code != undefined) && (result.Suppliers[i].geo_source_code != null)) ? result.Suppliers[i].geo_source_code : 0,
											((result.Suppliers[i].geo_accuracy_code != undefined) && (result.Suppliers[i].geo_accuracy_code != null)) ? result.Suppliers[i].geo_accuracy_code : 0, ((result.Suppliers[i].postal_address != undefined) && (result.Suppliers[i].postal_address != null)) ? result.Suppliers[i].postal_address : '', ((result.Suppliers[i].abn != undefined) && (result.Suppliers[i].abn != null)) ? result.Suppliers[i].abn : '',
											((result.Suppliers[i].billing_name != undefined) && (result.Suppliers[i].billing_name != null)) ? result.Suppliers[i].billing_name : '', ((result.Suppliers[i].billing_sub_number != undefined) && (result.Suppliers[i].billing_sub_number != null)) ? result.Suppliers[i].billing_sub_number : '',
											((result.Suppliers[i].billing_unit_number != undefined) && (result.Suppliers[i].billing_unit_number != null)) ? result.Suppliers[i].billing_unit_number : '', ((result.Suppliers[i].billing_street_number != undefined) && (result.Suppliers[i].billing_street_number != null)) ? result.Suppliers[i].billing_street_number : '',
											((result.Suppliers[i].billing_street != undefined) && (result.Suppliers[i].billing_street != null)) ? result.Suppliers[i].billing_street : '', ((result.Suppliers[i].billing_street_type != undefined) && (result.Suppliers[i].billing_street_type != null)) ? result.Suppliers[i].billing_street_type : '',
											((result.Suppliers[i].billing_suburb != undefined) && (result.Suppliers[i].billing_suburb != null)) ? result.Suppliers[i].billing_suburb : '', ((result.Suppliers[i].billing_postcode != undefined) && (result.Suppliers[i].billing_postcode != null)) ? result.Suppliers[i].billing_postcode : '',
											((result.Suppliers[i].billing_locality_street_id != undefined) && (result.Suppliers[i].billing_locality_street_id != null)) ? result.Suppliers[i].billing_locality_street_id : 0, ((result.Suppliers[i].billing_locality_street_type_id != undefined) && (result.Suppliers[i].billing_locality_street_type_id != null)) ? result.Suppliers[i].billing_locality_street_type_id : 0,
											((result.Suppliers[i].billing_locality_suburb_id != undefined) && (result.Suppliers[i].billing_locality_suburb_id != null)) ? result.Suppliers[i].billing_locality_suburb_id : 0, ((result.Suppliers[i].billing_locality_state_id != undefined) && (result.Suppliers[i].billing_locality_state_id != null)) ? result.Suppliers[i].billing_locality_state_id : 0,
											((result.Suppliers[i].billing_locality_address_id != undefined) && (result.Suppliers[i].billing_locality_address_id != null)) ? result.Suppliers[i].billing_locality_address_id : 0, ((result.Suppliers[i].account_external_reference != undefined) && (result.Suppliers[i].account_external_reference != null)) ? result.Suppliers[i].account_external_reference : '',
											((result.Suppliers[i].account_mark_up != undefined) && (result.Suppliers[i].account_mark_up != null)) ? result.Suppliers[i].account_mark_up : 0, ((result.Suppliers[i].account_payment_terms != undefined) && (result.Suppliers[i].account_payment_terms != null)) ? result.Suppliers[i].account_payment_terms : '',
											((result.Suppliers[i].account_payment_comments != undefined) && (result.Suppliers[i].account_payment_comments != null)) ? result.Suppliers[i].account_payment_comments : '', ((result.Suppliers[i].status_code != undefined) && (result.Suppliers[i].status_code != null)) ? result.Suppliers[i].status_code : 0, 0,
											((result.Suppliers[i].created != undefined) && (result.Suppliers[i].created != null)) ? result.Suppliers[i].created : '', ((result.Suppliers[i].created_by != undefined) && (result.Suppliers[i].created_by != null)) ? result.Suppliers[i].created_by : 0, ((result.Suppliers[i].modified_by != undefined) && (result.Suppliers[i].modified_by != null)) ? result.Suppliers[i].modified_by : 0,
											((result.Suppliers[i].modified != undefined) && (result.Suppliers[i].modified != null)) ? result.Suppliers[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_suppliers (id,local_id,company_id,reference_number,supplier_name,' + 'supplier_abbr,supplier_type_code,phone_mobile,phone,fax,skype_name,email,website,description,' + 'sub_number,unit_number,street_number,street,postcode,street_type,suburb,locality_street_id,locality_street_type_id,' + 'locality_suburb_id,locality_state_id,locality_address_id,latitude,longitude,point,boundary,geo_source_code,geo_accuracy_code,'
										+ 'postal_address,abn,billing_name,billing_sub_number,billing_unit_number,billing_street_number,billing_street,billing_street_type,' + 'billing_suburb,billing_postcode,billing_locality_street_id,billing_locality_street_type_id,billing_locality_suburb_id,billing_locality_state_id,billing_locality_address_id,' + 'account_external_reference,account_mark_up,account_payment_terms,account_payment_comments,'
										+ 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.Suppliers[i].id != undefined) && (result.Suppliers[i].id != null)) ? result.Suppliers[i].id : 0, ((result.Suppliers[i].local_id != undefined) && (result.Suppliers[i].local_id != null)) ? result.Suppliers[i].local_id
										: '', ((result.Suppliers[i].company_id != undefined) && (result.Suppliers[i].company_id != null)) ? result.Suppliers[i].company_id : 0, ((result.Suppliers[i].reference_number != undefined) && (result.Suppliers[i].reference_number != null)) ? result.Suppliers[i].reference_number : 0, ((result.Suppliers[i].supplier_name != undefined) && (result.Suppliers[i].supplier_name != null)) ? result.Suppliers[i].supplier_name
										: '', ((result.Suppliers[i].supplier_abbr != undefined) && (result.Suppliers[i].supplier_abbr != null)) ? result.Suppliers[i].supplier_abbr : '', ((result.Suppliers[i].supplier_type_code != undefined) && (result.Suppliers[i].supplier_type_code != null)) ? result.Suppliers[i].supplier_type_code : 0,
										((result.Suppliers[i].phone_mobile != undefined) && (result.Suppliers[i].phone_mobile != null)) ? result.Suppliers[i].phone_mobile : '', ((result.Suppliers[i].phone != undefined) && (result.Suppliers[i].phone != null)) ? result.Suppliers[i].phone : '', ((result.Suppliers[i].fax != undefined) && (result.Suppliers[i].fax != null)) ? result.Suppliers[i].fax : '',
										((result.Suppliers[i].skype_name != undefined) && (result.Suppliers[i].skype_name != null)) ? result.Suppliers[i].skype_name : '', ((result.Suppliers[i].email != undefined) && (result.Suppliers[i].email != null)) ? result.Suppliers[i].email : '', ((result.Suppliers[i].website != undefined) && (result.Suppliers[i].website != null)) ? result.Suppliers[i].website : '',
										((result.Suppliers[i].description != undefined) && (result.Suppliers[i].description != null)) ? result.Suppliers[i].description : '', ((result.Suppliers[i].sub_number != undefined) && (result.Suppliers[i].sub_number != null)) ? result.Suppliers[i].sub_number : '', ((result.Suppliers[i].unit_number != undefined) && (result.Suppliers[i].unit_number != null)) ? result.Suppliers[i].unit_number : '',
										((result.Suppliers[i].street_number != undefined) && (result.Suppliers[i].street_number != null)) ? result.Suppliers[i].street_number : '', ((result.Suppliers[i].street != undefined) && (result.Suppliers[i].street != null)) ? result.Suppliers[i].street : '', ((result.Suppliers[i].postcode != undefined) && (result.Suppliers[i].postcode != null)) ? result.Suppliers[i].postcode : '',
										((result.Suppliers[i].street_type != undefined) && (result.Suppliers[i].street_type != null)) ? result.Suppliers[i].street_type : '', ((result.Suppliers[i].suburb != undefined) && (result.Suppliers[i].suburb != null)) ? result.Suppliers[i].suburb : '', ((result.Suppliers[i].locality_street_id != undefined) && (result.Suppliers[i].locality_street_id != null)) ? result.Suppliers[i].locality_street_id : 0,
										((result.Suppliers[i].locality_street_type_id != undefined) && (result.Suppliers[i].locality_street_type_id != null)) ? result.Suppliers[i].locality_street_type_id : 0, ((result.Suppliers[i].locality_suburb_id != undefined) && (result.Suppliers[i].locality_suburb_id != null)) ? result.Suppliers[i].locality_suburb_id : 0,
										((result.Suppliers[i].locality_state_id != undefined) && (result.Suppliers[i].locality_state_id != null)) ? result.Suppliers[i].locality_state_id : 0, ((result.Suppliers[i].locality_address_id != undefined) && (result.Suppliers[i].locality_address_id != null)) ? result.Suppliers[i].locality_address_id : 0,
										((result.Suppliers[i].latitude != undefined) && (result.Suppliers[i].latitude != null)) ? result.Suppliers[i].latitude : 0, ((result.Suppliers[i].longitude != undefined) && (result.Suppliers[i].longitude != null)) ? result.Suppliers[i].longitude : 0, ((result.Suppliers[i].point != undefined) && (result.Suppliers[i].point != null)) ? result.Suppliers[i].point : '',
										((result.Suppliers[i].boundary != undefined) && (result.Suppliers[i].boundary != null)) ? result.Suppliers[i].boundary : '', ((result.Suppliers[i].geo_source_code != undefined) && (result.Suppliers[i].geo_source_code != null)) ? result.Suppliers[i].geo_source_code : 0,
										((result.Suppliers[i].geo_accuracy_code != undefined) && (result.Suppliers[i].geo_accuracy_code != null)) ? result.Suppliers[i].geo_accuracy_code : 0, ((result.Suppliers[i].postal_address != undefined) && (result.Suppliers[i].postal_address != null)) ? result.Suppliers[i].postal_address : '', ((result.Suppliers[i].abn != undefined) && (result.Suppliers[i].abn != null)) ? result.Suppliers[i].abn : '',
										((result.Suppliers[i].billing_name != undefined) && (result.Suppliers[i].billing_name != null)) ? result.Suppliers[i].billing_name : '', ((result.Suppliers[i].billing_sub_number != undefined) && (result.Suppliers[i].billing_sub_number != null)) ? result.Suppliers[i].billing_sub_number : '',
										((result.Suppliers[i].billing_unit_number != undefined) && (result.Suppliers[i].billing_unit_number != null)) ? result.Suppliers[i].billing_unit_number : '', ((result.Suppliers[i].billing_street_number != undefined) && (result.Suppliers[i].billing_street_number != null)) ? result.Suppliers[i].billing_street_number : '',
										((result.Suppliers[i].billing_street != undefined) && (result.Suppliers[i].billing_street != null)) ? result.Suppliers[i].billing_street : '', ((result.Suppliers[i].billing_street_type != undefined) && (result.Suppliers[i].billing_street_type != null)) ? result.Suppliers[i].billing_street_type : '',
										((result.Suppliers[i].billing_suburb != undefined) && (result.Suppliers[i].billing_suburb != null)) ? result.Suppliers[i].billing_suburb : '', ((result.Suppliers[i].billing_postcode != undefined) && (result.Suppliers[i].billing_postcode != null)) ? result.Suppliers[i].billing_postcode : '',
										((result.Suppliers[i].billing_locality_street_id != undefined) && (result.Suppliers[i].billing_locality_street_id != null)) ? result.Suppliers[i].billing_locality_street_id : 0, ((result.Suppliers[i].billing_locality_street_type_id != undefined) && (result.Suppliers[i].billing_locality_street_type_id != null)) ? result.Suppliers[i].billing_locality_street_type_id : 0,
										((result.Suppliers[i].billing_locality_suburb_id != undefined) && (result.Suppliers[i].billing_locality_suburb_id != null)) ? result.Suppliers[i].billing_locality_suburb_id : 0, ((result.Suppliers[i].billing_locality_state_id != undefined) && (result.Suppliers[i].billing_locality_state_id != null)) ? result.Suppliers[i].billing_locality_state_id : 0,
										((result.Suppliers[i].billing_locality_address_id != undefined) && (result.Suppliers[i].billing_locality_address_id != null)) ? result.Suppliers[i].billing_locality_address_id : 0, ((result.Suppliers[i].account_external_reference != undefined) && (result.Suppliers[i].account_external_reference != null)) ? result.Suppliers[i].account_external_reference : '',
										((result.Suppliers[i].account_mark_up != undefined) && (result.Suppliers[i].account_mark_up != null)) ? result.Suppliers[i].account_mark_up : 0, ((result.Suppliers[i].account_payment_terms != undefined) && (result.Suppliers[i].account_payment_terms != null)) ? result.Suppliers[i].account_payment_terms : '',
										((result.Suppliers[i].account_payment_comments != undefined) && (result.Suppliers[i].account_payment_comments != null)) ? result.Suppliers[i].account_payment_comments : '', ((result.Suppliers[i].status_code != undefined) && (result.Suppliers[i].status_code != null)) ? result.Suppliers[i].status_code : 0, 0,
										((result.Suppliers[i].created != undefined) && (result.Suppliers[i].created != null)) ? result.Suppliers[i].created : '', ((result.Suppliers[i].created_by != undefined) && (result.Suppliers[i].created_by != null)) ? result.Suppliers[i].created_by : 0, ((result.Suppliers[i].modified_by != undefined) && (result.Suppliers[i].modified_by != null)) ? result.Suppliers[i].modified_by : 0,
										((result.Suppliers[i].modified != undefined) && (result.Suppliers[i].modified != null)) ? result.Suppliers[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_suppliers_table');
			return;
		}
	},
	update_my_suppliers_contact_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.Suppliers === undefined) || (result.SuppliersContact === null) || (result.SuppliersContact.length <= 0)) {
			} else {
				for (var i = 0, j = result.SuppliersContact.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_suppliers_contact WHERE id=' + result.SuppliersContact[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((result.SuppliersContact[i].created === temp_created) && ((result.SuppliersContact[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_suppliers_contact SET local_id=?,suppliers_id=?,display_name=?,salutation_code=?,' + 'first_name=?,last_name=?,position=?,phone_mobile=?,phone=?,fax=?,skype_name=?,email=?,dob=?,website=?,note=?,' + 'username=?,password=?,enable_login=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? ' + 'WHERE id=' + result.SuppliersContact[i].id,
											((result.SuppliersContact[i].local_id != undefined) && (result.SuppliersContact[i].local_id != null)) ? result.SuppliersContact[i].local_id : '', ((result.SuppliersContact[i].suppliers_id != undefined) && (result.SuppliersContact[i].suppliers_id != null)) ? result.SuppliersContact[i].suppliers_id : 0,
											((result.SuppliersContact[i].display_name != undefined) && (result.SuppliersContact[i].display_name != null)) ? result.SuppliersContact[i].display_name : '', ((result.SuppliersContact[i].salutation_code != undefined) && (result.SuppliersContact[i].salutation_code != null)) ? result.SuppliersContact[i].salutation_code : 0,
											((result.SuppliersContact[i].first_name != undefined) && (result.SuppliersContact[i].first_name != null)) ? result.SuppliersContact[i].first_name : '', ((result.SuppliersContact[i].last_name != undefined) && (result.SuppliersContact[i].last_name != null)) ? result.SuppliersContact[i].last_name : '',
											((result.SuppliersContact[i].position != undefined) && (result.SuppliersContact[i].position != null)) ? result.SuppliersContact[i].position : '', ((result.SuppliersContact[i].phone_mobile != undefined) && (result.SuppliersContact[i].phone_mobile != null)) ? result.SuppliersContact[i].phone_mobile : '',
											((result.SuppliersContact[i].phone != undefined) && (result.SuppliersContact[i].phone != null)) ? result.SuppliersContact[i].phone : '', ((result.SuppliersContact[i].fax != undefined) && (result.SuppliersContact[i].fax != null)) ? result.SuppliersContact[i].fax : '',
											((result.SuppliersContact[i].skype_name != undefined) && (result.SuppliersContact[i].skype_name != null)) ? result.SuppliersContact[i].skype_name : '', ((result.SuppliersContact[i].email != undefined) && (result.SuppliersContact[i].email != null)) ? result.SuppliersContact[i].email : '',
											((result.SuppliersContact[i].dob != undefined) && (result.SuppliersContact[i].dob != null)) ? result.SuppliersContact[i].dob : '', ((result.SuppliersContact[i].website != undefined) && (result.SuppliersContact[i].website != null)) ? result.SuppliersContact[i].website : '', ((result.SuppliersContact[i].note != undefined) && (result.SuppliersContact[i].note != null)) ? result.SuppliersContact[i].note : '',
											((result.SuppliersContact[i].username != undefined) && (result.SuppliersContact[i].username != null)) ? result.SuppliersContact[i].username : '', ((result.SuppliersContact[i].password != undefined) && (result.SuppliersContact[i].password != null)) ? result.SuppliersContact[i].password : '',
											((result.SuppliersContact[i].enable_login != undefined) && (result.SuppliersContact[i].enable_login != null)) ? result.SuppliersContact[i].enable_login : 0, ((result.SuppliersContact[i].status_code != undefined) && (result.SuppliersContact[i].status_code != null)) ? result.SuppliersContact[i].status_code : 0, 0,
											((result.SuppliersContact[i].created != undefined) && (result.SuppliersContact[i].created != null)) ? result.SuppliersContact[i].created : '', ((result.SuppliersContact[i].created_by != undefined) && (result.SuppliersContact[i].created_by != null)) ? result.SuppliersContact[i].created_by : 0,
											((result.SuppliersContact[i].modified_by != undefined) && (result.SuppliersContact[i].modified_by != null)) ? result.SuppliersContact[i].modified_by : 0, ((result.SuppliersContact[i].modified != undefined) && (result.SuppliersContact[i].modified != null)) ? result.SuppliersContact[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_suppliers_contact (id,local_id,suppliers_id,display_name,salutation_code,' + 'first_name,last_name,position,phone_mobile,phone,fax,skype_name,email,dob,website,note,' + 'username,password,enable_login,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
										((result.SuppliersContact[i].id != undefined) && (result.SuppliersContact[i].id != null)) ? result.SuppliersContact[i].id : 0, ((result.SuppliersContact[i].local_id != undefined) && (result.SuppliersContact[i].local_id != null)) ? result.SuppliersContact[i].local_id : '',
										((result.SuppliersContact[i].suppliers_id != undefined) && (result.SuppliersContact[i].suppliers_id != null)) ? result.SuppliersContact[i].suppliers_id : 0, ((result.SuppliersContact[i].display_name != undefined) && (result.SuppliersContact[i].display_name != null)) ? result.SuppliersContact[i].display_name : '',
										((result.SuppliersContact[i].salutation_code != undefined) && (result.SuppliersContact[i].salutation_code != null)) ? result.SuppliersContact[i].salutation_code : 0, ((result.SuppliersContact[i].first_name != undefined) && (result.SuppliersContact[i].first_name != null)) ? result.SuppliersContact[i].first_name : '',
										((result.SuppliersContact[i].last_name != undefined) && (result.SuppliersContact[i].last_name != null)) ? result.SuppliersContact[i].last_name : '', ((result.SuppliersContact[i].position != undefined) && (result.SuppliersContact[i].position != null)) ? result.SuppliersContact[i].position : '',
										((result.SuppliersContact[i].phone_mobile != undefined) && (result.SuppliersContact[i].phone_mobile != null)) ? result.SuppliersContact[i].phone_mobile : '', ((result.SuppliersContact[i].phone != undefined) && (result.SuppliersContact[i].phone != null)) ? result.SuppliersContact[i].phone : '', ((result.SuppliersContact[i].fax != undefined) && (result.SuppliersContact[i].fax != null)) ? result.SuppliersContact[i].fax
														: '', ((result.SuppliersContact[i].skype_name != undefined) && (result.SuppliersContact[i].skype_name != null)) ? result.SuppliersContact[i].skype_name : '', ((result.SuppliersContact[i].email != undefined) && (result.SuppliersContact[i].email != null)) ? result.SuppliersContact[i].email : '',
										((result.SuppliersContact[i].dob != undefined) && (result.SuppliersContact[i].dob != null)) ? result.SuppliersContact[i].dob : '', ((result.SuppliersContact[i].website != undefined) && (result.SuppliersContact[i].website != null)) ? result.SuppliersContact[i].website : '', ((result.SuppliersContact[i].note != undefined) && (result.SuppliersContact[i].note != null)) ? result.SuppliersContact[i].note : '',
										((result.SuppliersContact[i].username != undefined) && (result.SuppliersContact[i].username != null)) ? result.SuppliersContact[i].username : '', ((result.SuppliersContact[i].password != undefined) && (result.SuppliersContact[i].password != null)) ? result.SuppliersContact[i].password : '',
										((result.SuppliersContact[i].enable_login != undefined) && (result.SuppliersContact[i].enable_login != null)) ? result.SuppliersContact[i].enable_login : 0, ((result.SuppliersContact[i].status_code != undefined) && (result.SuppliersContact[i].status_code != null)) ? result.SuppliersContact[i].status_code : 0, 0,
										((result.SuppliersContact[i].created != undefined) && (result.SuppliersContact[i].created != null)) ? result.SuppliersContact[i].created : '', ((result.SuppliersContact[i].created_by != undefined) && (result.SuppliersContact[i].created_by != null)) ? result.SuppliersContact[i].created_by : 0,
										((result.SuppliersContact[i].modified_by != undefined) && (result.SuppliersContact[i].modified_by != null)) ? result.SuppliersContact[i].modified_by : 0, ((result.SuppliersContact[i].modified != undefined) && (result.SuppliersContact[i].modified != null)) ? result.SuppliersContact[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_suppliers_contact_table');
			return;
		}
	},
	update_my_purchase_order_status_code_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.PurchaseOrderStatusCode === undefined) || (result.PurchaseOrderStatusCode === null) || (result.PurchaseOrderStatusCode.length <= 0)) {
			} else {
				db.execute('DELETE FROM my_purchase_order_status_code');
				for (var i = 0, j = result.PurchaseOrderStatusCode.length; i < j; i++) {
					db.execute('INSERT INTO my_purchase_order_status_code (code,name,description,abbr)VALUES(?,?,?,?)', ((result.PurchaseOrderStatusCode[i].code != undefined) && (result.PurchaseOrderStatusCode[i].code != null)) ? result.PurchaseOrderStatusCode[i].code : 0, ((result.PurchaseOrderStatusCode[i].name != undefined) && (result.PurchaseOrderStatusCode[i].name != null)) ? result.PurchaseOrderStatusCode[i].name : '',
									((result.PurchaseOrderStatusCode[i].description != undefined) && (result.PurchaseOrderStatusCode[i].description != null)) ? result.PurchaseOrderStatusCode[i].description : '', ((result.PurchaseOrderStatusCode[i].abbr != undefined) && (result.PurchaseOrderStatusCode[i].abbr != null)) ? result.PurchaseOrderStatusCode[i].abbr : '');
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_purchase_order_status_code_table');
			return;
		}
	},
	update_my_purchase_order_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.PurchaseOrder === undefined) || (result.PurchaseOrder === null) || (result.PurchaseOrder.length <= 0)) {
			} else {
				for (var i = 0, j = result.PurchaseOrder.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_purchase_order WHERE id=' + result.PurchaseOrder[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((result.PurchaseOrder[i].created === temp_created) && ((result.PurchaseOrder[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_purchase_order SET local_id=?,company_id=?,reference_number=?,quote_id=?,' + 'job_id=?,purchase_order_status_code=?,purchase_order_template_id=?,purchase_order_date=?,description=?,' + 'job_address=?,purchase_address=?,purchase_order_comments=?,path=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? ' + 'WHERE id=' + result.PurchaseOrder[i].id,
											((result.PurchaseOrder[i].local_id != undefined) && (result.PurchaseOrder[i].local_id != null)) ? result.PurchaseOrder[i].local_id : '', ((result.PurchaseOrder[i].company_id != undefined) && (result.PurchaseOrder[i].company_id != null)) ? result.PurchaseOrder[i].company_id : 0,
											((result.PurchaseOrder[i].reference_number != undefined) && (result.PurchaseOrder[i].reference_number != null)) ? result.PurchaseOrder[i].reference_number : 0, ((result.PurchaseOrder[i].quote_id != undefined) && (result.PurchaseOrder[i].quote_id != null)) ? result.PurchaseOrder[i].quote_id : 0,
											((result.PurchaseOrder[i].job_id != undefined) && (result.PurchaseOrder[i].job_id != null)) ? result.PurchaseOrder[i].job_id : 0, ((result.PurchaseOrder[i].purchase_order_status_code != undefined) && (result.PurchaseOrder[i].purchase_order_status_code != null)) ? result.PurchaseOrder[i].purchase_order_status_code : 0,
											((result.PurchaseOrder[i].purchase_order_template_id != undefined) && (result.PurchaseOrder[i].purchase_order_template_id != null)) ? result.PurchaseOrder[i].purchase_order_template_id : 0, ((result.PurchaseOrder[i].purchase_order_date != undefined) && (result.PurchaseOrder[i].purchase_order_date != null)) ? result.PurchaseOrder[i].purchase_order_date : '',
											((result.PurchaseOrder[i].description != undefined) && (result.PurchaseOrder[i].description != null)) ? result.PurchaseOrder[i].description : '', ((result.PurchaseOrder[i].job_address != undefined) && (result.PurchaseOrder[i].job_address != null)) ? result.PurchaseOrder[i].job_address : '',
											((result.PurchaseOrder[i].purchase_address != undefined) && (result.PurchaseOrder[i].purchase_address != null)) ? result.PurchaseOrder[i].purchase_address : '', ((result.PurchaseOrder[i].purchase_order_comments != undefined) && (result.PurchaseOrder[i].purchase_order_comments != null)) ? result.PurchaseOrder[i].purchase_order_comments : '',
											((result.PurchaseOrder[i].path != undefined) && (result.PurchaseOrder[i].path != null)) ? result.PurchaseOrder[i].path : '', ((result.PurchaseOrder[i].status_code != undefined) && (result.PurchaseOrder[i].status_code != null)) ? result.PurchaseOrder[i].status_code : 0, 0, ((result.PurchaseOrder[i].created != undefined) && (result.PurchaseOrder[i].created != null)) ? result.PurchaseOrder[i].created : '',
											((result.PurchaseOrder[i].created_by != undefined) && (result.PurchaseOrder[i].created_by != null)) ? result.PurchaseOrder[i].created_by : 0, ((result.PurchaseOrder[i].modified_by != undefined) && (result.PurchaseOrder[i].modified_by != null)) ? result.PurchaseOrder[i].modified_by : 0,
											((result.PurchaseOrder[i].modified != undefined) && (result.PurchaseOrder[i].modified != null)) ? result.PurchaseOrder[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_purchase_order (id,local_id,company_id,reference_number,quote_id,' + 'job_id,purchase_order_status_code,purchase_order_template_id,purchase_order_date,description,' + 'job_address,purchase_address,purchase_order_comments,path,' + 'status_code,changed,created,created_by,modified_by,modified) ' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
										((result.PurchaseOrder[i].id != undefined) && (result.PurchaseOrder[i].id != null)) ? result.PurchaseOrder[i].id : 0, ((result.PurchaseOrder[i].local_id != undefined) && (result.PurchaseOrder[i].local_id != null)) ? result.PurchaseOrder[i].local_id : '', ((result.PurchaseOrder[i].company_id != undefined) && (result.PurchaseOrder[i].company_id != null)) ? result.PurchaseOrder[i].company_id : 0,
										((result.PurchaseOrder[i].reference_number != undefined) && (result.PurchaseOrder[i].reference_number != null)) ? result.PurchaseOrder[i].reference_number : 0, ((result.PurchaseOrder[i].quote_id != undefined) && (result.PurchaseOrder[i].quote_id != null)) ? result.PurchaseOrder[i].quote_id : 0,
										((result.PurchaseOrder[i].job_id != undefined) && (result.PurchaseOrder[i].job_id != null)) ? result.PurchaseOrder[i].job_id : 0, ((result.PurchaseOrder[i].purchase_order_status_code != undefined) && (result.PurchaseOrder[i].purchase_order_status_code != null)) ? result.PurchaseOrder[i].purchase_order_status_code : 0,
										((result.PurchaseOrder[i].purchase_order_template_id != undefined) && (result.PurchaseOrder[i].purchase_order_template_id != null)) ? result.PurchaseOrder[i].purchase_order_template_id : 0, ((result.PurchaseOrder[i].purchase_order_date != undefined) && (result.PurchaseOrder[i].purchase_order_date != null)) ? result.PurchaseOrder[i].purchase_order_date : '',
										((result.PurchaseOrder[i].description != undefined) && (result.PurchaseOrder[i].description != null)) ? result.PurchaseOrder[i].description : '', ((result.PurchaseOrder[i].job_address != undefined) && (result.PurchaseOrder[i].job_address != null)) ? result.PurchaseOrder[i].job_address : '',
										((result.PurchaseOrder[i].purchase_address != undefined) && (result.PurchaseOrder[i].purchase_address != null)) ? result.PurchaseOrder[i].purchase_address : '', ((result.PurchaseOrder[i].purchase_order_comments != undefined) && (result.PurchaseOrder[i].purchase_order_comments != null)) ? result.PurchaseOrder[i].purchase_order_comments : '',
										((result.PurchaseOrder[i].path != undefined) && (result.PurchaseOrder[i].path != null)) ? result.PurchaseOrder[i].path : '', ((result.PurchaseOrder[i].status_code != undefined) && (result.PurchaseOrder[i].status_code != null)) ? result.PurchaseOrder[i].status_code : 0, 0, ((result.PurchaseOrder[i].created != undefined) && (result.PurchaseOrder[i].created != null)) ? result.PurchaseOrder[i].created : '',
										((result.PurchaseOrder[i].created_by != undefined) && (result.PurchaseOrder[i].created_by != null)) ? result.PurchaseOrder[i].created_by : 0, ((result.PurchaseOrder[i].modified_by != undefined) && (result.PurchaseOrder[i].modified_by != null)) ? result.PurchaseOrder[i].modified_by : 0, ((result.PurchaseOrder[i].modified != undefined) && (result.PurchaseOrder[i].modified != null)) ? result.PurchaseOrder[i].modified
														: '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_purchase_order_table');
			return;
		}
	},
	update_my_purchase_order_item_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.PurchaseOrderItem === undefined) || (result.PurchaseOrderItem === null) || (result.PurchaseOrderItem.length <= 0)) {
			} else {
				for (var i = 0, j = result.PurchaseOrderItem.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_purchase_order_item WHERE id=' + result.PurchaseOrderItem[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((result.PurchaseOrderItem[i].created === temp_created) && ((result.PurchaseOrderItem[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_purchase_order_item SET local_id=?,company_id=?,reference_number=?,purchase_order_id=?,' + 'item_name=?,description=?,tags=?,units=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? ' + 'WHERE id=' + result.PurchaseOrderItem[i].id, ((result.PurchaseOrderItem[i].local_id != undefined) && (result.PurchaseOrderItem[i].local_id != null)) ? result.PurchaseOrderItem[i].local_id : '',
											((result.PurchaseOrderItem[i].company_id != undefined) && (result.PurchaseOrderItem[i].company_id != null)) ? result.PurchaseOrderItem[i].company_id : 0, ((result.PurchaseOrderItem[i].reference_number != undefined) && (result.PurchaseOrderItem[i].reference_number != null)) ? result.PurchaseOrderItem[i].reference_number : 0,
											((result.PurchaseOrderItem[i].purchase_order_id != undefined) && (result.PurchaseOrderItem[i].purchase_order_id != null)) ? result.PurchaseOrderItem[i].purchase_order_id : 0, ((result.PurchaseOrderItem[i].item_name != undefined) && (result.PurchaseOrderItem[i].item_name != null)) ? result.PurchaseOrderItem[i].item_name : '',
											((result.PurchaseOrderItem[i].description != undefined) && (result.PurchaseOrderItem[i].description != null)) ? result.PurchaseOrderItem[i].description : '', ((result.PurchaseOrderItem[i].tags != undefined) && (result.PurchaseOrderItem[i].tags != null)) ? result.PurchaseOrderItem[i].tags : '',
											((result.PurchaseOrderItem[i].units != undefined) && (result.PurchaseOrderItem[i].units != null)) ? result.PurchaseOrderItem[i].units : '', ((result.PurchaseOrderItem[i].status_code != undefined) && (result.PurchaseOrderItem[i].status_code != null)) ? result.PurchaseOrderItem[i].status_code : 0, 0,
											((result.PurchaseOrderItem[i].created != undefined) && (result.PurchaseOrderItem[i].created != null)) ? result.PurchaseOrderItem[i].created : '', ((result.PurchaseOrderItem[i].created_by != undefined) && (result.PurchaseOrderItem[i].created_by != null)) ? result.PurchaseOrderItem[i].created_by : 0,
											((result.PurchaseOrderItem[i].modified_by != undefined) && (result.PurchaseOrderItem[i].modified_by != null)) ? result.PurchaseOrderItem[i].modified_by : 0, ((result.PurchaseOrderItem[i].modified != undefined) && (result.PurchaseOrderItem[i].modified != null)) ? result.PurchaseOrderItem[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_purchase_order_item (id,local_id,company_id,reference_number,purchase_order_id,' + 'item_name,description,tags,units,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.PurchaseOrderItem[i].id != undefined) && (result.PurchaseOrderItem[i].id != null)) ? result.PurchaseOrderItem[i].id : 0,
										((result.PurchaseOrderItem[i].local_id != undefined) && (result.PurchaseOrderItem[i].local_id != null)) ? result.PurchaseOrderItem[i].local_id : '', ((result.PurchaseOrderItem[i].company_id != undefined) && (result.PurchaseOrderItem[i].company_id != null)) ? result.PurchaseOrderItem[i].company_id : 0,
										((result.PurchaseOrderItem[i].reference_number != undefined) && (result.PurchaseOrderItem[i].reference_number != null)) ? result.PurchaseOrderItem[i].reference_number : 0, ((result.PurchaseOrderItem[i].purchase_order_id != undefined) && (result.PurchaseOrderItem[i].purchase_order_id != null)) ? result.PurchaseOrderItem[i].purchase_order_id : 0,
										((result.PurchaseOrderItem[i].item_name != undefined) && (result.PurchaseOrderItem[i].item_name != null)) ? result.PurchaseOrderItem[i].item_name : '', ((result.PurchaseOrderItem[i].description != undefined) && (result.PurchaseOrderItem[i].description != null)) ? result.PurchaseOrderItem[i].description : '',
										((result.PurchaseOrderItem[i].tags != undefined) && (result.PurchaseOrderItem[i].tags != null)) ? result.PurchaseOrderItem[i].tags : '', ((result.PurchaseOrderItem[i].units != undefined) && (result.PurchaseOrderItem[i].units != null)) ? result.PurchaseOrderItem[i].units : '',
										((result.PurchaseOrderItem[i].status_code != undefined) && (result.PurchaseOrderItem[i].status_code != null)) ? result.PurchaseOrderItem[i].status_code : 0, 0, ((result.PurchaseOrderItem[i].created != undefined) && (result.PurchaseOrderItem[i].created != null)) ? result.PurchaseOrderItem[i].created : '',
										((result.PurchaseOrderItem[i].created_by != undefined) && (result.PurchaseOrderItem[i].created_by != null)) ? result.PurchaseOrderItem[i].created_by : 0, ((result.PurchaseOrderItem[i].modified_by != undefined) && (result.PurchaseOrderItem[i].modified_by != null)) ? result.PurchaseOrderItem[i].modified_by : 0,
										((result.PurchaseOrderItem[i].modified != undefined) && (result.PurchaseOrderItem[i].modified != null)) ? result.PurchaseOrderItem[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_purchase_order_item_table');
			return;
		}
	},
	
	// update pdf for locksmith
	update_my_job_invoice_locksmith_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobInvoiceLocksmith === undefined) || (result.JobInvoiceLocksmithLocksmith === null) || (result.JobInvoiceLocksmith.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobInvoiceLocksmith.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_invoice_locksmith WHERE id=' + result.JobInvoiceLocksmith[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobInvoiceLocksmith[i].created === temp_created) && ((result.JobInvoiceLocksmith[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_invoice_locksmith SET local_id=?,company_id=?,job_id=?,job_invoice_status_code=?,job_invoice_template_id=?,o_number=?,' + 'acc_no=?,invoice_no=?,job_date=?,mjd_no=?,job_title=?,job_address=?,attendtion=?,building_name=?,phone=?,mobile=?,fax=?,description=?,cod=?,'
											+ 'is_need_cod=?,paidcash=?,cheque=?,credit_card=?,total_price=?,is_merge_signature=?,path=?,status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobInvoiceLocksmith[i].id, ((result.JobInvoiceLocksmith[i].local_id != undefined) && (result.JobInvoiceLocksmith[i].local_id != null)) ? result.JobInvoiceLocksmith[i].local_id : '',
											((result.JobInvoiceLocksmith[i].company_id != undefined) && (result.JobInvoiceLocksmith[i].company_id != null)) ? result.JobInvoiceLocksmith[i].company_id : 0, ((result.JobInvoiceLocksmith[i].job_id != undefined) && (result.JobInvoiceLocksmith[i].job_id != null)) ? result.JobInvoiceLocksmith[i].job_id : 0,
											((result.JobInvoiceLocksmith[i].job_invoice_status_code != undefined) && (result.JobInvoiceLocksmith[i].job_invoice_status_code != null)) ? result.JobInvoiceLocksmith[i].job_invoice_status_code : 0, ((result.JobInvoiceLocksmith[i].job_invoice_template_id != undefined) && (result.JobInvoiceLocksmith[i].job_invoice_template_id != null)) ? result.JobInvoiceLocksmith[i].job_invoice_template_id : 0,
											((result.JobInvoiceLocksmith[i].o_number != undefined) && (result.JobInvoiceLocksmith[i].o_number != null)) ? result.JobInvoiceLocksmith[i].o_number : '', ((result.JobInvoiceLocksmith[i].acc_no != undefined) && (result.JobInvoiceLocksmith[i].acc_no != null)) ? result.JobInvoiceLocksmith[i].acc_no : '',
											((result.JobInvoiceLocksmith[i].invoice_no != undefined) && (result.JobInvoiceLocksmith[i].invoice_no != null)) ? result.JobInvoiceLocksmith[i].invoice_no : '', ((result.JobInvoiceLocksmith[i].job_date != undefined) && (result.JobInvoiceLocksmith[i].job_date != null)) ? result.JobInvoiceLocksmith[i].job_date : '',
											((result.JobInvoiceLocksmith[i].mjd_no != undefined) && (result.JobInvoiceLocksmith[i].mjd_no != null)) ? result.JobInvoiceLocksmith[i].mjd_no : '', ((result.JobInvoiceLocksmith[i].job_title != undefined) && (result.JobInvoiceLocksmith[i].job_title != null)) ? result.JobInvoiceLocksmith[i].job_title : '',
											((result.JobInvoiceLocksmith[i].job_address != undefined) && (result.JobInvoiceLocksmith[i].job_address != null)) ? result.JobInvoiceLocksmith[i].job_address : '', ((result.JobInvoiceLocksmith[i].attendtion != undefined) && (result.JobInvoiceLocksmith[i].attendtion != null)) ? result.JobInvoiceLocksmith[i].attendtion : '',
											((result.JobInvoiceLocksmith[i].building_name != undefined) && (result.JobInvoiceLocksmith[i].building_name != null)) ? result.JobInvoiceLocksmith[i].building_name : '', ((result.JobInvoiceLocksmith[i].phone != undefined) && (result.JobInvoiceLocksmith[i].phone != null)) ? result.JobInvoiceLocksmith[i].phone : '',
											((result.JobInvoiceLocksmith[i].mobile != undefined) && (result.JobInvoiceLocksmith[i].mobile != null)) ? result.JobInvoiceLocksmith[i].mobile : '', ((result.JobInvoiceLocksmith[i].fax != undefined) && (result.JobInvoiceLocksmith[i].fax != null)) ? result.JobInvoiceLocksmith[i].fax : '',
											((result.JobInvoiceLocksmith[i].description != undefined) && (result.JobInvoiceLocksmith[i].description != null)) ? result.JobInvoiceLocksmith[i].description : '', ((result.JobInvoiceLocksmith[i].cod != undefined) && (result.JobInvoiceLocksmith[i].cod != null)) ? result.JobInvoiceLocksmith[i].cod : 0,
											((result.JobInvoiceLocksmith[i].is_need_cod != undefined) && (result.JobInvoiceLocksmith[i].is_need_cod != null)) ? result.JobInvoiceLocksmith[i].is_need_cod : 0, ((result.JobInvoiceLocksmith[i].paidcash != undefined) && (result.JobInvoiceLocksmith[i].paidcash != null)) ? result.JobInvoiceLocksmith[i].paidcash : 0,
											((result.JobInvoiceLocksmith[i].cheque != undefined) && (result.JobInvoiceLocksmith[i].cheque != null)) ? result.JobInvoiceLocksmith[i].cheque : 0, ((result.JobInvoiceLocksmith[i].credit_card != undefined) && (result.JobInvoiceLocksmith[i].credit_card != null)) ? result.JobInvoiceLocksmith[i].credit_card : 0,
											((result.JobInvoiceLocksmith[i].total_price != undefined) && (result.JobInvoiceLocksmith[i].total_price != null)) ? result.JobInvoiceLocksmith[i].total_price : 0, ((result.JobInvoiceLocksmith[i].is_merge_signature != undefined) && (result.JobInvoiceLocksmith[i].is_merge_signature != null)) ? result.JobInvoiceLocksmith[i].is_merge_signature : 0,
											((result.JobInvoiceLocksmith[i].path != undefined) && (result.JobInvoiceLocksmith[i].path != null)) ? result.JobInvoiceLocksmith[i].path : '', ((result.JobInvoiceLocksmith[i].status_code != undefined) && (result.JobInvoiceLocksmith[i].status_code != null)) ? result.JobInvoiceLocksmith[i].status_code : 0, 0,
											((result.JobInvoiceLocksmith[i].created != undefined) && (result.JobInvoiceLocksmith[i].created != null)) ? result.JobInvoiceLocksmith[i].created : '', ((result.JobInvoiceLocksmith[i].created_by != undefined) && (result.JobInvoiceLocksmith[i].created_by != null)) ? result.JobInvoiceLocksmith[i].created_by : 0,
											((result.JobInvoiceLocksmith[i].modified_by != undefined) && (result.JobInvoiceLocksmith[i].modified_by != null)) ? result.JobInvoiceLocksmith[i].modified_by : 0, ((result.JobInvoiceLocksmith[i].modified != undefined) && (result.JobInvoiceLocksmith[i].modified != null)) ? result.JobInvoiceLocksmith[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_invoice_locksmith (id,local_id,company_id,job_id,job_invoice_status_code,job_invoice_template_id,o_number,' + 'acc_no,invoice_no,job_date,mjd_no,job_title,job_address,attendtion,building_name,phone,mobile,fax,description,cod,' + 'is_need_cod,paidcash,cheque,credit_card,total_price,is_merge_signature,path,status_code,changed,created,created_by,modified_by,modified)'
										+ 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobInvoiceLocksmith[i].id != undefined) && (result.JobInvoiceLocksmith[i].id != null)) ? result.JobInvoiceLocksmith[i].id : 0, ((result.JobInvoiceLocksmith[i].local_id != undefined) && (result.JobInvoiceLocksmith[i].local_id != null)) ? result.JobInvoiceLocksmith[i].local_id : '',
										((result.JobInvoiceLocksmith[i].company_id != undefined) && (result.JobInvoiceLocksmith[i].company_id != null)) ? result.JobInvoiceLocksmith[i].company_id : 0, ((result.JobInvoiceLocksmith[i].job_id != undefined) && (result.JobInvoiceLocksmith[i].job_id != null)) ? result.JobInvoiceLocksmith[i].job_id : 0,
										((result.JobInvoiceLocksmith[i].job_invoice_status_code != undefined) && (result.JobInvoiceLocksmith[i].job_invoice_status_code != null)) ? result.JobInvoiceLocksmith[i].job_invoice_status_code : 0, ((result.JobInvoiceLocksmith[i].job_invoice_template_id != undefined) && (result.JobInvoiceLocksmith[i].job_invoice_template_id != null)) ? result.JobInvoiceLocksmith[i].job_invoice_template_id : 0,
										((result.JobInvoiceLocksmith[i].o_number != undefined) && (result.JobInvoiceLocksmith[i].o_number != null)) ? result.JobInvoiceLocksmith[i].o_number : '', ((result.JobInvoiceLocksmith[i].acc_no != undefined) && (result.JobInvoiceLocksmith[i].acc_no != null)) ? result.JobInvoiceLocksmith[i].acc_no : '',
										((result.JobInvoiceLocksmith[i].invoice_no != undefined) && (result.JobInvoiceLocksmith[i].invoice_no != null)) ? result.JobInvoiceLocksmith[i].invoice_no : '', ((result.JobInvoiceLocksmith[i].job_date != undefined) && (result.JobInvoiceLocksmith[i].job_date != null)) ? result.JobInvoiceLocksmith[i].job_date : '',
										((result.JobInvoiceLocksmith[i].mjd_no != undefined) && (result.JobInvoiceLocksmith[i].mjd_no != null)) ? result.JobInvoiceLocksmith[i].mjd_no : '', ((result.JobInvoiceLocksmith[i].job_title != undefined) && (result.JobInvoiceLocksmith[i].job_title != null)) ? result.JobInvoiceLocksmith[i].job_title : '',
										((result.JobInvoiceLocksmith[i].job_address != undefined) && (result.JobInvoiceLocksmith[i].job_address != null)) ? result.JobInvoiceLocksmith[i].job_address : '', ((result.JobInvoiceLocksmith[i].attendtion != undefined) && (result.JobInvoiceLocksmith[i].attendtion != null)) ? result.JobInvoiceLocksmith[i].attendtion : '',
										((result.JobInvoiceLocksmith[i].building_name != undefined) && (result.JobInvoiceLocksmith[i].building_name != null)) ? result.JobInvoiceLocksmith[i].building_name : '', ((result.JobInvoiceLocksmith[i].phone != undefined) && (result.JobInvoiceLocksmith[i].phone != null)) ? result.JobInvoiceLocksmith[i].phone : '',
										((result.JobInvoiceLocksmith[i].mobile != undefined) && (result.JobInvoiceLocksmith[i].mobile != null)) ? result.JobInvoiceLocksmith[i].mobile : '', ((result.JobInvoiceLocksmith[i].fax != undefined) && (result.JobInvoiceLocksmith[i].fax != null)) ? result.JobInvoiceLocksmith[i].fax : '',
										((result.JobInvoiceLocksmith[i].description != undefined) && (result.JobInvoiceLocksmith[i].description != null)) ? result.JobInvoiceLocksmith[i].description : '', ((result.JobInvoiceLocksmith[i].cod != undefined) && (result.JobInvoiceLocksmith[i].cod != null)) ? result.JobInvoiceLocksmith[i].cod : 0,
										((result.JobInvoiceLocksmith[i].is_need_cod != undefined) && (result.JobInvoiceLocksmith[i].is_need_cod != null)) ? result.JobInvoiceLocksmith[i].is_need_cod : 0, ((result.JobInvoiceLocksmith[i].paidcash != undefined) && (result.JobInvoiceLocksmith[i].paidcash != null)) ? result.JobInvoiceLocksmith[i].paidcash : 0,
										((result.JobInvoiceLocksmith[i].cheque != undefined) && (result.JobInvoiceLocksmith[i].cheque != null)) ? result.JobInvoiceLocksmith[i].cheque : 0, ((result.JobInvoiceLocksmith[i].credit_card != undefined) && (result.JobInvoiceLocksmith[i].credit_card != null)) ? result.JobInvoiceLocksmith[i].credit_card : 0,
										((result.JobInvoiceLocksmith[i].total_price != undefined) && (result.JobInvoiceLocksmith[i].total_price != null)) ? result.JobInvoiceLocksmith[i].total_price : 0, ((result.JobInvoiceLocksmith[i].is_merge_signature != undefined) && (result.JobInvoiceLocksmith[i].is_merge_signature != null)) ? result.JobInvoiceLocksmith[i].is_merge_signature : 0,
										((result.JobInvoiceLocksmith[i].path != undefined) && (result.JobInvoiceLocksmith[i].path != null)) ? result.JobInvoiceLocksmith[i].path : '', ((result.JobInvoiceLocksmith[i].status_code != undefined) && (result.JobInvoiceLocksmith[i].status_code != null)) ? result.JobInvoiceLocksmith[i].status_code : 0, 0,
										((result.JobInvoiceLocksmith[i].created != undefined) && (result.JobInvoiceLocksmith[i].created != null)) ? result.JobInvoiceLocksmith[i].created : '', ((result.JobInvoiceLocksmith[i].created_by != undefined) && (result.JobInvoiceLocksmith[i].created_by != null)) ? result.JobInvoiceLocksmith[i].created_by : 0,
										((result.JobInvoiceLocksmith[i].modified_by != undefined) && (result.JobInvoiceLocksmith[i].modified_by != null)) ? result.JobInvoiceLocksmith[i].modified_by : 0, ((result.JobInvoiceLocksmith[i].modified != undefined) && (result.JobInvoiceLocksmith[i].modified != null)) ? result.JobInvoiceLocksmith[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_invoice_locksmith_table');
			return;
		}
	},
	update_my_job_invoice_locksmith_signature_table : function(db, result) {
		var self = this;
		try {
			if ((result === null) || (result.JobInvoiceLocksmithSignature === undefined) || (result.JobInvoiceLocksmithSignature === null) || (result.JobInvoiceLocksmithSignature.length <= 0)) {
			} else {
				for (var i = 0, j = result.JobInvoiceLocksmithSignature.length; i < j; i++) {
					var data_rows = db.execute('SELECT * FROM my_job_invoice_locksmith_signature WHERE id=' + result.JobInvoiceLocksmithSignature[i].id);
					var data_row_count = data_rows.getRowCount();
					if (data_row_count > 0) {
						if (data_rows.isValidRow()) {
							var temp_changed = data_rows.fieldByName('changed');
							var temp_created = data_rows.fieldByName('created');
							var temp_modified = data_rows.fieldByName('modified');
						}
						data_rows.close();
						if ((temp_changed === 0) && (result.JobInvoiceLocksmithSignature[i].created === temp_created) && ((result.JobInvoiceLocksmithSignature[i].modified === temp_modified))) {
						} else {
							db.execute('UPDATE my_job_invoice_locksmith_signature SET local_id=?,job_id=?,job_invoice_locksmith_id=?,client_name=?,path=?,time=?,mime_type=?,width=?,height=?,file_size=?,is_local_record=?,' + 'status_code=?,changed=?,created=?,created_by=?,modified_by=?,modified=? WHERE id=' + result.JobInvoiceLocksmithSignature[i].id,
											((result.JobInvoiceLocksmithSignature[i].local_id != undefined) && (result.JobInvoiceLocksmithSignature[i].local_id != null)) ? result.JobInvoiceLocksmithSignature[i].local_id : '', ((result.JobInvoiceLocksmithSignature[i].job_id != undefined) && (result.JobInvoiceLocksmithSignature[i].job_id != null)) ? result.JobInvoiceLocksmithSignature[i].job_id : 0,
											((result.JobInvoiceLocksmithSignature[i].job_invoice_locksmith_id != undefined) && (result.JobInvoiceLocksmithSignature[i].job_invoice_locksmith_id != null)) ? result.JobInvoiceLocksmithSignature[i].job_invoice_locksmith_id : 0,
											((result.JobInvoiceLocksmithSignature[i].client_name != undefined) && (result.JobInvoiceLocksmithSignature[i].client_name != null)) ? result.JobInvoiceLocksmithSignature[i].client_name : '', ((result.JobInvoiceLocksmithSignature[i].path != undefined) && (result.JobInvoiceLocksmithSignature[i].path != null)) ? result.JobInvoiceLocksmithSignature[i].path : '',
											((result.JobInvoiceLocksmithSignature[i].time != undefined) && (result.JobInvoiceLocksmithSignature[i].time != null)) ? result.JobInvoiceLocksmithSignature[i].time : '', ((result.JobInvoiceLocksmithSignature[i].mime_type != undefined) && (result.JobInvoiceLocksmithSignature[i].mime_type != null)) ? result.JobInvoiceLocksmithSignature[i].mime_type : '',
											((result.JobInvoiceLocksmithSignature[i].width != undefined) && (result.JobInvoiceLocksmithSignature[i].width != null)) ? result.JobInvoiceLocksmithSignature[i].width : 0, ((result.JobInvoiceLocksmithSignature[i].height != undefined) && (result.JobInvoiceLocksmithSignature[i].height != null)) ? result.JobInvoiceLocksmithSignature[i].height : 0,
											((result.JobInvoiceLocksmithSignature[i].file_size != undefined) && (result.JobInvoiceLocksmithSignature[i].file_size != null)) ? result.JobInvoiceLocksmithSignature[i].file_size : 0, 0, ((result.JobInvoiceLocksmithSignature[i].status_code != undefined) && (result.JobInvoiceLocksmithSignature[i].status_code != null)) ? result.JobInvoiceLocksmithSignature[i].status_code : 0, 0,
											((result.JobInvoiceLocksmithSignature[i].created != undefined) && (result.JobInvoiceLocksmithSignature[i].created != null)) ? result.JobInvoiceLocksmithSignature[i].created : '', ((result.JobInvoiceLocksmithSignature[i].created_by != undefined) && (result.JobInvoiceLocksmithSignature[i].created_by != null)) ? result.JobInvoiceLocksmithSignature[i].created_by : 0,
											((result.JobInvoiceLocksmithSignature[i].modified_by != undefined) && (result.JobInvoiceLocksmithSignature[i].modified_by != null)) ? result.JobInvoiceLocksmithSignature[i].modified_by : 0, ((result.JobInvoiceLocksmithSignature[i].modified != undefined) && (result.JobInvoiceLocksmithSignature[i].modified != null)) ? result.JobInvoiceLocksmithSignature[i].modified : '');
						}
					} else {
						data_rows.close();
						db.execute('INSERT INTO my_job_invoice_locksmith_signature (id,local_id,job_id,job_invoice_locksmith_id,client_name,path,time,mime_type,width,height,file_size,is_local_record,' + 'status_code,changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ((result.JobInvoiceLocksmithSignature[i].id != undefined) && (result.JobInvoiceLocksmithSignature[i].id != null)) ? result.JobInvoiceLocksmithSignature[i].id
										: 0, ((result.JobInvoiceLocksmithSignature[i].local_id != undefined) && (result.JobInvoiceLocksmithSignature[i].local_id != null)) ? result.JobInvoiceLocksmithSignature[i].local_id : '', ((result.JobInvoiceLocksmithSignature[i].job_id != undefined) && (result.JobInvoiceLocksmithSignature[i].job_id != null)) ? result.JobInvoiceLocksmithSignature[i].job_id : 0,
										((result.JobInvoiceLocksmithSignature[i].job_invoice_locksmith_id != undefined) && (result.JobInvoiceLocksmithSignature[i].job_invoice_locksmith_id != null)) ? result.JobInvoiceLocksmithSignature[i].job_invoice_locksmith_id : 0, ((result.JobInvoiceLocksmithSignature[i].client_name != undefined) && (result.JobInvoiceLocksmithSignature[i].client_name != null)) ? result.JobInvoiceLocksmithSignature[i].client_name : '',
										((result.JobInvoiceLocksmithSignature[i].path != undefined) && (result.JobInvoiceLocksmithSignature[i].path != null)) ? result.JobInvoiceLocksmithSignature[i].path : '', ((result.JobInvoiceLocksmithSignature[i].time != undefined) && (result.JobInvoiceLocksmithSignature[i].time != null)) ? result.JobInvoiceLocksmithSignature[i].time : '',
										((result.JobInvoiceLocksmithSignature[i].mime_type != undefined) && (result.JobInvoiceLocksmithSignature[i].mime_type != null)) ? result.JobInvoiceLocksmithSignature[i].mime_type : '', ((result.JobInvoiceLocksmithSignature[i].width != undefined) && (result.JobInvoiceLocksmithSignature[i].width != null)) ? result.JobInvoiceLocksmithSignature[i].width : 0,
										((result.JobInvoiceLocksmithSignature[i].height != undefined) && (result.JobInvoiceLocksmithSignature[i].height != null)) ? result.JobInvoiceLocksmithSignature[i].height : 0, ((result.JobInvoiceLocksmithSignature[i].file_size != undefined) && (result.JobInvoiceLocksmithSignature[i].file_size != null)) ? result.JobInvoiceLocksmithSignature[i].file_size : 0, 0,
										((result.JobInvoiceLocksmithSignature[i].status_code != undefined) && (result.JobInvoiceLocksmithSignature[i].status_code != null)) ? result.JobInvoiceLocksmithSignature[i].status_code : 0, 0, ((result.JobInvoiceLocksmithSignature[i].created != undefined) && (result.JobInvoiceLocksmithSignature[i].created != null)) ? result.JobInvoiceLocksmithSignature[i].created : '',
										((result.JobInvoiceLocksmithSignature[i].created_by != undefined) && (result.JobInvoiceLocksmithSignature[i].created_by != null)) ? result.JobInvoiceLocksmithSignature[i].created_by : 0, ((result.JobInvoiceLocksmithSignature[i].modified_by != undefined) && (result.JobInvoiceLocksmithSignature[i].modified_by != null)) ? result.JobInvoiceLocksmithSignature[i].modified_by : 0,
										((result.JobInvoiceLocksmithSignature[i].modified != undefined) && (result.JobInvoiceLocksmithSignature[i].modified != null)) ? result.JobInvoiceLocksmithSignature[i].modified : '');
					}
				}
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - update_my_job_invoice_locksmith_signature_table');
			return;
		}
	}
};
