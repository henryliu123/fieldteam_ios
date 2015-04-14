/*jslint maxerr:10000 */
//display all menu of job
(function() {
	Titanium.include(Ti.App.Properties.getString('base_folder_name') + 'operate_camera.js');
	var win = Titanium.UI.currentWindow;
	var job_edit_index_page_obj = null;
	function job_edit_index_page() {
		var self = this;
		var window_source = 'job_edit_index_page';
		win.title_filter_class = 'job_index_view';
		
		// public method
		/**
		 * override init function of parent class: fieldteam.js
		 */
		self.init = function() {
			try {
				if (_action_for_job === 'add_job') {
					_is_refresh_new_job = true;
					
				}
				self.init_auto_release_pool(win);
				Ti.App.Properties.setBool('is_close_timer', false);
				var db = Titanium.Database.open(self.get_db_name());
				
				_init_window_title();
				_init_bottom_tool_bar();
				_init_detail_section(db);
				if (!self.is_ios_7_plus()) {
					_init_a_separate_line();
				}
				_init_description_section(db);
				_init_booking_note_section(db);
				if (!self.is_ios_7_plus()) {
					_init_a_separate_line();
				}
				_init_client_contact_section(db);
				_init_site_contact_section(db);
				_init_user_section(db);
				_init_note_section(db);
				if (!self.is_ios_7_plus()) {
					_init_a_separate_line();
				}
				_init_media_section(db);
				
				if (!self.is_ios_7_plus()) {
					_init_a_separate_line();
				}
				if (_can_view_invoice) {
					_init_invoice_section(db);
					if (self.is_available_for_locksmith(_type)) {
						_init_invoice_locksmith_section(db);
					}
				}
				_init_custom_report_section(db);
				if (_can_view_purchase_order) {
					_init_purchase_order_section(db);
				}
				
				if (_action_for_job === 'edit_job') {
					if (!self.is_ios_7_plus()) {
						_init_a_separate_line();
					}
					_init_history_section(db);
					if (_selected_job_id < 1000000000) {
						if (_type === 'job') {
							if (!self.is_ios_7_plus()) {
								_init_a_separate_line();
							}
						}
						if (_type === 'quote') {
							if (_selected_job_status_code != 3) {// hide
								// this
								// section
								// if
								// status_code
								// is
								// quote_accepted
								if (!self.is_ios_7_plus()) {
									_init_a_separate_line();
								}
								_init_quote_accepted_section(db);
							}
						}
						_init_start_job_section(db);
						_init_create_unrelated_job_section(db);
					}
				}
				db.close();
				// call init_table_view function of parent
				// class: fieldteam.js
				self.init_table_view();
				self.table_view.bottom = (_selected_job_id > 1000000000) ? 0 : self.tool_bar_height;
				self.table_view.rowBackgroundColor = 'white';
				_check_job_address();
				// call init_navigation_bar function of parent
				// class: fieldteam.js
				self.init_navigation_bar('Save', 'Main,Back');
				_display_error_info();
				
				Ti.App.addEventListener('reset_upload_file_flag', function() {
					_exist_upload_file_failure = false;
				});
				Ti.App.addEventListener('closeTimer', function() {
					_is_close_timer = true;
					_start_stop_job();
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.init');
				return;
			}
		};
		/**
		 * override nav_right_btn_click_event function of parent class:
		 * fieldteam.js
		 */
		self.nav_right_btn_click_event = function(e) {
			try {
				_save_action();
				//avoid to show "Some files upload failed. Do you want to upload again?" dialog again.
				_exist_upload_file_failure = false;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.nav_right_btn_click_event');
				return;
			}
		};
		/**
		 * override nav_left_btn_click_event function of parent class:
		 * fieldteam.js
		 */
		self.nav_left_btn_click_event = function(e) {
			try {
				if (!_check_if_exist_change()) {
					if (!self.check_if_exist_upload_file_failure(_selected_job_id, _type, _selected_company_id)) {
						_exist_upload_file_failure = false;
					}					
					if (_exist_upload_file_failure) {
						var option_dialog = Ti.UI.createOptionDialog({
							options : (self.is_ipad()) ? [ 'YES', 'NO', 'Cancel', '' ] : [ 'YES', 'NO', 'Cancel' ],
							buttonNames : [ 'Cancel' ],
							destructive : 0,
							cancel : 2,
							title : 'Some files upload failed. Do you want to upload again?'
						});
						option_dialog.show();
						option_dialog.addEventListener('click', function(evt) {
							switch (evt.index){
								case 0:// yes,upload
									var db = Titanium.Database.open(self.get_db_name());
									db.execute('UPDATE my_updating_records SET upload_status=0,failure_times=0 WHERE relation_id=? and type=? and upload_status in (1,3)', _selected_job_id, _type);
									db.close();
									if (e.index == self.default_main_menu_button_index) {// menu
										// menu
										self.close_all_window_and_return_to_menu();
									} else {
										Titanium.UI.currentWindow.is_close_all_window = false;
										win.close();
									}
									Ti.App.fireEvent('async_save_data');
									break;
								case 1:
									if (e.index == self.default_main_menu_button_index) {// menu
										// menu
										self.close_all_window_and_return_to_menu();
									} else {
										Titanium.UI.currentWindow.is_close_all_window = false;
										win.close();
									}
									break;
								case 2:// cancel
									self.nav_left_btn.index = -1;
									break;
							}
						});
					} else {
						if (e.index == self.default_main_menu_button_index) {// menu
							// menu
							self.close_all_window_and_return_to_menu();
						} else {
							win.close();
						}
					}
				} else {
					if (e.index == self.default_main_menu_button_index) {// menu
						// menu
						_is_click_main_menu_btn = true;
					} else {
						_is_click_main_menu_btn = false;
					}
					if (e.index == 1) {// back bton
						_is_click_back_btn = true;
					} else {
						_is_click_back_btn = false;
					}
					_save_action();
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.nav_left_btn_click_event');
				return;
			}
		};
		/**
		 * override table_view_click_event function of parent class:
		 * fieldteam.js
		 */
		self.table_view_click_event = function(e) {
			try {
				_event_for_table_view(e);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.table_view_click_event');
				return;
			}
		};
		/**
		 * override save_address function of parent class: fieldteam.js
		 */
		self.save_address = function(params) {
			try {
				var db = Titanium.Database.open(self.get_db_name());
				db.execute('UPDATE my_' + _type + ' SET latitude=?,longitude=?,locality_street_type_id=?,locality_suburb_id=?,postcode=?,changed=1 WHERE id=?', params.latitude, params.longitude, params.street_type_id, params.suburb_id, params.postcode, _selected_job_id);
				db.close();
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.save_address');
				return;
			}
		};
		/**
		 * display all fields
		 */
		self.display = function() {
			try {
				if (_action_for_job === 'add_job') {
					win.title = 'New ' + self.ucfirst(_type);
				} else {
					if (_selected_job_id > 1000000000) {
						win.title = 'New ' + self.ucfirst(_type);
					} else {
						win.title = self.ucfirst(_type) + ' : ' + _selected_job_reference_number;
					}
				}
				var db = Titanium.Database.open(self.get_db_name());
				_section_no = 0;
				if (self.is_ios_7_plus()) {
					_section_no++;// separate area
				}
				_display_detail_section(db);
				_section_no++;// separate line
				_display_description_section(db);
				_display_booking_note_section(db);
				
				_section_no++;// separate line
				
				_display_client_contact_section(db);
				_display_site_contact_section(db);
				_display_user_section(db);
				_display_note_section(db);
				
				_section_no++;// separate line
				
				_display_media_section(db);
				
				_section_no++;// separate line
				
				if (_can_view_invoice) {
					_display_invoice_section(db);
					if (self.is_available_for_locksmith(_type)) {
						_display_invoice_locksmith_section(db);
					}
				}
				_display_custom_report_section(db);
				if (_can_view_purchase_order) {
					_display_purchase_order_section(db);
				}
				
				if (_action_for_job === 'edit_job' && !_is_refresh_new_job) {
					
					_section_no++;// separate line
					
					_display_history_section(db);
				}
				self.table_view.setData(self.data);
				db.close();
				self.table_view.bottom = (_selected_job_id > 1000000000) ? 0 : self.tool_bar_height;
				if (_selected_job_id > 1000000000) {
				} else {
					self.bottom_tool_bar.visible = true;
				}
				if (Ti.App.Properties.getBool('is_close_timer')) {
					Ti.App.Properties.setBool('is_close_timer', false);
					if (_is_start_flag) {// if job not
						// stopped, then
						// stop it.
						_start_stop_job();
					}
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.display');
				return;
			}
		};
		
		self.touchMainMenu = function() {
			_check_if_exist_change();
		};
		
		// private member
		var _type = win.type;
		var _action_for_job = win.action_for_job;
		var _selected_job_status_code = win.job_status_code;
		var _selected_job_id = win.job_id;
		var _selected_job_reference_number = win.job_reference_number;
		var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
		var _selected_company_id = Ti.App.Properties.getString('current_company_id');
		var _section_no = 0;
		var _client_id = 0;
		var _header_view_height = 30;
		var _header_view_title_height = 26;
		var _header_view_button_width = 60;
		var _header_view_button_height = 26;
		var _header_view_font_size = 16;
		var _is_start_flag = false;
		var _start_btn_timer_hours = 0;
		var _start_btn_timer_minutes = 0;
		var _start_btn_timer_seconds = 0;
		var _start_btn_timer = null;
		var _exist_upload_file_failure = false;
		var _is_click_main_menu_btn = false;
		var _is_click_back_btn = false;
		var _is_close_timer = false;
		var _can_view_business_client = Titanium.App.Properties.getBool('can_view_business_client');
		var _can_view_purchase_order = Titanium.App.Properties.getBool('can_view_purchase_order');
		var _can_view_materials = Titanium.App.Properties.getBool('can_view_materials');
		var _can_view_invoice = Titanium.App.Properties.getBool('can_view_invoice');
		var _is_refresh_new_job = false;
		
		function _event_for_table_view(e) {
			try {
				switch (e.row.filter_class){
					case 'detail_client':
						_event_for_table_view_click_detail_client(e);
						break;
					case 'detail_title':
						_event_for_table_view_click_detail_title(e);
						break;
					case 'detail_order_reference':
						_event_for_table_view_click_detail_order_reference_number(e);
						break;
					case 'detail_status':
						_event_for_table_view_click_detail_status(e);
						break;
					case 'detail_status_reason':
						_event_for_table_view_click_detail_status_reason(e);
						break;
					case 'detail_address':
						_event_for_table_view_click_detail_address(e);
						break;
					case 'detail_description':
						_event_for_table_view_click_detail_description(e);
						break;
					case 'detail_booking_note':
						_event_for_table_view_click_detail_booking_note(e);
						break;
					case 'client_contact':
						_event_for_table_view_click_client_contact(e);
						break;
					case 'site_contact':
						_event_for_table_view_click_site_contact(e);
						break;
					case 'manager_user':
						_event_for_table_view_click_user(e);
						break;
					case 'note':
						_event_for_table_view_click_note(e);
						break;
					case 'contact_history':
					case 'status_history':
					case 'site_history':
					case 'operation_history':
						_event_for_table_view_click_history(e);
						break;
					case 'media':
						_event_for_table_view_click_media(e);
						break;
					case 'invoice':
						_event_for_table_view_click_invoice(e);
						break;
					case 'invoice_locksmith':
						_event_for_table_view_click_invoice_locksmith(e);
						break;
					case 'custom_report':
						_event_for_table_view_click_custom_report(e);
						break;
					case 'purchase_order':
						_event_for_table_view_click_purchase_order(e);
						break;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view');
				return;
			}
		}
		function _event_for_table_view_click_detail_client(e) {
			try {
				if (e.source.name === 'view_btn') {
					var view_client_win = Ti.UI.createWindow({
						url : self.get_file_path('url', 'job/edit/job_client_view.js'),
						type : _type,
						job_id : _selected_job_id,
						job_reference_number : _selected_job_reference_number,
						client_id : e.row.client_id,
						client_reference_number : e.row.client_reference_number,
						client_type_code : e.row.client_type_code,
						action_for_client : 'view_client',
						parent_win : win
					});
					Titanium.UI.currentTab.open(view_client_win, {
						animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
					});
				} else {
					var client_win = Ti.UI.createWindow({
						url : self.get_file_path('url', 'client/select_client.js'),
						client_id : _client_id,
						is_save_directly : true,
						job_id : _selected_job_id,
						job_reference_number : _selected_job_reference_number,
						job_type : _type
					});
					Titanium.UI.currentTab.open(client_win, {
						animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
					});
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_detail_client');
				return;
			}
		}
		function _event_for_table_view_click_detail_title(e) {
			try {
				var new_win = Ti.UI.createWindow({
					url : self.get_file_path('url', 'job/base/job_title.js'),
					type : _type,
					job_id : _selected_job_id
				});
				Ti.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_detail_title');
				return;
			}
		}
		function _event_for_table_view_click_detail_order_reference_number(e) {
			try {
				var new_win = Ti.UI.createWindow({
					url : self.get_file_path('url', 'job/base/job_order_reference_number.js'),
					type : _type,
					job_id : _selected_job_id
				});
				Ti.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_detail_order_reference_number');
				return;
			}
		}
		function _event_for_table_view_click_detail_status(e) {
			try {
				var new_win = Ti.UI.createWindow({
					url : self.get_file_path('url', 'job/base/job_select_status.js'),
					type : _type,
					job_id : _selected_job_id,
					job_status_code : _selected_job_status_code,
					source : 'from_job_index'
				});
				Ti.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_detail_status');
				return;
			}
		}
		function _event_for_table_view_click_detail_status_reason(e) {
			try {
				var new_win = Ti.UI.createWindow({
					url : self.get_file_path('url', 'job/base/job_status_reason.js'),
					type : _type,
					job_id : _selected_job_id,
					job_status_code : _selected_job_status_code,
					job_status_log_id : e.row.job_status_log_id,
					source : 'from_job_index'
				});
				Ti.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_detail_status_reason');
				return;
			}
		}
		function _event_for_table_view_click_detail_address(e) {
			try {
				var new_win = Ti.UI.createWindow({
					url : self.get_file_path('url', 'job/base/job_address.js'),
					type : _type,
					job_id : _selected_job_id,
					job_reference_number : _selected_job_reference_number,
					sub_number : e.row.sub_number,
					unit_number : e.row.unit_number,
					street_number : e.row.street_number,
					street : e.row.street,
					street_type : e.row.street_type,
					suburb : e.row.suburb,
					postcode : e.row.postcode,
					state : e.row.state,
					stateID : e.row.stateID,
					street_type_id : e.row.street_type_id,
					suburb_id : e.row.suburb_id
				});
				Ti.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_detail_address');
				return;
			}
		}
		function _event_for_table_view_click_detail_description(e) {
			try {
				var new_win = Ti.UI.createWindow({
					url : self.get_file_path('url', 'job/base/job_description.js'),
					type : _type,
					job_id : _selected_job_id
				});
				Ti.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_detail_description');
				return;
			}
		}
		function _event_for_table_view_click_detail_booking_note(e) {
			try {
				var new_win = Ti.UI.createWindow({
					url : self.get_file_path('url', 'job/base/job_booking_note.js'),
					type : _type,
					job_id : _selected_job_id
				});
				Ti.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_detail_booking_note');
				return;
			}
		}
		function _event_for_table_view_click_client_contact(e) {
			try {
				if (e.source.name === 'view_btn') {
					var new_win = Ti.UI.createWindow({
						url : self.get_file_path('url', 'job/edit/job_client_contact_view.js'),
						type : _type,
						job_client_contact_id : e.row.job_client_contact_id,
						client_contact_id : e.row.object_id,
						client_id : _client_id,
						job_id : _selected_job_id,
						job_reference_number : _selected_job_reference_number,
						action_for_client_contact : 'view_job_client_contact',
						source : 'job_index_view'
					});
					Ti.UI.currentTab.open(new_win, {
						animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
					});
				} else {
					if ((e.row.title != undefined) && (e.row.title === 'Client Contacts')) {
						new_win = Ti.UI.createWindow({
							url : self.get_file_path('url', 'job/base/job_client_contact_list.js'),
							type : _type,
							job_id : _selected_job_id,
							client_id : _client_id,
							job_reference_number : _selected_job_reference_number
						});
					} else {
						new_win = Ti.UI.createWindow({
							url : self.get_file_path('url', 'job/base/job_client_contact.js'),
							type : _type,
							job_id : _selected_job_id,
							job_client_contact_id : e.row.job_client_contact_id,
							client_contact_id : e.row.object_id,
							client_id : _client_id,
							action_for_client_contact : 'edit_job_client_contact'
						});
					}
					Titanium.UI.currentTab.open(new_win, {
						animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
					});
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_client_contact');
				return;
			}
		}
		function _event_for_table_view_click_site_contact(e) {
			try {
				if (e.source.name === 'view_btn') {
					var new_win = Ti.UI.createWindow({
						url : self.get_file_path('url', 'job/edit/job_site_contact_view.js'),
						type : _type,
						job_id : _selected_job_id,
						job_reference_number : _selected_job_reference_number,
						action_for_site_contact : 'view_job_site_contact',
						site_contact_id : e.row.object_id
					});
					Ti.UI.currentTab.open(new_win, {
						animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
					});
				} else {
					if ((e.row.title != undefined) && (e.row.title === 'Site Contacts')) {
						new_win = Ti.UI.createWindow({
							url : self.get_file_path('url', 'job/base/job_site_contact_list.js'),
							type : _type,
							job_id : _selected_job_id,
							job_reference_number : _selected_job_reference_number
						});
					} else {
						new_win = Ti.UI.createWindow({
							url : self.get_file_path('url', 'job/base/job_site_contact.js'),
							type : _type,
							job_id : _selected_job_id,
							job_reference_number : _selected_job_reference_number,
							action_for_site_contact : 'edit_job_site_contact',
							job_site_contact_id : e.row.object_id
						});
					}
					Ti.UI.currentTab.open(new_win, {
						animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
					});
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_site_contact');
				return;
			}
		}
		function _event_for_table_view_click_user(e) {
			try {
				if (e.source.name === 'view_btn') {
					var new_win = Ti.UI.createWindow({
						url : self.get_file_path('url', 'job/edit/job_user_view.js', ''),
						type : _type,
						job_id : _selected_job_id,
						job_reference_number : _selected_job_reference_number,
						action_for_user : 'view_job_user',
						manager_user_id : e.row.manager_user_id,
						job_assigned_user_id : e.row.object_id,
						job_assigned_user_code : e.row.job_assigned_user_code,
						assigned_from : e.row.assigned_from,
						assigned_to : e.row.assigned_to
					});
					Ti.UI.currentTab.open(new_win, {
						animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
					});
				} else {
					if ((e.row.title != undefined) && (e.row.title === 'Assigned Users')) {
						new_win = Ti.UI.createWindow({
							url : self.get_file_path('url', 'job/base/job_assigned_user_list.js'),
							type : _type,
							job_id : _selected_job_id,
							job_reference_number : _selected_job_reference_number
						});
					} else {
						new_win = Ti.UI.createWindow({
							url : self.get_file_path('url', 'job/base/job_assigned_user.js'),
							type : _type,
							job_id : _selected_job_id,
							job_reference_number : _selected_job_reference_number,
							manager_user_id : e.row.manager_user_id,
							job_assigned_user_id : e.row.object_id,
							job_assigned_user_code : e.row.job_assigned_user_code,
							assigned_from : e.row.assigned_from,
							assigned_to : e.row.assigned_to,
							action_for_assigned_user : 'edit_job_assigned_user'
						});
					}
					Ti.UI.currentTab.open(new_win, {
						animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
					});
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_user');
				return;
			}
		}
		function _event_for_table_view_click_note(e) {
			try {
				var new_win = Ti.UI.createWindow({
					url : self.get_file_path('url', e.row.view_url),
					type : _type,
					job_id : _selected_job_id
				});
				Ti.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_note');
				return;
			}
		}
		function _event_for_table_view_click_history(e) {
			try {
				var new_win = null;
				switch (e.row.filter_class){
					case 'site_history':
						var _street_type_id = 0;
						var _state_id = 0;
						var _street_number = '';
						var _street = '';
						var _suburb = '';
						var db = Titanium.Database.open(self.get_db_name());
						var selected_job_obj = db.execute('SELECT * FROM my_' + _type + ' WHERE id=? and company_id=?', _selected_job_id, _selected_company_id);
						if ((selected_job_obj.getRowCount() > 0) && (selected_job_obj.isValidRow())) {
							_street_type_id = selected_job_obj.fieldByName('locality_street_type_id');
							_state_id = selected_job_obj.fieldByName('locality_state_id');
							_street_number = self.trim(selected_job_obj.fieldByName('street_number'));
							_street = self.trim(selected_job_obj.fieldByName('street'));
							_suburb = self.trim(selected_job_obj.fieldByName('suburb'));
						}
						selected_job_obj.close();
						db.close();
						
						if ((self.trim(_street_number) == '') && (self.trim(_street) == '') && (self.trim(_suburb) == '') && (_state_id == 0)) {
							new_win = Ti.UI.createWindow({
								url : self.get_file_path('url', 'job/edit/job_site_history.js'),
								job_id : _selected_job_id,
								is_display_no_result : true,
								is_online : true,
								type : 'job'
							});
							Ti.UI.currentTab.open(new_win, {
								animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
							});
						} else {
							var streetTypeName = '';
							var streetTypeId = 0;
							var newStreet = '';
							if (self.trim(_street) != '') {
								var streetArray = self.trim(_street).split(' ');
								if (streetArray.length > 1) {
									streetTypeName = streetArray[streetArray.length - 1];
									streetTypeId = self.return_street_type_id(streetTypeName);
								}
								if (streetTypeId > 0) {
									for ( var i = 0, j = streetArray.length - 1; i < j; i++) {
										if (i > 0) {
											newStreet += ' ';
										}
										newStreet += streetArray[i];
									}
								} else {
									streetTypeId = (_street_type_id == null) ? 0 : _street_type_id;
								}
							}
							
							var query_value = '';
							var search_query_value = '';
							var server_query_value = '';
							if (self.trim(_street_number) != '') {
								_street_number = self.replace(_street_number, '"', ''); // remove
								// "
								// symbol
								if (query_value != '') {
									query_value += ' and ';
									search_query_value += ' and ';
									server_query_value += ' and ';
								}
								query_value += ' upper(my_job.street_number) =  upper(\"' + self.trim(_street_number) + '\")';
								search_query_value += ' upper(my_job.street_number) = upper(\"' + self.trim(_street_number) + '\")';
								server_query_value += ' upper(street_number) = upper(\"' + self.trim(_street_number) + '\")';
							}
							if (self.trim(_street) != '') {
								if (query_value != '') {
									query_value += ' and ';
									search_query_value += ' and ';
									server_query_value += ' and ';
								}
								if (newStreet != '') {
									newStreet = self.replace(newStreet, '"', ''); // remove
									// "
									// symbol
									query_value += ' (upper(my_job.street) = upper(\"' + self.trim(newStreet) + '\") or (upper(my_job.street) = upper(\"' + self.trim(newStreet) + ' ' + self.trim(streetTypeName) + '\")))';
									search_query_value += ' (upper(my_job.street) = upper(\"' + self.trim(newStreet) + '\") or (upper(my_job.street) = upper(\"' + self.trim(newStreet) + ' ' + self.trim(streetTypeName) + '\")))';
									server_query_value += ' (upper(street) = upper(\"' + self.trim(newStreet) + '\") or (upper(street) = upper(\"' + self.trim(newStreet) + ' ' + self.trim(streetTypeName) + '\")))';
								} else {
									_street = self.replace(_street, '"', ''); // remove
									// "
									// symbol
									query_value += ' (upper(my_job.street) = upper(\"' + self.trim(_street) + '\") or (upper(my_job.street) = upper(\"' + self.trim(_street) + ' ' + self.trim(streetTypeName) + '\")))';
									search_query_value += ' (upper(my_job.street) = upper(\"' + self.trim(_street) + '\") or (upper(my_job.street) = upper(\"' + self.trim(_street) + ' ' + self.trim(streetTypeName) + '\")))';
									server_query_value += ' (upper(street) = upper(\"' + self.trim(_street) + '\") or (upper(street) = upper(\"' + self.trim(_street) + ' ' + self.trim(streetTypeName) + '\")))';
								}
								if (streetTypeId > 0) {
									query_value += ' and my_job.locality_street_type_id=' + streetTypeId;
									search_query_value += ' and my_job.locality_street_type_id=' + streetTypeId;
									server_query_value += ' and locality_street_type_id=' + streetTypeId;
								}
							}
							if (_state_id != 0) {
								if (query_value != '') {
									query_value += ' and ';
									search_query_value += ' and ';
									server_query_value += ' and ';
								}
								query_value += ' my_job.locality_state_id =' + _state_id;
								search_query_value += ' my_job.locality_state_id =' + _state_id;
								server_query_value += ' locality_state_id =' + _state_id;
							}
							if (self.trim(_suburb) != '') {
								_suburb = self.replace(_suburb, '"', ''); // remove
								// "
								// symbol
								if (query_value != '') {
									query_value += ' and ';
									search_query_value += ' and ';
									server_query_value += ' and ';
								}
								search_query_value += ' my_job.locality_suburb_id in (select s.id from locality_suburb as s where upper(s.suburb) =  upper(\"' + self.trim(_suburb) + '\"))';
								query_value += ' upper(my_job.suburb) = upper(\"' + self.trim(_suburb) + '\")';
								server_query_value += ' locality_suburb_id in (select s.id from locality_suburb as s where upper(s.suburb) = upper(\"' + self.trim(_suburb) + '\"))';
							}
							Ti.API.info('search_query_value:' + search_query_value);
							
							// search server for
							// finding result number
							if (Ti.Network.online) {
								self.display_indicator('Loading Data ...');
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
											
											var result = JSON.parse(this.responseText);
											var total_search_result = result.search_by_conditions[0].search_result;
											self.hide_indicator();
											
											var new_win = Ti.UI.createWindow({
												url : self.get_file_path('url', 'job/edit/job_site_history.js'),
												job_id : _selected_job_id,
												is_display_no_result : false,
												is_online : true,
												server_query_value : server_query_value,
												type : _type,
												total_search_result : total_search_result
											});
											Ti.UI.currentTab.open(new_win, {
												animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
											});
										} else {
											self.hide_indicator();
											var params = {
												message : L('message_not_get_search_result_in_job_filter_model_window'),
												show_message : true,
												message_title : '',
												send_error_email : true,
												error_message : '',
												error_source : window_source + ' - _event_for_table_view_click_history - xhr.onload - 1',
												server_response_message : this.responseText
											};
											self.processXYZ(params);
											return;
										}
									} catch (e) {
										self.hide_indicator();
										params = {
											message : L('message_not_get_search_result_in_job_filter_model_window'),
											show_message : true,
											message_title : '',
											send_error_email : true,
											error_message : e,
											error_source : window_source + ' - _event_for_table_view_click_history - xhr.onload - 2',
											server_response_message : this.responseText
										};
										self.processXYZ(params);
										return;
									}
								};
								xhr.onerror = function(e) {
									self.hide_indicator();
									var params = {
										message : L('message_not_get_search_result_in_job_filter_model_window'),
										show_message : true,
										message_title : '',
										send_error_email : true,
										error_message : e,
										error_source : window_source + ' - _event_for_table_view_click_history - xhr.onerror',
										server_response_message : this.responseText
									};
									self.processXYZ(params);
									return;
								};
								xhr.setTimeout(self.default_time_out);
								xhr.open('POST', self.get_host_url() + 'update', false);
								xhr.send({
									'type' : 'search_by_conditions',
									'hash' : _selected_user_id,
									'company_id' : _selected_company_id,
									'user_id' : _selected_user_id,
									'filter_class' : 'find_job_address',
									'query_field' : '',
									'query_value' : query_value,
									'search_query_value' : search_query_value,
									'job_type' : win.type,
									'app_security_session' : self.is_simulator() ? self.default_udid : Titanium.Platform.id,
									'app_version_increment' : self.version_increment,
									'app_version' : self.version,
									'app_platform' : self.get_platform_info()
								});
							} else {
								new_win = Ti.UI.createWindow({
									url : self.get_file_path('url', 'job/edit/job_site_history.js'),
									job_id : _selected_job_id,
									is_display_no_result : true,
									is_online : false,
									type : 'job'
								});
								Ti.UI.currentTab.open(new_win, {
									animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
								});
								return;
							}
						}
						break;
					default:
						new_win = Ti.UI.createWindow({
							url : self.get_file_path('url', e.row.view_url),
							type : _type,
							job_id : _selected_job_id
						});
						Ti.UI.currentTab.open(new_win, {
							animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
						});
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_history');
				return;
			}
		}
		function _event_for_table_view_click_media(e) {
			try {
				var new_win = Ti.UI.createWindow({
					title : ((e.row.asset_type_name).toLowerCase() === 'document') ? 'Other Media' : self.ucfirst_for_each(e.row.asset_type_name),
					url : self.get_file_path('url', e.row.view_url),
					type : _type,
					job_id : _selected_job_id,
					job_reference_number : _selected_job_reference_number,
					asset_type_code : e.row.asset_type_code,
					asset_type_path : e.row.asset_type_path,
					asset_type_name : e.row.asset_type_name
				});
				Ti.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_media');
				return;
			}
		}
		function _event_for_table_view_click_invoice(e) {
			try {
				var _check_start_new_invoice = 0;
				if (_check_if_exist_change()) {
					_check_start_new_invoice = 1;
				} else {
					if (_client_id <= 0) {
						_check_start_new_invoice = 2;
					}
				}
				var new_win = Ti.UI.createWindow({
					url : self.get_file_path('url', e.row.view_url),
					type : _type,
					job_id : _selected_job_id,
					job_reference_number : _selected_job_reference_number,
					check_start_new_invoice : _check_start_new_invoice,
					client_id : _client_id
				});
				Ti.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_invoice');
				return;
			}
		}
		function _event_for_table_view_click_invoice_locksmith(e) {
			try {
				var new_win = Ti.UI.createWindow({
					url : self.get_file_path('url', e.row.view_url),
					type : _type,
					job_id : _selected_job_id,
					job_reference_number : _selected_job_reference_number
				});
				Ti.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_invoice_locksmith');
				return;
			}
		}
		function _event_for_table_view_click_custom_report(e) {
			try {
				var _check_start_new_custom_report = 0;
				if (_check_if_exist_change()) {
					_check_start_new_custom_report = 1;
				} else {
					if (_client_id <= 0) {
						_check_start_new_custom_report = 2;
					}
				}
				var new_win = Ti.UI.createWindow({
					url : self.get_file_path('url', e.row.view_url),
					type : _type,
					job_id : _selected_job_id,
					job_reference_number : _selected_job_reference_number,
					check_start_new_custom_report : _check_start_new_custom_report
				});
				Ti.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_custom_report');
				return;
			}
		}
		function _event_for_table_view_click_purchase_order(e) {
			try {
				var _check_start_new_purchase_order = 0;
				if (_check_if_exist_change()) {
					_check_start_new_purchase_order = 1;
				} else {
					if (_client_id <= 0) {
						_check_start_new_purchase_order = 2;
					}
				}
				var new_win = Ti.UI.createWindow({
					url : self.get_file_path('url', e.row.view_url),
					type : _type,
					job_id : _selected_job_id,
					job_reference_number : _selected_job_reference_number,
					check_start_new_purchase_order : _check_start_new_purchase_order
				});
				Ti.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_table_view_click_purchase_order');
				return;
			}
		}
		/**
		 * init window title
		 */
		function _init_window_title() {
			try {
				self.data = [];
				if (_action_for_job === 'add_job') {
					var d = new Date();
					_selected_job_id = parseInt(d.getTime(), 10);
					Ti.API.info('_selected_job_id:' + _selected_job_id);
					_selected_job_reference_number = _selected_job_id;
				}
				if (_action_for_job === 'add_job') {
					win.title = 'New ' + self.ucfirst(_type);
				} else {
					if (_selected_job_id > 1000000000) {
						win.title = 'New ' + self.ucfirst(_type);
					} else {
						win.title = self.ucfirst(_type) + ' : ' + _selected_job_reference_number;
					}
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_window_title');
				return;
			}
		}
		function _init_bottom_tool_bar() {
			try {
				// add action button
				self.action_bar = Titanium.UI.iOS.createTabbedBar({
					labels : (self.is_ipad()) ? [ 'Map', 'SMS', 'Push', 'Email', 'Reload' ] : [ 'Map', 'SMS', 'Push', 'Email', 'Call', 'Reload' ],
					style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
					height : 30,
					width : self.screen_width - 20
				});
				
				self.bottom_tool_bar = Ti.UI.iOS.createToolbar({
					items : [ self.action_bar ],
					bottom : 0,
					borderColor : self.tool_bar_color_in_ios_7,
					borderWidth : 1,
					zIndex : 100
				});
				if (self.is_ios_7_plus()) {
					// self.bottom_tool_bar.barColor =
					// self.default_tool_bar_background_color;
					// self.action_bar.backgroundColor =
					// self.set_table_view_header_backgroundcolor;
				}
				win.add(self.bottom_tool_bar);
				if (_selected_job_id > 1000000000) {
					self.bottom_tool_bar.visible = false;
				}
				self.action_bar.addEventListener('click', function(e) {
					_action_bar_event(e);
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_bottom_tool_bar');
				return;
			}
		}
		/**
		 * load latitude and longitude. if latitude = 0 and longitude =
		 * 0, then job hasn't get job adress location. else doesn't
		 * display "checking address" toolbar
		 */
		function _check_job_address() {
			try {
				if ((_action_for_job != 'add_job') || (_selected_job_id > 1000000000)) {
					if (Ti.Network.online) {
						var db = Titanium.Database.open(self.get_db_name());
						var rows = db.execute('SELECT * FROM my_' + _type + ' WHERE id=?', _selected_job_id);
						if ((rows.getRowCount() > 0) && (rows.isValidRow())) {
							var latitude = (rows.fieldByName('latitude') === null) ? 0 : rows.fieldByName('latitude');
							var longitude = (rows.fieldByName('longitude') === null) ? 0 : rows.fieldByName('longitude');
							var sub_number = (rows.fieldByName('sub_number') === null) ? '' : self.trim(rows.fieldByName('sub_number'));
							var unit_number = (rows.fieldByName('unit_number') === null) ? '' : self.trim(rows.fieldByName('unit_number'));
							var street_number = (rows.fieldByName('street_number') === null) ? '' : self.trim(rows.fieldByName('street_number'));
							var street = (rows.fieldByName('street') === null) ? '' : self.trim(rows.fieldByName('street'));
							var street_type = (rows.fieldByName('street_type') === null) ? '' : rows.fieldByName('street_type');
							var suburb = (rows.fieldByName('suburb') === null) ? '' : rows.fieldByName('suburb');
							var postcode = (rows.fieldByName('postcode') === null) ? '' : rows.fieldByName('postcode');
							var state_id = (rows.fieldByName('locality_state_id') === null) ? 0 : rows.fieldByName('locality_state_id');
							var state_rows = db.execute('SELECT * FROM my_locality_state WHERE id=?', rows.fieldByName('locality_state_id'));
							if ((state_rows.getRowCount() > 0) && (state_rows.isValidRow())) {
								var state = (state_rows.fieldByName('state') === null) ? '' : state_rows.fieldByName('state');
								var state_abbr = (state_rows.fieldByName('state_abbr') === null) ? '' : state_rows.fieldByName('state_abbr');
							}
							var new_addr = street_number + ',+' + street + ',+' + suburb;
							var temp_country = Titanium.App.Properties.getString('selected_country_name');
							temp_country = (temp_country === null) ? '' : temp_country;
							var new_addr_state_and_country = '';
							if (self.trim(temp_country) != '') {
								new_addr_state_and_country = ',+' + state_abbr + ',+' + temp_country;
							} else {
								new_addr_state_and_country = ',+' + state_abbr;
							}
							new_addr = self.replace(new_addr, ' ', '+');
							new_addr_state_and_country = self.replace(new_addr_state_and_country, '  ', '+');
						}
						rows.close();
						db.close();
						if ((latitude != undefined) && (latitude === 0) && (longitude === 0) && (street != '')) {
							var params = {
								user_id : _selected_user_id,
								company_id : _selected_company_id,
								hide_indicator : false,
								sub_number : (sub_number === undefined) ? '' : sub_number,
								unit_number : (unit_number === undefined) ? '' : unit_number,
								street_number : (street_number === undefined) ? '' : street_number,
								street : (street === undefined) ? '' : street,
								street_type : (street_type === undefined) ? '' : street_type,
								suburb : (suburb === undefined) ? '' : suburb,
								postcode : (postcode === undefined) ? '' : postcode,
								state : (state === undefined) ? '' : state,
								state_id : (state_id === undefined) ? 0 : state_id,
								new_addr : (new_addr === undefined) ? '' : new_addr,
								new_addr_state_and_country : (new_addr_state_and_country === undefined) ? '' : new_addr_state_and_country
							};
							self.check_address(params);
						}
					}
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _check_job_address');
				return;
			}
		}
		function _action_bar_event(e) {
			try {
				switch (e.index){
					case 0:// map
						if (!Ti.Network.online) {
							self.show_message(L('message_offline'), L('message_unable_to_connect'));
							return;
						} else {
							var new_win = Ti.UI.createWindow({
								url : self.get_file_path('url', 'job/edit/job_map.js'),
								type : _type,
								job_id : _selected_job_id,
								job_reference_number : _selected_job_reference_number,
								action_for_job : _action_for_job
							});
							Ti.UI.currentTab.open(new_win, {
								animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
							});
						}
						break;
					case 1:// sms
						if (!Ti.Network.online) {
							self.show_message(L('message_offline'), L('message_unable_to_connect'));
							return;
						} else {
							self.action_events(_type, 'sms', _selected_job_id, _selected_job_reference_number, JSON.stringify([]));
						}
						break;
					
					case 2:// push
						if (!Ti.Network.online) {
							self.show_message(L('message_offline'), L('message_unable_to_connect'));
							return;
						} else {
							self.action_events(_type, 'push', _selected_job_id, _selected_job_reference_number, JSON.stringify([]));
						}
						break;
					case 3:// email
						if (!Ti.Network.online) {
							self.show_message(L('message_offline'), L('message_unable_to_connect'));
							return;
						} else {
							self.action_events(_type, 'email', _selected_job_id, _selected_job_reference_number, JSON.stringify([]));
						}
						break;
					case 4:// call or (reload on ipad)
						if (self.is_ipad()) {
							if (!Ti.Network.online) {
								self.show_message(L('message_offline'), L('message_unable_to_connect'));
								return;
							} else {
								_reload_job_from_server();
							}
						} else {
							var client_contact_win = Titanium.UI.createWindow({
								title : 'Contact List',
								url : self.get_file_path('url', 'action/contact_source/contact_list_for_phone.js'),
								type : _type,
								source : 'phone',
								job_id : _selected_job_id,
								job_reference_number : _selected_job_reference_number
							});
							Ti.UI.currentTab.open(client_contact_win, {
								animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
							});
						}
						break;
					case 5:// reload job or quote, need to
						// prompt user firstly, then
						// reload data from server
						if (!Ti.Network.online) {
							self.show_message(L('message_offline'), L('message_unable_to_connect'));
							return;
						} else {
							_reload_job_from_server();
						}
						break;
				}
				self.action_bar.index = -1;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _action_bar_event');
				return;
			}
		}
		function _reload_job_from_server() {
			try {
				var option_dialog = Ti.UI.createOptionDialog({
					options : (self.is_ipad()) ? [ 'YES', 'NO', '' ] : [ 'YES', 'NO' ],
					buttonNames : [ 'NO' ],
					destructive : 0,
					cancel : 1,
					title : 'Do you want to reload data from server?'
				});
				option_dialog.show();
				option_dialog.addEventListener('click', function(e) {
					switch (e.index){
						case 0:// yes,upload
							self.display_indicator('Loading Data ...', false);
							var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
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
									Ti.API.info(this.responseText);
									if ((xhr.readyState === 4) && (this.status === 200)) {
										if (self.return_to_login_page_if_user_security_session_changed(this.responseText)) {
											return;
										}
										if (self.display_app_version_incompatiable(this.responseText)) {
											self.hide_indicator();
											return;
										}
										// _delete_new_record_and_file(_selected_job_id);
										self.refresh_job_and_relative_tables(this.responseText, _type);
										Ti.App.Properties.setBool('refresh_list', true);
										self.display();
										self.hide_indicator();
									} else {
										self.hide_indicator();
										var params = {
											message : 'Download ' + _type + ' error.',
											show_message : true,
											message_title : '',
											send_error_email : true,
											error_message : '',
											error_source : window_source + ' - _reload_job_from_server - xhr.onload - 1',
											server_response_message : this.responseText
										};
										self.processXYZ(params);
										return;
									}
								} catch (e) {
									self.hide_indicator();
									params = {
										message : 'Download ' + _type + ' error.',
										show_message : true,
										message_title : '',
										send_error_email : true,
										error_message : e,
										error_source : window_source + ' - _reload_job_from_server - xhr.onload - 2',
										server_response_message : this.responseText
									};
									self.processXYZ(params);
									return;
								}
							};
							xhr.onerror = function(e) {
								self.hide_indicator();
								var params = {
									message : 'Download ' + _type + ' error.',
									show_message : true,
									message_title : '',
									send_error_email : true,
									error_message : e,
									error_source : window_source + ' - _reload_job_from_server - xhr.onerror',
									server_response_message : this.responseText
								};
								self.processXYZ(params);
								return;
							};
							xhr.setTimeout(self.default_time_out);
							xhr.open('POST', self.get_host_url() + 'update', false);
							xhr.send({
								'type' : 'download_job',
								'job_type' : _type,
								'hash' : _selected_user_id,
								'company_id' : _selected_company_id,
								'user_id' : _selected_user_id,
								'job_id_string' : _selected_job_id,
								'app_security_session' : self.is_simulator() ? self.default_udid : Titanium.Platform.id,
								'app_version_increment' : self.version_increment,
								'app_version' : self.version,
								'app_platform' : self.get_platform_info()
							});
							break;
						case 1:
							break;
					}
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _reload_job_from_server');
				return;
			}
		}
		
		function _create_separate_header_view() {
			try {
				if (self.is_ios_7_plus()) {
					var header_view = Ti.UI.createView({
						height : 20,
						width : self.screen_width
					});
					
					header_view.backgroundColor = self.set_table_view_header_backgroundcolor;
					if (_section_no > 0) {
						var header_title_label = Ti.UI.createView({
							backgroundColor : '#ccc',
							width : self.screen_width,
							height : 2
						});
						header_view.add(header_title_label);
					}
					var section = Ti.UI.createTableViewSection({
						headerView : header_view
					});
					self.data[_section_no] = section;
					_section_no++;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_row_header_view');
				return;
			}
		}
		/**
		 * init header view of row and set events for click button
		 */
		function _init_row_header_view(type_class, title, is_show_edit_btn, header_title_btn_url) {
			try {
				var header_view = Ti.UI.createView({
					height : _header_view_height,
					width : self.screen_width
				});
				if (self.is_ios_7_plus()) {
					header_view.backgroundColor = self.set_table_view_header_backgroundcolor;
				}
				var header_title_label = Ti.UI.createLabel({
					font : {
						fontSize : _header_view_font_size,
						fontWeight : 'bold'
					},
					text : title,
					textAlign : 'left',
					top : 0,
					left : (self.is_ipad()) ? 50 : 10,
					width : 200,
					height : _header_view_title_height,
					color : self.section_header_title_font_color,
					shadowColor : self.section_header_title_shadow_color,
					shadowOffset : self.section_header_title_shadow_offset
				});
				if (self.is_ios_7_plus()) {
					header_title_label.left = 10;
				}
				header_view.add(header_title_label);
				
				var header_title_btn = null;
				switch (type_class){
					case 'history':
						// case 'start_job':
					case 'quote_accepted':
					case 'unrelated_job':
					case 'invoices_locksmith':
						break;
					case 'start_job':
						self.time_label = Ti.UI.createLabel({
							font : {
								fontSize : _header_view_font_size,
								fontWeight : 'bold'
							},
							text : 'Elapsed ' + ((_start_btn_timer_hours < 10) ? '0' + _start_btn_timer_hours : _start_btn_timer_hours) + ':' + ((_start_btn_timer_minutes < 10) ? '0' + _start_btn_timer_minutes : _start_btn_timer_minutes) + ':' + ((_start_btn_timer_seconds < 10) ? '0' + _start_btn_timer_seconds : _start_btn_timer_seconds),
							textAlign : 'center',
							width : 150,
							right : 10,
							color : self.section_header_title_font_color,
							shadowColor : self.section_header_title_shadow_color,
							shadowOffset : self.section_header_title_shadow_offset
						});
						header_view.add(self.time_label);
						break;
					default:
						header_title_btn = Ti.UI.createButton({
							backgroundImage : self.get_file_path('image', 'btn_grey.png'),
							color : '#fff',
							font : {
								fontSize : _header_view_font_size,
								fontWeight : 'bold'
							},
							title : (!is_show_edit_btn) ? 'Add' : 'Edit',
							textAlign : 'center',
							style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
							top : 0,
							right : (self.is_ipad()) ? 50 : 10,
							width : _header_view_button_width,
							height : _header_view_button_height
						});
						if (self.is_ios_7_plus()) {
							header_title_btn.right = 10;
						}
						header_view.add(header_title_btn);
				}
				var section = Ti.UI.createTableViewSection({
					headerView : header_view
				});
				self.data[_section_no] = section;
				
				if (header_title_btn != null) {
					header_title_btn.addEventListener('click', function() {
						switch (type_class){
							case 'job_detail':
							case 'job_description':
							case 'job_booking_note':
								_header_title_btn_click_event_for_job_detail(header_title_btn_url);
								break;
							case 'client_contact':
								_header_title_btn_click_event_for_client_contact(header_title_btn_url);
								break;
							case 'site_contact':
								_header_title_btn_click_event_for_site_contact(header_title_btn_url);
								break;
							case 'assigned_user':
								_header_title_btn_click_event_for_assigned_user(header_title_btn_url);
								break;
							case 'notes':
								_header_title_btn_click_event_for_note(header_title_btn_url);
								break;
							case 'invoices':
								_header_title_btn_click_event_for_invoice(header_title_btn_url);
								break;
							case 'custom_report':
								_header_title_btn_click_event_for_custom_report(header_title_btn_url);
								break;
							case 'purchase_order':
								_header_title_btn_click_event_for_purchase_order(header_title_btn_url);
								break;
						}
					});
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_row_header_view');
				return;
			}
		}
		function _header_title_btn_click_event_for_job_detail(header_title_btn_url) {
			try {
				var new_win = Ti.UI.createWindow({
					type : _type,
					url : header_title_btn_url,
					action_for_job : _action_for_job,
					job_id : _selected_job_id,
					job_reference_number : _selected_job_reference_number
				});
				Ti.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _header_title_btn_click_event_for_job_detail');
				return;
			}
		}
		function _header_title_btn_click_event_for_client_contact(header_title_btn_url) {
			try {
				if ((_client_id === 0) || (_client_id === undefined) || (_client_id === null)) {
					self.show_message('Please select client in ' + _type + ' detail.');
					return;
				}
				var contact_win = Ti.UI.createWindow({
					url : header_title_btn_url,
					type : _type,
					job_id : _selected_job_id,
					job_client_contact_id : 0,
					client_contact_id : 0,
					client_id : _client_id,
					action_for_client_contact : 'add_job_client_contact'
				});
				Titanium.UI.currentTab.open(contact_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _header_title_btn_click_event_for_client_contact');
				return;
			}
		}
		function _header_title_btn_click_event_for_site_contact(header_title_btn_url) {
			try {
				var new_win = Ti.UI.createWindow({
					url : header_title_btn_url,
					type : _type,
					job_id : _selected_job_id,
					job_reference_number : _selected_job_reference_number,
					action_for_site_contact : 'add_job_site_contact',
					job_site_contact_id : 0
				});
				Ti.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _header_title_btn_click_event_for_site_contact');
				return;
			}
		}
		function _header_title_btn_click_event_for_assigned_user(header_title_btn_url) {
			try {
				var user_win = Ti.UI.createWindow({
					url : header_title_btn_url,
					type : _type,
					job_id : _selected_job_id,
					manager_user_id : 0,
					job_assigned_user_id : 0,
					job_assigned_user_code : 0,
					assigned_from : null,
					assigned_to : null,
					action_for_assigned_user : 'add_job_assigned_user'
				});
				Titanium.UI.currentTab.open(user_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _header_title_btn_click_event_for_assigned_user');
				return;
			}
		}
		function _header_title_btn_click_event_for_note(header_title_btn_url) {
			try {
				var note_win = Ti.UI.createWindow({
					url : header_title_btn_url,
					type : _type,
					job_id : _selected_job_id,
					job_note_id : 0,
					job_note_type : 0,
					action_for_note : 'add_job_note'
				});
				Titanium.UI.currentTab.open(note_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _header_title_btn_click_event_for_note');
				return;
			}
		}
		function _header_title_btn_click_event_for_media_work_order_and_document(asset_path, asset_code) {
			try {
				var option_dialog = Ti.UI.createOptionDialog({
					options : (self.is_ipad()) ? [ 'From Camera', 'From Library', 'Add Audio', 'Cancel', '' ] : [ 'From Camera', 'From Library', 'Add Audio', 'Cancel' ],
					buttonNames : [ 'Cancel' ],
					destructive : 0,
					cancel : 3,
					title : L('message_select_option')
				});
				option_dialog.show();
				option_dialog.addEventListener('click', function(e) {
					if (e.index === 0) {
						self.show_camera('', _selected_job_id, _selected_job_reference_number, _selected_company_id, _type, asset_path, asset_code);
					}
					if (e.index === 1) {
						self.show_library('', _selected_job_id, _selected_job_reference_number, _selected_company_id, _type, asset_path, asset_code);
						// self.test_library('',_selected_job_id,_selected_job_reference_number,_selected_company_id,_type,asset_path,asset_code);
					}
					if (e.index === 2) {
						var new_win = Titanium.UI.createWindow({
							type : _type,
							url : self.get_file_path('url', 'job/base/job_create_audio.js'),
							job_id : _selected_job_id,
							job_reference_number : _selected_job_reference_number,
							asset_id : 0,
							asset_type_code : asset_code,
							asset_type_path : asset_path
						});
						Titanium.UI.currentTab.open(new_win, {
							animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
						});
					}
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _header_title_btn_click_event_for_media_work_order_and_document');
				return;
			}
		}
		function _header_title_btn_click_event_for_media_photo_and_video(asset_path, asset_code) {
			try {
				var option_dialog = Ti.UI.createOptionDialog({
					options : (self.is_ipad()) ? [ 'From Camera', 'From Library', 'Cancel', '' ] : [ 'From Camera', 'From Library', 'Cancel' ],
					buttonNames : [ 'Cancel' ],
					destructive : 0,
					cancel : 2,
					title : L('message_select_option')
				});
				option_dialog.show();
				option_dialog.addEventListener('click', function(e) {
					if (e.index === 0) {
						if (asset_code === 2) {
							self.show_camera('photo', _selected_job_id, _selected_job_reference_number, _selected_company_id, _type, asset_path, asset_code);
						} else {
							self.show_camera('video', _selected_job_id, _selected_job_reference_number, _selected_company_id, _type, asset_path, asset_code);
						}
					}
					if (e.index === 1) {
						if (asset_code === 2) {
							self.show_library('photo', _selected_job_id, _selected_job_reference_number, _selected_company_id, _type, asset_path, asset_code);
						} else {
							self.show_library('video', _selected_job_id, _selected_job_reference_number, _selected_company_id, _type, asset_path, asset_code);
						}
					}
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _header_title_btn_click_event_for_media_photo_and_video');
				return;
			}
		}
		function _header_title_btn_click_event_for_media_audio(asset_path, asset_code) {
			try {
				var new_win = Titanium.UI.createWindow({
					type : _type,
					url : self.get_file_path('url', 'job/base/job_create_audio.js'),
					job_id : _selected_job_id,
					job_reference_number : _selected_job_reference_number,
					asset_id : 0,
					asset_type_code : asset_code,
					asset_type_path : asset_path
				});
				Titanium.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _header_title_btn_click_event_for_media_audio');
				return;
			}
		}
		function _header_title_btn_click_event_for_media_material(asset_path, asset_code) {
			try {
				var optionDialog = Ti.UI.createOptionDialog({
					options : (self.is_ipad()) ? [ 'Add Item', 'Add File', 'Cancel', '' ] : [ 'Add Item', 'Add File', 'Cancel' ],
					buttonNames : [ 'Cancel' ],
					destructive : 0,
					cancel : 2,
					title : L('message_select_option')
				});
				optionDialog.show();
				optionDialog.addEventListener('click', function(evt) {
					switch (evt.index){
						case 0://
							var material_file_win = Ti.UI.createWindow({
								url : self.get_file_path('url', 'job/base/job_material_item.js'),
								type : _type,
								job_id : _selected_job_id,
								job_assigned_item_id : 0,
								job_library_item_id : 0,
								action_for_material : 'add_job_material'
							});
							Titanium.UI.currentTab.open(material_file_win, {
								animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
							});
							break;
						case 1:
							var optionDialog2 = Ti.UI.createOptionDialog({
								options : (self.is_ipad()) ? [ 'From Camera', 'From Library', 'Add Audio', 'Cancel', '' ] : [ 'From Camera', 'From Library', 'Add Audio', 'Cancel' ],
								buttonNames : [ 'Cancel' ],
								destructive : 0,
								cancel : 3,
								title : L('message_select_option')
							});
							optionDialog2.show();
							optionDialog2.addEventListener('click', function(e) {
								if (e.index === 0) {
									self.show_camera('', _selected_job_id, _selected_job_reference_number, _selected_company_id, _type, asset_path, asset_code);
								}
								if (e.index === 1) {
									self.show_library('', _selected_job_id, _selected_job_reference_number, _selected_company_id, _type, asset_path, asset_code);
								}
								if (e.index === 2) {
									_show_audio(asset_code, asset_path);
								}
							});
							break;
					}
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _header_title_btn_click_event_for_media_material');
				return;
			}
		}
		function _header_title_btn_click_event_for_invoice(header_title_btn_url) {
			try {
				if (_client_id <= 0) {
					self.show_message('Please select client before generate ' + (_type == 'job' ? 'invoice.' : 'quote.'));
					return;
				}
				if (!Ti.Network.online) {
					self.show_message(L('message_offline'), L('message_unable_to_connect'));
					return;
				}
				if (_check_if_exist_change()) {
					var option_dialog = null;
					option_dialog = Ti.UI.createOptionDialog({
						options : (self.is_ipad()) ? [ 'YES', 'Cancel', '' ] : [ 'YES', 'Cancel' ],
						buttonNames : [ 'Cancel' ],
						destructive : 0,
						cancel : 1,
						title : 'Application will save ' + _type + ' to office before generate ' + (_type == 'job' ? 'invoice.' : 'quote.')
					});
					option_dialog.show();
					option_dialog.addEventListener('click', function(e) {
						switch (e.index){
							case 0:
								if (!self.check_if_exist_upload_file_failure(_selected_job_id, _type, _selected_company_id)) {
									_exist_upload_file_failure = false;
								}
								if (_exist_upload_file_failure) {
									var db = Titanium.Database.open(self.get_db_name());
									db.execute('UPDATE my_updating_records SET upload_status=0,failure_times=0 WHERE relation_id=? and type=? and upload_status in (1,3)', _selected_job_id, _type);
									db.close();
									Ti.App.fireEvent('async_save_data');
								}
								var temp_result = _save_to_office(false);
								if ((temp_result == undefined) || (temp_result == null) || temp_result) {
									var option_dialog2 = null;
									option_dialog2 = Ti.UI.createOptionDialog({
										options : (self.is_ipad()) ? [ 'Create ' + (_type == 'job' ? 'Invoice' : 'Quote') + ' With Data', 'Create Manual ' + (_type == 'job' ? 'Invoice' : 'Quote'), 'Cancel', '' ] : [ 'Create ' + (_type == 'job' ? 'Invoice' : 'Quote') + ' With Data', 'Create Manual ' + (_type == 'job' ? 'Invoice' : 'Quote'), 'Cancel' ],
										buttonNames : [ 'Cancel' ],
										destructive : 0,
										cancel : 2,
										title : 'Do you want to create ' + (_type == 'job' ? 'invoice' : 'quote') + '?'
									});
									option_dialog2.show();
									option_dialog2.addEventListener('click', function(e) {
										switch (e.index){
											case 0:
											case 1:
												var new_win = Ti.UI.createWindow({
													url : header_title_btn_url,
													invoice_type : (e.index) ? 'manual' : 'auto',
													type : _type,
													job_id : _selected_job_id,
													job_reference_number : _selected_job_reference_number,
													job_invoice_id : 0,
													job_invoice_reference_number : 0,
													client_id : _client_id,
													action_for_invoice : 'add_job_invoice'
												});
												Titanium.UI.currentTab.open(new_win, {
													animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
												});
												break;
										}
									});
								}
								break;
						}
					});
				} else {
					var option_dialog2 = null;
					option_dialog2 = Ti.UI.createOptionDialog({
						options : (self.is_ipad()) ? [ 'Create ' + (_type == 'job' ? 'Invoice' : 'Quote') + ' With Data', 'Create Manual ' + (_type == 'job' ? 'Invoice' : 'Quote'), 'Cancel', '' ] : [ 'Create ' + (_type == 'job' ? 'Invoice' : 'Quote') + ' With Data', 'Create Manual ' + (_type == 'job' ? 'Invoice' : 'Quote'), 'Cancel' ],
						buttonNames : [ 'Cancel' ],
						destructive : 0,
						cancel : 2,
						title : 'Do you want to create ' + (_type == 'job' ? 'invoice' : 'quote') + '?'
					});
					option_dialog2.show();
					option_dialog2.addEventListener('click', function(e) {
						switch (e.index){
							case 0:
							case 1:
								var new_win = Ti.UI.createWindow({
									url : header_title_btn_url,
									invoice_type : (e.index) ? 'manual' : 'auto',
									type : _type,
									job_id : _selected_job_id,
									job_reference_number : _selected_job_reference_number,
									job_invoice_id : 0,
									job_invoice_reference_number : 0,
									client_id : _client_id,
									action_for_invoice : 'add_job_invoice'
								});
								Titanium.UI.currentTab.open(new_win, {
									animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
								});
								break;
						}
					});
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _header_title_btn_click_event_for_invoice');
				return;
			}
		}
		function _header_title_btn_click_event_for_custom_report(header_title_btn_url) {
			try {
				if ((_selected_job_id <= 0) || (_selected_job_id > 1000000000)) {
					if (!Ti.Network.online) {
						self.show_message(L('message_offline'), L('message_unable_to_connect'));
						return;
					}
					var option_dialog = null;
					option_dialog = Ti.UI.createOptionDialog({
						options : (self.is_ipad()) ? [ 'YES', 'Cancel', '' ] : [ 'YES', 'Cancel' ],
						buttonNames : [ 'Cancel' ],
						destructive : 0,
						cancel : 1,
						title : 'Application will save ' + _type + ' to office before generate report.'
					});
					option_dialog.show();
					option_dialog.addEventListener('click', function(e) {
						switch (e.index){
							case 0:
								if (!self.check_if_exist_upload_file_failure(_selected_job_id, _type, _selected_company_id)) {
									_exist_upload_file_failure = false;
								}
								if (_exist_upload_file_failure) {
									var db = Titanium.Database.open(self.get_db_name());
									db.execute('UPDATE my_updating_records SET upload_status=0,failure_times=0 WHERE relation_id=? and type=? and upload_status in (1,3)', _selected_job_id, _type);
									db.close();
									Ti.App.fireEvent('async_save_data');
								}
								var temp_result = _save_to_office(false);
								if ((temp_result == undefined) || (temp_result == null) || temp_result) {
									_display_report_type_list();
								}
								break;
							case 1:
								break;
						}
					});
				} else {
					_display_report_type_list();
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _header_title_btn_click_event_for_custom_report');
				return;
			}
		}
		function _header_title_btn_click_event_for_purchase_order(header_title_btn_url) {
			try {
				if ((_selected_job_id <= 0) || (_selected_job_id > 1000000000)) {
					if (!Ti.Network.online) {
						self.show_message(L('message_offline'), L('message_unable_to_connect'));
						return;
					}
					var option_dialog = null;
					option_dialog = Ti.UI.createOptionDialog({
						options : (self.is_ipad()) ? [ 'YES', 'Cancel', '' ] : [ 'YES', 'Cancel' ],
						buttonNames : [ 'Cancel' ],
						destructive : 0,
						cancel : 1,
						title : 'Application will save ' + _type + ' to office before generate purchase order.'
					});
					option_dialog.show();
					option_dialog.addEventListener('click', function(e) {
						switch (e.index){
							case 0:
								if (!self.check_if_exist_upload_file_failure(_selected_job_id, _type, _selected_company_id)) {
									_exist_upload_file_failure = false;
								}
								if (_exist_upload_file_failure) {
									var db = Titanium.Database.open(self.get_db_name());
									db.execute('UPDATE my_updating_records SET upload_status=0,failure_times=0 WHERE relation_id=? and type=? and upload_status in (1,3)', _selected_job_id, _type);
									db.close();
									Ti.App.fireEvent('async_save_data');
								}
								var temp_result = _save_to_office(false);
								if ((temp_result == undefined) || (temp_result == null) || temp_result) {
									var new_win = Ti.UI.createWindow({
										url : self.get_file_path('url', 'job/base/job_purchase_order.js'),
										action_for_purchase_order_item : 'add_purchase_order_item',
										type : _type,
										job_id : _selected_job_id,
										purchase_order_id : 0,
										purchase_order_item_id : 0,
										from_win : 'job_index_view'// parent
									// window
									// name
									});
									Titanium.UI.currentTab.open(new_win, {
										animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
									});
								}
								break;
							case 1:
								break;
						}
					});
				} else {
					var new_win = Ti.UI.createWindow({
						url : self.get_file_path('url', 'job/base/job_purchase_order.js'),
						type : _type,
						job_id : _selected_job_id,
						job_reference_number : _selected_job_reference_number,
						purchase_order_id : 0,
						purchase_order_reference_number : 0,
						from_win : 'job_index_view'// parent
					// window
					// name
					});
					Titanium.UI.currentTab.open(new_win, {
						animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
					});
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _header_title_btn_click_event_for_purchase_order');
				return;
			}
		}
		function _display_report_type_list() {
			try {
				var custom_report_id_array = [];
				var custom_report_title_array = [];
				var db = Titanium.Database.open(self.get_db_name());
				var rows = db.execute('SELECT * FROM my_custom_report where status_code=1 and company_id=? order by id desc', _selected_company_id);
				if (rows != null) {
					while (rows.isValidRow()) {
						custom_report_id_array.push(rows.fieldByName('id'));
						custom_report_title_array.push(rows.fieldByName('title'));
						rows.next();
					}
					rows.close();
				}
				db.close();
				
				if (custom_report_id_array.length > 0) {
					custom_report_id_array.push(-1);
					custom_report_title_array.push('Cancel');
					if (self.is_ipad()) {
						custom_report_title_array.push('');
					}
					var optionDialog = Ti.UI.createOptionDialog({
						options : custom_report_title_array,
						buttonNames : [ 'Cancel' ],
						destructive : 0,
						cancel : (self.is_ipad() ? custom_report_title_array.length - 2 : custom_report_title_array.length - 1),
						title : 'Please select custom report type.'
					});
					optionDialog.show();
					optionDialog.addEventListener('click', function(evt) {
						if ((evt.index === custom_report_id_array.length - 1)) {
						} else {
							var custom_report_win = Ti.UI.createWindow({
								url : self.get_file_path('url', 'job/base/job_custom_report.js'),
								type : _type,
								job_id : _selected_job_id,
								job_reference_number : _selected_job_reference_number,
								job_custom_report_data_id : 0,
								custom_report_id : custom_report_id_array[evt.index],
								custom_report_title : custom_report_title_array[evt.index],
								manager_user_id : _selected_user_id,
								action_for_custom_report : 'add_job_custom_report'
							});
							Titanium.UI.currentTab.open(custom_report_win, {
								animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
							});
						}
					});
				} else {
					self.show_message('Application can\'t find valid report type.');
					return;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _display_report_type_list');
				return;
			}
		}
		/**
		 * init detail section,e.g title,status and client
		 */
		function _init_detail_section(db) {
			try {
				var is_exist_valid_job_detail = false;
				var order_reference_number = "";
				var rows = db.execute('SELECT * from my_' + _type + ' WHERE id=?', _selected_job_id);
				if ((rows.getRowCount() > 0) && (rows.fieldByName('title') != null) && (self.trim(rows.fieldByName('title')) != '')) {
					is_exist_valid_job_detail = true;
					var client_id = rows.fieldByName('client_id');
					var title_text = rows.fieldByName('title');
					order_reference_number = rows.fieldByName('order_reference');
					var job_id = rows.fieldByName('id');
					var job_status_code = rows.fieldByName(_type + '_status_code');
					var params = {
						sub_number : rows.fieldByName('sub_number'),
						unit_number : rows.fieldByName('unit_number'),
						street_number : rows.fieldByName('street_number'),
						street : rows.fieldByName('street'),
						street_type : rows.fieldByName('street_type'),
						street_type_id : rows.fieldByName('locality_street_type_id'),
						state_id : rows.fieldByName('locality_state_id'),
						suburb : rows.fieldByName('suburb'),
						postcode : rows.fieldByName('postcode'),
						suburb_id : rows.fieldByName('locality_suburb_id')
					};
				}
				rows.close();
				_create_separate_header_view();
				_init_row_header_view('job_detail', self.ucfirst(_type) + ' Detail', is_exist_valid_job_detail, self.get_file_path('url', 'job/edit/job_detail.js'));
				if (is_exist_valid_job_detail) {
					// add client row
					_setup_client_row_for_detail_section(db, client_id);
					
					// add title row
					_setup_title_row_for_detail_section(db, title_text);
					
					if (order_reference_number != undefined && order_reference_number != null && order_reference_number != "") {
						// add order reference row
						_setup_order_reference_row_for_detail_section(db, order_reference_number);
					}
					
					// add status row
					_setup_status_row_for_detail_section(db, job_status_code);
					
					// add status reason row
					_setup_status_reason_row_for_detail_section(db, job_id, job_status_code);
					
					// add address row
					_setup_address_row_for_detail_section(db, params);
				}
				_section_no++;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_detail_section');
				return;
			}
		}
		function _init_description_section(db) {
			try {
				var is_exist_valid_job_description = false;
				var rows = db.execute('SELECT * from my_' + _type + ' WHERE id=?', _selected_job_id);
				if ((rows.getRowCount() > 0) && (self.trim(rows.fieldByName('description')).length > 0)) {
					is_exist_valid_job_description = true;
				}
				rows.close();
				_create_separate_header_view();
				_init_row_header_view('job_description', 'Description', is_exist_valid_job_description, self.get_file_path('url', 'job/base/job_description.js'));
				_setup_row_for_detail_description_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_description_section');
				return;
			}
		}
		function _init_booking_note_section(db) {
			try {
				var is_exist_valid_job_booking_note = false;
				var rows = db.execute('SELECT * from my_' + _type + ' WHERE id=?', _selected_job_id);
				if ((rows.getRowCount() > 0) && (self.trim(rows.fieldByName('booking_note')).length > 0)) {
					is_exist_valid_job_booking_note = true;
				}
				rows.close();
				_init_row_header_view('job_booking_note', 'Booking Note', is_exist_valid_job_booking_note, self.get_file_path('url', 'job/base/job_booking_note.js'));
				_setup_row_for_detail_booking_note_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_booking_note_section');
				return;
			}
		}
		function _init_client_contact_section(db) {
			try {
				_create_separate_header_view();
				_init_row_header_view('client_contact', 'Client Contacts', false, self.get_file_path('url', 'job/base/job_client_contact.js'));
				_setup_row_for_client_contact_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_client_contact_section');
				return;
			}
		}
		function _init_site_contact_section(db) {
			try {
				_init_row_header_view('site_contact', 'Site Contacts', false, self.get_file_path('url', 'job/base/job_site_contact.js'));
				_setup_row_for_site_contact_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_site_contact_section');
				return;
			}
		}
		function _init_user_section(db) {
			try {
				_init_row_header_view('assigned_user', 'Assigned Users', false, self.get_file_path('url', 'job/base/job_assigned_user.js'));
				_setup_row_for_user_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_user_section');
				return;
			}
		}
		function _init_note_section(db) {
			try {
				_init_row_header_view('notes', 'Notes', false, self.get_file_path('url', 'job/base/job_note.js'));
				_setup_row_for_note_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_note_section');
				return;
			}
		}
		function _init_history_section(db) {
			try {
				_create_separate_header_view();
				_init_row_header_view('history', 'History', false, '');
				_setup_row_for_contact_history_section(db);
				// status history
				_setup_row_for_status_history_section(db);
				// site history
				_setup_row_for_site_history_section(db);
				// operation log
				_setup_row_for_operation_history_section(db);
				_section_no++;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_history_section');
				return;
			}
		}
		function _init_media_section(db) {
			try {
				var rows = null;
				_create_separate_header_view();
				rows = db.execute('SELECT * FROM my_' + _type + '_asset_type_code WHERE code>0 order by code asc');
				if (rows.getRowCount() > 0) {
					while (rows.isValidRow()) {
						if (rows.fieldByName('code') != 6) {
							_setup_row_controls_for_media_section(rows);
							_setup_row_for_media_section(rows, db);
							_section_no++;
						} else {
							if (_can_view_materials) {
								_setup_row_controls_for_media_section(rows);
								_setup_row_for_media_section(rows, db);
								_section_no++;
							}
						}
						rows.next();
					}
				}
				rows.close();
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_media_section');
				return;
			}
		}
		function _init_invoice_section(db) {
			try {
				_create_separate_header_view();
				_init_row_header_view('invoices', (_type == 'job' ? 'Invoices' : 'Quotes'), false, self.get_file_path('url', 'job/base/job_invoice.js'));
				_setup_row_for_invoice_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_invoice_section');
				return;
			}
		}
		function _init_invoice_locksmith_section(db) {
			try {
				_init_row_header_view('invoices_locksmith', (_type == 'job' ? 'Job Dockets' : 'Quote Dockets'), false, self.get_file_path('url', 'job/base/job_invoice_locksmith.js'));
				_setup_row_for_invoice_locksmith_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_invoice_locksmith_section');
				return;
			}
		}
		function _init_custom_report_section(db) {
			try {
				_init_row_header_view('custom_report', 'Reports', false, self.get_file_path('url', 'job/base/job_custom_report.js'));
				_setup_row_for_custom_report_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_custom_report_section');
				return;
			}
		}
		function _init_purchase_order_section(db) {
			try {
				_init_row_header_view('purchase_order', 'Purchase Orders', false, self.get_file_path('url', 'job/base/job_purchase_order.js'));
				_setup_row_for_purchase_order_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_purchase_order_section');
				return;
			}
		}
		function _init_start_job_section(db) {
			try {
				_get_start_job_escpsed_time(db);
				_create_separate_header_view();
				_init_row_header_view('start_job', 'Start ' + self.ucfirst(_type), false, '');
				_setup_row_for_start_job_btn_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_start_job_section');
				return;
			}
		}
		function _init_quote_accepted_section(db) {
			try {
				_init_row_header_view('quote_accepted', 'Quote Accepted', false, '');
				_setup_row_for_quote_accepted_btn_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_quote_accepted_section');
				return;
			}
		}
		function _init_create_unrelated_job_section(db) {
			try {
				_init_row_header_view('unrelated_job', 'Create Unrelated ' + self.ucfirst(_type), false, '');
				_setup_row_for_create_unrelated_job_btn_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_create_unrelated_job_section');
				return;
			}
		}
		function _init_a_separate_line() {
			try {
				var header_view = Ti.UI.createView({
					left : 10,
					right : 10,
					height : 2,
					width : self.screen_width
				});
				var header_line = Ti.UI.createLabel({
					left : (self.is_ipad()) ? 50 : 10,
					right : (self.is_ipad()) ? 50 : 10,
					height : 2,
					width : (self.is_ipad()) ? self.screen_width - 100 : self.screen_width - 20,
					backgroundColor : self.section_header_title_font_color
				});
				if (self.is_ios_7_plus()) {
					header_view.height = 10;
					header_line.left = 10;
					header_line.right = 10;
					header_line.width = self.screen_width - 20;
				}
				header_view.add(header_line);
				
				var section = Ti.UI.createTableViewSection({
					headerView : header_view
				});
				self.data[_section_no] = section;
				_section_no++;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_a_separate_line');
				return;
			}
		}
		/**
		 * display some sections (e.g detail, description ...)
		 */
		function _display_detail_section(db) {
			try {
				if ((self.data[_section_no].rows != null) && (self.data[_section_no].rows.length > 0)) {
					for ( var i = 0, j = self.data[_section_no].rows.length; i < j; i++) {
						self.data[_section_no].remove(self.data[_section_no].rows[0]);
					}
				}
				var is_exist_valid_job_detail = false;
				var order_reference_number = "";
				// job detail section
				var rows = db.execute('SELECT * from my_' + _type + ' WHERE id=?', _selected_job_id);
				var row_count = rows.getRowCount();
				if ((row_count > 0) && (rows.fieldByName('title') != null) && (self.trim(rows.fieldByName('title')) != '')) {
					is_exist_valid_job_detail = true;
					var client_id = rows.fieldByName('client_id');
					var title_text = rows.fieldByName('title');
					order_reference_number = rows.fieldByName('order_reference');
					var job_id = rows.fieldByName('id');
					var job_status_code = rows.fieldByName(_type + '_status_code');
					var params = {
						sub_number : rows.fieldByName('sub_number'),
						unit_number : rows.fieldByName('unit_number'),
						street_number : rows.fieldByName('street_number'),
						street : rows.fieldByName('street'),
						street_type : rows.fieldByName('street_type'),
						street_type_id : rows.fieldByName('locality_street_type_id'),
						state_id : rows.fieldByName('locality_state_id'),
						suburb : rows.fieldByName('suburb'),
						postcode : rows.fieldByName('postcode'),
						suburb_id : rows.fieldByName('locality_suburb_id')
					};
				}
				rows.close();
				
				if (is_exist_valid_job_detail) {
					self.data[_section_no].headerView.children[1].title = 'Edit';
					// add client row
					_setup_client_row_for_detail_section(db, client_id);
					// add title row
					_setup_title_row_for_detail_section(db, title_text);
					if (order_reference_number != undefined && order_reference_number != null && order_reference_number != "") {
						// add order reference row
						_setup_order_reference_row_for_detail_section(db, order_reference_number);
					}
					// add status row
					_selected_job_status_code = job_status_code;
					_setup_status_row_for_detail_section(db, job_status_code);
					
					// add status reason row
					_setup_status_reason_row_for_detail_section(db, job_id, job_status_code);
					// add address row
					_setup_address_row_for_detail_section(db, params);
				}
				_section_no++;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _display_detail_section');
				return;
			}
		}
		function _display_description_section(db) {
			try {
				if ((self.data[_section_no].rows != null) && (self.data[_section_no].rows.length > 0)) {
					for ( var i = 0, j = self.data[_section_no].rows.length; i < j; i++) {
						self.data[_section_no].remove(self.data[_section_no].rows[0]);
					}
				}
				_setup_row_for_detail_description_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _display_description_section');
				return;
			}
		}
		function _display_booking_note_section(db) {
			try {
				if ((self.data[_section_no].rows != null) && (self.data[_section_no].rows.length > 0)) {
					for ( var i = 0, j = self.data[_section_no].rows.length; i < j; i++) {
						self.data[_section_no].remove(self.data[_section_no].rows[0]);
					}
				}
				_setup_row_for_detail_booking_note_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _display_booking_note_section');
				return;
			}
		}
		function _display_client_contact_section(db) {
			try {
				// client contact section
				if ((self.data[_section_no].rows != null) && (self.data[_section_no].rows.length > 0)) {
					for ( var i = 0, j = self.data[_section_no].rows.length; i < j; i++) {
						self.data[_section_no].remove(self.data[_section_no].rows[0]);
					}
				}
				_setup_row_for_client_contact_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _display_client_contact_section');
				return;
			}
		}
		function _display_site_contact_section(db) {
			try {
				// client contact section
				if ((self.data[_section_no].rows != null) && (self.data[_section_no].rows.length > 0)) {
					for ( var i = 0, j = self.data[_section_no].rows.length; i < j; i++) {
						self.data[_section_no].remove(self.data[_section_no].rows[0]);
					}
				}
				_setup_row_for_site_contact_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _display_site_contact_section');
				return;
			}
		}
		function _display_user_section(db) {
			try {
				// client contact section
				if ((self.data[_section_no].rows != null) && (self.data[_section_no].rows.length > 0)) {
					for ( var i = 0, j = self.data[_section_no].rows.length; i < j; i++) {
						self.data[_section_no].remove(self.data[_section_no].rows[0]);
					}
				}
				_setup_row_for_user_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _display_user_section');
				return;
			}
		}
		function _display_note_section(db) {
			try {
				if ((self.data[_section_no].rows != null) && (self.data[_section_no].rows.length > 0)) {
					for ( var i = 0, j = self.data[_section_no].rows.length; i < j; i++) {
						self.data[_section_no].remove(self.data[_section_no].rows[0]);
					}
				}
				_setup_row_for_note_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _display_note_section');
				return;
			}
		}
		function _display_history_section(db) {
			try {
				if ((self.data[_section_no].rows != null) && (self.data[_section_no].rows.length > 0)) {
					for ( var i = 0, j = self.data[_section_no].rows.length; i < j; i++) {
						self.data[_section_no].remove(self.data[_section_no].rows[0]);
					}
				}
				// contact history
				_setup_row_for_contact_history_section(db);
				// status history
				_setup_row_for_status_history_section(db);
				// site history
				_setup_row_for_site_history_section(db);
				// operation log
				_setup_row_for_operation_history_section(db);
				_section_no++;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _display_history_section');
				return;
			}
		}
		function _display_media_section(db) {
			try {
				var rows = null;
				rows = db.execute('SELECT * FROM my_' + _type + '_asset_type_code WHERE code>0 order by code asc');
				if (rows.getRowCount() > 0) {
					while (rows.isValidRow()) {
						if (rows.fieldByName('code') != 6) {
							if ((self.data[_section_no].rows != null) && (self.data[_section_no].rows.length > 0)) {
								for ( var i = 0, j = self.data[_section_no].rows.length; i < j; i++) {
									self.data[_section_no].remove(self.data[_section_no].rows[0]);
								}
							}
							_setup_row_for_media_section(rows, db);
							_section_no++;
						} else {
							if (_can_view_materials) {
								if ((self.data[_section_no].rows != null) && (self.data[_section_no].rows.length > 0)) {
									for ( var i = 0, j = self.data[_section_no].rows.length; i < j; i++) {
										self.data[_section_no].remove(self.data[_section_no].rows[0]);
									}
								}
								_setup_row_for_media_section(rows, db);
								_section_no++;
							}
						}
						rows.next();
					}
				}
				rows.close();
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _display_media_section');
				return;
			}
		}
		function _display_invoice_section(db) {
			try {
				if ((self.data[_section_no].rows != null) && (self.data[_section_no].rows.length > 0)) {
					for ( var i = 0, j = self.data[_section_no].rows.length; i < j; i++) {
						self.data[_section_no].remove(self.data[_section_no].rows[0]);
					}
				}
				_setup_row_for_invoice_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _display_invoice_section');
				return;
			}
		}
		function _display_invoice_locksmith_section(db) {
			try {
				if ((self.data[_section_no].rows != null) && (self.data[_section_no].rows.length > 0)) {
					for ( var i = 0, j = self.data[_section_no].rows.length; i < j; i++) {
						self.data[_section_no].remove(self.data[_section_no].rows[0]);
					}
				}
				_setup_row_for_invoice_locksmith_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _display_invoice_locksmith_section');
				return;
			}
		}
		function _display_custom_report_section(db) {
			try {
				if ((self.data[_section_no].rows != null) && (self.data[_section_no].rows.length > 0)) {
					for ( var i = 0, j = self.data[_section_no].rows.length; i < j; i++) {
						self.data[_section_no].remove(self.data[_section_no].rows[0]);
					}
				}
				_setup_row_for_custom_report_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _display_custom_report_section');
				return;
			}
		}
		function _display_purchase_order_section(db) {
			try {
				if ((self.data[_section_no].rows != null) && (self.data[_section_no].rows.length > 0)) {
					for ( var i = 0, j = self.data[_section_no].rows.length; i < j; i++) {
						self.data[_section_no].remove(self.data[_section_no].rows[0]);
					}
				}
				_setup_row_for_purchase_order_section(db);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _display_purchase_order_section');
				return;
			}
		}
		/**
		 * setup row for _init_detail_section and
		 * _display_detail_section
		 */
		function _setup_client_row_for_detail_section(db, client_id) {
			try {
				var client_name = 'N/A';
				var client_reference_number = 0;
				var client_type_code = 1;
				if ((client_id != undefined) && (client_id != null)) {
					var client_rows = db.execute('SELECT * FROM my_client WHERE id=?', client_id);
					if ((client_rows.getRowCount() > 0) && (client_rows.isValidRow())) {
						client_name = client_rows.fieldByName('client_name');
						client_reference_number = client_rows.fieldByName('reference_number');
						client_type_code = client_rows.fieldByName('client_type_code');
					}
					client_rows.close();
				}
				var row = Ti.UI.createTableViewRow({
					filter_class : 'detail_client',
					className : 'detail_client',
					header : 'Detail',
					height : 'auto',
					hasChild : true,
					client_id : client_id,
					client_reference_number : client_reference_number,
					client_type_code : client_type_code
				});
				if (client_name != 'N/A') {
					var view_btn = Ti.UI.createButton({
						name : 'view_btn',
						backgroundImage : self.get_file_path('image', 'BUTT_grn_off.png'),
						color : '#fff',
						font : {
							fontSize : _header_view_font_size - 2,
							fontWeight : 'bold'
						},
						title : 'View',
						textAlign : 'center',
						style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
						left : 10,
						top : 5,
						width : _header_view_button_width - 5,
						height : _header_view_button_height
					});
					row.add(view_btn);
				}
				var title_label = Ti.UI.createLabel({
					top : 5,
					left : (client_name != 'N/A') ? 10 + _header_view_button_width : 10,
					width : self.screen_width - 50,
					text : client_name,
					height : 20,
					font : {
						fontSize : self.normal_font_size,
						fontWeight : self.font_weight
					}
				});
				row.add(title_label);
				var description_label = Ti.UI.createLabel({
					bottom : 3,
					left : (client_name != 'N/A') ? 10 + _header_view_button_width : 10,
					width : self.screen_width - 50,
					text : '[client]',
					height : 20,
					font : {
						fontSize : self.small_font_size
					}
				});
				row.add(description_label);
				self.data[_section_no].add(row);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_client_row_for_detail_section');
				return;
			}
		}
		function _setup_title_row_for_detail_section(db, title_text) {
			try {
				if ((title_text === undefined) || (title_text === null)) {
					title_text = '';
				}
				var row = Ti.UI.createTableViewRow({
					filter_class : 'detail_title',
					className : 'detail_title',
					height : 'auto',
					hasChild : true
				});
				var title_label = Ti.UI.createLabel({
					top : 5,
					left : 10,
					width : self.screen_width - 50,
					text : title_text,
					height : 20,
					font : {
						fontSize : self.normal_font_size,
						fontWeight : self.font_weight
					}
				});
				row.add(title_label);
				var description_label = Ti.UI.createLabel({
					bottom : 3,
					left : 10,
					width : self.screen_width - 50,
					text : '[title]',
					height : 20,
					font : {
						fontSize : self.small_font_size
					}
				});
				row.add(description_label);
				self.data[_section_no].add(row);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_title_row_for_detail_section');
				return;
			}
		}
		function _setup_order_reference_row_for_detail_section(db, order_reference_text) {
			try {
				if ((order_reference_text === undefined) || (order_reference_text === null)) {
					order_reference_text = '';
				}
				var row = Ti.UI.createTableViewRow({
					filter_class : 'detail_order_reference',
					className : 'detail_order_reference',
					height : 'auto',
					hasChild : true
				});
				var order_reference_number_label = Ti.UI.createLabel({
					top : 5,
					left : 10,
					width : self.screen_width - 50,
					text : order_reference_text,
					height : 20,
					font : {
						fontSize : self.normal_font_size,
						fontWeight : self.font_weight
					}
				});
				row.add(order_reference_number_label);
				var description_label = Ti.UI.createLabel({
					bottom : 3,
					left : 10,
					width : self.screen_width - 50,
					text : '[Order Ref#]',
					height : 20,
					font : {
						fontSize : self.small_font_size
					}
				});
				row.add(description_label);
				self.data[_section_no].add(row);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - init');
				return;
			}
		}
		function _setup_status_row_for_detail_section(db, status_code) {
			try {
				var status_text = '';
				if ((status_code != undefined) && (status_code != null)) {
					
					var status_rows = db.execute('SELECT * FROM my_' + _type + '_status_code WHERE code=?', status_code);
					if ((status_rows.getRowCount() > 0) && (status_rows.isValidRow())) {
						status_text = status_rows.fieldByName('name');
					}
					status_rows.close();
				}
				var row = Ti.UI.createTableViewRow({
					filter_class : 'detail_status',
					className : 'detail_status',
					height : 'auto',
					hasChild : true,
					object_id : status_code
				});
				var status_title_label = Ti.UI.createLabel({
					top : 5,
					left : 10,
					width : self.screen_width - 50,
					text : status_text,
					height : 20,
					font : {
						fontSize : self.normal_font_size,
						fontWeight : self.font_weight
					}
				});
				row.add(status_title_label);
				var status_description_label = Ti.UI.createLabel({
					bottom : 3,
					left : 10,
					width : self.screen_width - 50,
					text : '[status]',
					height : 20,
					font : {
						fontSize : self.small_font_size
					}
				});
				row.add(status_description_label);
				self.data[_section_no].add(row);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_status_row_for_detail_section');
				return;
			}
		}
		function _setup_status_reason_row_for_detail_section(db, job_id, job_status_code) {
			try {
				var status_reason_text = '';
				var status_log_id = 0;
				if ((job_id != undefined) && (job_id != null)) {
					var status_reason_rows = db.execute('SELECT * FROM my_' + _type + '_status_log WHERE ' + _type + '_id=? and ' + _type + '_status_code=? order by id desc limit 1', job_id, job_status_code);
					if ((status_reason_rows.getRowCount() > 0) && (status_reason_rows.isValidRow())) {
						status_reason_text = status_reason_rows.fieldByName('reason');
						status_log_id = status_reason_rows.fieldByName('id');
					}
					status_reason_rows.close();
				}
				if ((status_reason_text != '') && (self.trim(status_reason_text) != '')) {
					var row = Ti.UI.createTableViewRow({
						filter_class : 'detail_status_reason',
						className : 'detail_status_reason',
						height : 'auto',
						hasChild : true,
						job_status_log_id : status_log_id
					});
					var status_reason_title_label = Ti.UI.createLabel({
						top : 5,
						left : 10,
						width : self.screen_width - 50,
						text : status_reason_text,
						height : 20,
						font : {
							fontSize : self.normal_font_size,
							fontWeight : self.font_weight
						}
					});
					row.add(status_reason_title_label);
					var status_reason_description_label = Ti.UI.createLabel({
						bottom : 3,
						left : 10,
						width : self.screen_width - 50,
						text : '[status reason]',
						height : 20,
						font : {
							fontSize : self.small_font_size
						}
					});
					row.add(status_reason_description_label);
					self.data[_section_no].add(row);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_status_reason_row_for_detail_section');
				return;
			}
		}
		function _setup_address_row_for_detail_section(db, params) {
			try {
				var state = '';
				if ((params != undefined) && (params != null)) {
					var state_rows = db.execute('SELECT * FROM my_locality_state WHERE id=?', params.state_id);
					if ((state_rows.getRowCount() > 0) && (state_rows.isValidRow())) {
						state = state_rows.fieldByName('state');
					}
					state_rows.close();
				}
				var suburb = ((params != undefined) && (params != null)) ? params.suburb : '';
				suburb = (suburb === null) ? '' : suburb;
				
				var postcode = ((params != undefined) && (params != null)) ? params.postcode : '';
				postcode = (postcode === null) ? '' : postcode;
				
				var sub_number = ((params != undefined) && (params != null)) ? params.sub_number : '';
				var unit = ((params != undefined) && (params != null)) ? params.unit_number : '';
				if (unit === null) {
					unit = '';
				}
				var street_no = ((params != undefined) && (params != null)) ? params.street_number : '';
				street_no = (street_no === null) ? '' : street_no;
				var street_type_id = ((params != undefined) && (params != null)) ? params.street_type_id : '';
				var street_type = ((params != undefined) && (params != null)) ? params.street_type : '';
				street_type = (street_type === null) ? '' : street_type;
				var street = ((params != undefined) && (params != null)) ? params.street : '';
				street = (street === null) ? '' : self.trim(street);
				street = self.display_correct_street(street, street_type);
				var address = '';
				if (street === '') {
					if(suburb == ''){
						address = '(Blank)';
					}else{
						address = suburb+(postcode === '' ? '' : ' ' + postcode);						
					}
				} else {
					if ((sub_number === '') || (sub_number === null)) {
						if ((unit === '') || (unit === null)) {
							address = street_no + ' ' + street + ', ' + suburb + (postcode === '' ? '' : ' ' + postcode);
						} else {
							address = unit + '/' + street_no + ' ' + street + ', ' + suburb + (postcode === '' ? '' : ' ' + postcode);
						}
					} else {
						if ((unit === '') || (unit === null)) {
							address = street_no + ' ' + street + ', ' + suburb + (postcode === '' ? '' : ' ' + postcode);
						} else {
							address = unit + '-' + sub_number + '/' + street_no + ' ' + street + ', ' + suburb + (postcode === '' ? '' : ' ' + postcode);
						}
					}
				}
				if (address != '') {
					address = address.toUpperCase();
				}
				var state_id = ((params != undefined) && (params != null)) ? params.state_id : 0;
				var suburb_id = ((params != undefined) && (params != null)) ? params.suburb_id : 0;
				var row = Ti.UI.createTableViewRow({
					filter_class : 'detail_address',
					className : 'detail_address',
					height : 'auto',
					hasChild : true,
					sub_number : sub_number,
					unit_number : unit,
					street_number : street_no,
					street : street,
					suburb : suburb,
					postcode : postcode,
					state : state,
					stateID : ((state_id === null) || (state_id === '')) ? 0 : state_id,
					street_type : street_type,
					street_type_id : street_type_id,
					suburb_id : ((suburb_id === null) || (suburb_id === '')) ? 0 : suburb_id
				});
				var address_title_label = Ti.UI.createLabel({
					top : 5,
					left : 10,
					width : self.screen_width - 50,
					text : address,
					height : 20,
					font : {
						fontSize : self.normal_font_size,
						fontWeight : self.font_weight
					}
				});
				row.add(address_title_label);
				var address_description_label = Ti.UI.createLabel({
					bottom : 3,
					left : 10,
					width : self.screen_width - 50,
					text : '[address]',
					height : 20,
					font : {
						fontSize : self.small_font_size
					}
				});
				row.add(address_description_label);
				self.data[_section_no].add(row);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_address_row_for_detail_section');
				return;
			}
		}
		/**
		 * setup row for _init_description_section and
		 * _display_description_section
		 */
		function _setup_row_for_detail_description_section(db) {
			try {
				var description_text = '';
				// job detail section
				var rows = db.execute('SELECT * from my_' + _type + ' WHERE id=?', _selected_job_id);
				description_text = rows.fieldByName('description');
				rows.close();
				if ((description_text != null) && (self.trim(description_text).length > 0)) {
					self.data[_section_no].headerView.children[1].title = 'Edit';
					var row = Ti.UI.createTableViewRow({
						filter_class : 'detail_description',
						className : 'detail_description',
						header : 'Description',
						height : 'auto',
						hasChild : true
					});
					var description_label = Ti.UI.createLabel({
						left : 10,
						top : 5,
						bottom : 5,
						width : (self.is_ipad()) ? self.screen_width - 100 : self.screen_width - 40,
						height : 'auto',
						text : description_text,
						font : {
							fontSize : _header_view_font_size,
							fontWeight : 'bold'
						}
					});
					row.add(description_label);
					self.data[_section_no].add(row);
				}
				_section_no++;
				
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_detail_description_section');
				return;
			}
		}
		/**
		 * setup row for _init_booking_note_section and
		 * _display_booking_note_section
		 */
		function _setup_row_for_detail_booking_note_section(db) {
			try {
				// job detail section
				var rows = db.execute('SELECT * from my_' + _type + ' WHERE id=?', _selected_job_id);
				var booking_note_text = rows.fieldByName('booking_note');
				rows.close();
				if ((booking_note_text != null) && (self.trim(booking_note_text).length > 0)) {
					self.data[_section_no].headerView.children[1].title = 'Edit';
					var row = Ti.UI.createTableViewRow({
						filter_class : 'detail_booking_note',
						className : 'detail_booking_note',
						header : 'Booking Note',
						height : 'auto',
						hasChild : true
					});
					var booking_note_label = Ti.UI.createLabel({
						left : 10,
						top : 5,
						bottom : 5,
						width : (self.is_ipad()) ? self.screen_width - 100 : self.screen_width - 40,
						height : 'auto',
						text : booking_note_text,
						font : {
							fontSize : _header_view_font_size,
							fontWeight : 'bold'
						}
					});
					row.add(booking_note_label);
					self.data[_section_no].add(row);
				}
				_section_no++;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_detail_booking_note_section');
				return;
			}
		}
		/**
		 * setup row for _init_client_contact_section and
		 * _display_client_contact_section
		 */
		function _setup_row_for_client_contact_section(db) {
			try {
				var rows = db.execute('SELECT * from my_' + _type + ' WHERE id=?', _selected_job_id);
				if ((rows.getRowCount() > 0) && (rows.isValidRow())) {
					if ((rows.fieldByName('client_id') != undefined) && (rows.fieldByName('client_id') != null)) {
						_client_id = rows.fieldByName('client_id');
					}
				}
				rows = db.execute('SELECT a.*,my_client_contact.position,my_client_contact.first_name,my_client_contact.last_name FROM my_' + _type + '_client_contact as a' + ' left join my_client_contact  on (my_client_contact.id = a.client_contact_id)' + ' WHERE a.' + _type + '_id=? and a.status_code=1 and my_client_contact.status_code=1', _selected_job_id);
				var client_contact_count = rows.getRowCount();
				var i = 0;
				if (client_contact_count <= 1) {
					if (rows.getRowCount() > 0) {
						while (rows.isValidRow()) {
							var row = Ti.UI.createTableViewRow({
								filter_class : 'client_contact',
								className : 'client_contact_' + i,
								height : 'auto',
								hasChild : true,
								object_id : rows.fieldByName('client_contact_id'),
								job_client_contact_id : rows.fieldByName('id')
							});
							var edit_btn = Ti.UI.createButton({
								name : 'view_btn',
								backgroundImage : self.get_file_path('image', 'BUTT_grn_off.png'),
								color : '#fff',
								font : {
									fontSize : _header_view_font_size - 2,
									fontWeight : 'bold'
								},
								title : 'View',
								textAlign : 'center',
								style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
								left : 10,
								width : _header_view_button_width - 5,
								height : _header_view_button_height
							});
							if ((rows.fieldByName('position') != null) && (self.trim(rows.fieldByName('position')) != '')) {
								edit_btn.top = 5;
							}
							row.add(edit_btn);
							
							if ((rows.fieldByName('position') != null) && (self.trim(rows.fieldByName('position')) != '')) {
								var title_label = Ti.UI.createLabel({
									top : 5,
									left : 10 + _header_view_button_width,
									width : self.screen_width - 100,
									text : rows.fieldByName('first_name') + ' ' + rows.fieldByName('last_name'),
									height : 20,
									font : {
										fontSize : self.normal_font_size,
										fontWeight : self.font_weight
									}
								});
								row.add(title_label);
								var position_label = Ti.UI.createLabel({
									top : 25 + 5,
									left : 10,
									width : self.screen_width - 100,
									text : '[' + rows.fieldByName('position') + ']',
									height : 20,
									font : {
										fontSize : self.small_font_size
									}
								});
								row.add(position_label);
							} else {
								title_label = Ti.UI.createLabel({
									left : 10 + _header_view_button_width,
									width : self.screen_width - 100,
									text : rows.fieldByName('first_name') + ' ' + rows.fieldByName('last_name'),
									height : 20,
									font : {
										fontSize : self.normal_font_size,
										fontWeight : self.font_weight
									}
								});
								row.add(title_label);
							}
							self.data[_section_no].add(row);
							i++;
							rows.next();
						}
					}
				} else {
					row = Ti.UI.createTableViewRow({
						filter_class : 'client_contact',
						className : 'client_contact_' + 100,
						height : 'auto',
						hasChild : true,
						width : 180,
						left : 10,
						title : 'Client Contacts'
					});
					var client_contact_label = Ti.UI.createLabel({
						right : 5,
						backgroundColor : self.table_view_row_number_label_background_color,
						color : '#fff',
						width : 30,
						height : 20,
						textAlign : 'center',
						text : client_contact_count,
						borderRadius : 8
					});
					row.add(client_contact_label);
					self.data[_section_no].add(row);
				}
				rows.close();
				_section_no++;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_client_contact_section');
				return;
			}
		}
		/**
		 * setup row for _init_site_contact_section and
		 * _display_site_contact_section
		 */
		function _setup_row_for_site_contact_section(db) {
			try {
				var rows = db.execute('SELECT * FROM my_' + _type + '_site_contact WHERE ' + _type + '_id=? and status_code=1', _selected_job_id);
				var i = 0;
				var site_contact_count = rows.getRowCount();
				if (site_contact_count <= 1) {
					if (rows.getRowCount() > 0) {
						while (rows.isValidRow()) {
							var row = Ti.UI.createTableViewRow({
								filter_class : 'site_contact',
								className : 'site_contact_' + i,
								height : 'auto',
								hasChild : true,
								object_id : rows.fieldByName('id')
							});
							if (rows.fieldByName('is_primary_contact')) {
								var edit_btn = Ti.UI.createButton({
									name : 'view_btn',
									backgroundImage : self.get_file_path('image', 'BUTT_grn_off.png'),
									color : '#fff',
									font : {
										fontSize : _header_view_font_size - 2,
										fontWeight : 'bold'
									},
									title : 'View',
									textAlign : 'center',
									style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
									left : 10,
									top : 5,
									width : _header_view_button_width - 5,
									height : _header_view_button_height
								});
								row.add(edit_btn);
								var title_label = Ti.UI.createLabel({
									top : 5,
									left : 10 + _header_view_button_width,
									width : self.screen_width - 100,
									text : rows.fieldByName('first_name') + ' ' + rows.fieldByName('last_name'),
									height : 20,
									font : {
										fontSize : self.normal_font_size,
										fontWeight : self.font_weight
									}
								});
								row.add(title_label);
								var position_label = Ti.UI.createLabel({
									top : 25 + 5,
									left : 10,
									width : self.screen_width - 100,
									text : '[Primary Contact]',
									height : 20,
									font : {
										fontSize : self.small_font_size
									}
								});
								row.add(position_label);
							} else {
								edit_btn = Ti.UI.createButton({
									name : 'view_btn',
									backgroundImage : self.get_file_path('image', 'BUTT_grn_off.png'),
									color : '#fff',
									font : {
										fontSize : _header_view_font_size - 2,
										fontWeight : 'bold'
									},
									title : 'View',
									textAlign : 'center',
									style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
									left : 10,
									width : _header_view_button_width - 5,
									height : _header_view_button_height
								});
								row.add(edit_btn);
								title_label = Ti.UI.createLabel({
									left : 10 + _header_view_button_width,
									width : self.screen_width - 100,
									text : rows.fieldByName('first_name') + ' ' + rows.fieldByName('last_name'),
									height : 20,
									font : {
										fontSize : self.normal_font_size,
										fontWeight : self.font_weight
									}
								});
								row.add(title_label);
							}
							
							self.data[_section_no].add(row);
							i++;
							rows.next();
						}
					}
				} else {
					row = Ti.UI.createTableViewRow({
						filter_class : 'site_contact',
						className : 'site_contact' + 100,
						height : 'auto',
						hasChild : true,
						width : 180,
						left : 10,
						title : 'Site Contacts'
					});
					var site_contact_label = Ti.UI.createLabel({
						right : 5,
						backgroundColor : self.table_view_row_number_label_background_color,
						color : '#fff',
						width : 30,
						height : 20,
						textAlign : 'center',
						text : site_contact_count,
						borderRadius : 8
					});
					row.add(site_contact_label);
					self.data[_section_no].add(row);
				}
				rows.close();
				_section_no++;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_site_contact_section');
				return;
			}
		}
		/**
		 * setup row for _init_assigned_user_section and
		 * _display_assigned_user_section
		 */
		function _setup_row_for_user_section(db) {
			try {
				var rows = db.execute('SELECT a.*,my_manager_user.display_name,my_job_assigned_user_code.name FROM my_' + _type + '_assigned_user as a' + ' left join my_manager_user on (my_manager_user.id = a.manager_user_id) ' + ' left join my_job_assigned_user_code on (my_job_assigned_user_code.code = a.job_assigned_user_code)' + ' WHERE a.' + _type + '_id=? and a.status_code=1', _selected_job_id);
				var i = 0;
				var user_count = rows.getRowCount();
				if (user_count <= 1) {
					if (rows.getRowCount() > 0) {
						while (rows.isValidRow()) {
							var row = Ti.UI.createTableViewRow({
								filter_class : 'manager_user',
								className : 'manager_user_' + i,
								height : 'auto',
								hasChild : true,
								object_id : rows.fieldByName('id'),
								manager_user_id : rows.fieldByName('manager_user_id'),
								job_assigned_user_code : rows.fieldByName('job_assigned_user_code'),
								assigned_from : rows.fieldByName('assigned_from'),
								assigned_to : rows.fieldByName('assigned_to')
							});
							var edit_btn = Ti.UI.createButton({
								name : 'view_btn',
								backgroundImage : self.get_file_path('image', 'BUTT_grn_off.png'),
								color : '#fff',
								font : {
									fontSize : _header_view_font_size - 2,
									fontWeight : 'bold'
								},
								title : 'View',
								textAlign : 'center',
								style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
								left : 10,
								top : 5,
								width : _header_view_button_width - 5,
								height : _header_view_button_height
							});
							row.add(edit_btn);
							var title_label = Ti.UI.createLabel({
								top : 5,
								left : 10 + _header_view_button_width,
								width : self.screen_width - 100 - _header_view_button_width,
								text : rows.fieldByName('display_name'),
								height : 20,
								font : {
									fontSize : self.normal_font_size,
									fontWeight : self.font_weight
								}
							});
							row.add(title_label);
							var position_label = Ti.UI.createLabel({
								top : 25 + 5,
								left : 10,
								width : self.screen_width - 100,
								text : '[' + rows.fieldByName('name') + ']',
								height : 20,
								font : {
									fontSize : self.small_font_size
								}
							});
							row.add(position_label);
							var assigned_from_label = Ti.UI.createLabel({
								top : 45 + 5,
								left : 10,
								width : self.screen_width - 100,
								text : 'From : ' + (((rows.fieldByName('assigned_from') === null) || (rows.fieldByName('assigned_from') === '')) ? 'N/A' : self.display_time_and_date(self.get_seconds_value_by_time_string(rows.fieldByName('assigned_from')))),
								height : 20,
								font : {
									fontSize : self.small_font_size
								}
							});
							row.add(assigned_from_label);
							var assigned_to_label = Ti.UI.createLabel({
								top : 65 + 5,
								left : 10,
								width : self.screen_width - 100,
								text : 'To     : ' + (((rows.fieldByName('assigned_to') === null) || (rows.fieldByName('assigned_to') === '')) ? 'N/A' : self.display_time_and_date(self.get_seconds_value_by_time_string(rows.fieldByName('assigned_to')))),
								height : 20,
								font : {
									fontSize : self.small_font_size
								}
							});
							row.add(assigned_to_label);
							
							self.data[_section_no].add(row);
							i++;
							rows.next();
						}
					}
				} else {
					row = Ti.UI.createTableViewRow({
						filter_class : 'manager_user',
						className : 'manager_user_' + 100,
						height : 'auto',
						hasChild : true,
						width : 150,
						title : 'Assigned Users',
						left : 10,
						right : _header_view_button_width + 10
					});
					var user_label = Ti.UI.createLabel({
						right : 5,
						backgroundColor : self.table_view_row_number_label_background_color,
						color : '#fff',
						width : 30,
						height : 20,
						textAlign : 'center',
						text : user_count,
						borderRadius : 8
					});
					row.add(user_label);
					self.data[_section_no].add(row);
				}
				rows.close();
				_section_no++;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_user_section');
				return;
			}
		}
		/**
		 * setup row for _init_note_section and _display_note_section
		 */
		function _setup_row_for_note_section(db) {
			try {
				var rows = db.execute('SELECT * FROM my_' + _type + '_note WHERE ' + _type + '_id=? and status_code=1 and ' + _type + '_note_type_code!=2', _selected_job_id);
				var notes_count = rows.getRowCount();
				rows.close();
				if (notes_count > 0) {
					var row = Ti.UI.createTableViewRow({
						filter_class : 'note',
						title : 'Notes',
						className : 'note',
						height : 'auto',
						hasChild : true,
						view_url : 'job/edit/job_notes.js'
					});
					var notes_label = Ti.UI.createLabel({
						right : 5,
						backgroundColor : self.table_view_row_number_label_background_color,
						color : '#fff',
						width : 30,
						height : 20,
						textAlign : 'center',
						text : notes_count,
						borderRadius : 8
					});
					row.add(notes_label);
					self.data[_section_no].add(row);
				}
				_section_no++;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_note_section');
				return;
			}
		}
		/**
		 * setup row for _init_history_section
		 */
		function _setup_row_for_contact_history_section(db) {
			try {
				// contact history
				var contacts_history_count = 0;
				var rows = db.execute('SELECT * FROM my_' + _type + '_contact_history WHERE status_code=1 and ' + _type + '_id=?', _selected_job_id);
				contacts_history_count = rows.getRowCount();
				rows.close();
				var row = Ti.UI.createTableViewRow({
					filter_class : 'contact_history',
					title : 'Contact History',
					className : 'contact_history',
					height : 'auto',
					hasChild : true,
					view_url : 'job/edit/job_history.js'
				});
				var contact_history_log_label = Ti.UI.createLabel({
					right : 5,
					backgroundColor : self.table_view_row_number_label_background_color,
					color : '#fff',
					width : 30,
					height : 20,
					textAlign : 'center',
					text : contacts_history_count,
					borderRadius : 8
				});
				row.add(contact_history_log_label);
				self.data[_section_no].add(row);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_contact_history_section');
				return;
			}
		}
		function _setup_row_for_status_history_section(db) {
			try {
				var status_history_count = 0;
				var rows = db.execute('SELECT * FROM my_' + _type + '_status_log WHERE status_code=1 and ' + _type + '_id=?', _selected_job_id);
				status_history_count = rows.getRowCount();
				rows.close();
				var row = Ti.UI.createTableViewRow({
					filter_class : 'status_history',
					title : 'Status History',
					className : 'status_history',
					height : 'auto',
					hasChild : true,
					view_url : 'job/edit/job_status_log.js'
				});
				var status_history_log_label = Ti.UI.createLabel({
					right : 5,
					backgroundColor : self.table_view_row_number_label_background_color,
					color : '#fff',
					width : 30,
					height : 20,
					textAlign : 'center',
					text : status_history_count,
					borderRadius : 8
				});
				row.add(status_history_log_label);
				self.data[_section_no].add(row);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_status_history_section');
				return;
			}
		}
		function _setup_row_for_site_history_section(db) {
			try {
				var site_history_count = 0;
				var street = '';
				var street_number = '';
				var suburb = '';
				var state_id = 0;
				var street_type_id = 0;
				var selected_job_obj = db.execute('SELECT * FROM my_' + _type + ' WHERE id=? and company_id=?', _selected_job_id, _selected_company_id);
				if ((selected_job_obj.getRowCount() > 0) && (selected_job_obj.isValidRow())) {
					street_type_id = selected_job_obj.fieldByName('locality_street_type_id');
					state_id = selected_job_obj.fieldByName('locality_state_id');
					street_number = self.trim(selected_job_obj.fieldByName('street_number'));
					street = self.trim(selected_job_obj.fieldByName('street'));
					street = self.replace(street, '\"', '');
					suburb = self.trim(selected_job_obj.fieldByName('suburb'));
					suburb = self.replace(suburb, '\"', '');
				}
				if ((street === undefined) || (street === null) || (street === '')) {
					site_history_count = 0;
				} else {
					site_history_count += _get_job_list_with_assigned_from_is_null_for_site_history(db, street_number, street, suburb, state_id, street_type_id);
					site_history_count += _get_job_list_with_assigned_from_is_not_null_for_site_history(db, street_number, street, suburb, state_id, street_type_id);
				}
				var row = Ti.UI.createTableViewRow({
					filter_class : 'site_history',
					title : 'Site History',
					className : 'site_history',
					height : 'auto',
					hasChild : true,
					view_url : 'job/edit/job_site_history.js'
				});
				var site_history_log_label = Ti.UI.createLabel({
					right : 5,
					backgroundColor : self.table_view_row_number_label_background_color,
					color : '#fff',
					width : 30,
					height : 20,
					textAlign : 'center',
					text : site_history_count,
					borderRadius : 8
				});
				row.add(site_history_log_label);
				self.data[_section_no].add(row);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_site_history_section');
				return;
			}
		}
		/**
		 * setup row for _init_invoice_section and
		 * _display_invoice_section
		 */
		function _setup_row_for_invoice_section(db) {
			try {
				var rows = db.execute('SELECT * FROM my_' + _type + '_invoice WHERE ' + _type + '_id=? and status_code=1', _selected_job_id);
				var invoices_count = rows.getRowCount();
				rows.close();
				if (invoices_count > 0) {
					var row = Ti.UI.createTableViewRow({
						filter_class : 'invoice',
						title : (_type == 'job' ? 'Invoices' : 'Quotes'),
						className : 'invoice',
						height : 'auto',
						hasChild : true,
						view_url : 'job/edit/job_invoices.js'
					});
					var invoices_label = Ti.UI.createLabel({
						right : 5,
						backgroundColor : self.table_view_row_number_label_background_color,
						color : '#fff',
						width : 30,
						height : 20,
						textAlign : 'center',
						text : invoices_count,
						borderRadius : 8
					});
					row.add(invoices_label);
					self.data[_section_no].add(row);
				}
				_section_no++;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_invoice_section');
				return;
			}
		}
		function _setup_row_for_invoice_locksmith_section(db) {
			try {
				var rows = db.execute('SELECT * FROM my_' + _type + '_invoice_locksmith WHERE ' + _type + '_id=? and status_code=1', _selected_job_id);
				var invoices_count = rows.getRowCount();
				Ti.API.info('invoices_count:' + invoices_count + ',_selected_job_id:' + _selected_job_id);
				rows.close();
				if (invoices_count > 0) {
					var row = Ti.UI.createTableViewRow({
						filter_class : 'invoice_locksmith',
						title : (_type == 'job' ? 'Job Dockets' : 'Quote Dockets'),
						className : 'invoice_locksmith',
						height : 'auto',
						hasChild : true,
						view_url : 'job/edit/job_invoices_locksmith.js'
					});
					var invoices_label = Ti.UI.createLabel({
						right : 5,
						backgroundColor : self.table_view_row_number_label_background_color,
						color : '#fff',
						width : 30,
						height : 20,
						textAlign : 'center',
						text : invoices_count,
						borderRadius : 8
					});
					row.add(invoices_label);
					self.data[_section_no].add(row);
				}
				_section_no++;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_invoice_locksmith_section');
				return;
			}
		}
		/**
		 * setup row for _init_custom_report_section and
		 * _display_custom_report_section
		 */
		function _setup_row_for_custom_report_section(db) {
			try {
				var rows = db.execute('SELECT * FROM my_' + _type + '_custom_report_data WHERE ' + _type + '_id=? and status_code=1', _selected_job_id);
				var custom_report_count = rows.getRowCount();
				rows.close();
				if (custom_report_count > 0) {
					var row = Ti.UI.createTableViewRow({
						filter_class : 'custom_report',
						title : 'Reports',
						className : 'custom_report',
						height : 'auto',
						hasChild : true,
						view_url : 'job/edit/job_custom_reports.js'
					});
					var invoices_label = Ti.UI.createLabel({
						right : 5,
						backgroundColor : self.table_view_row_number_label_background_color,
						color : '#fff',
						width : 30,
						height : 20,
						textAlign : 'center',
						text : custom_report_count,
						borderRadius : 8
					});
					row.add(invoices_label);
					self.data[_section_no].add(row);
				}
				_section_no++;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_custom_report_section');
				return;
			}
		}
		
		/**
		 * setup row for purchase order
		 */
		function _setup_row_for_purchase_order_section(db) {
			try {
				var rows = db.execute('SELECT * FROM my_purchase_order WHERE ' + _type + '_id=? and status_code=1', _selected_job_id);
				var purchase_order_count = rows.getRowCount();
				rows.close();
				if (purchase_order_count > 0) {
					var row = Ti.UI.createTableViewRow({
						filter_class : 'purchase_order',
						title : 'Purchase Orders',
						className : 'purchase_order',
						height : 'auto',
						hasChild : true,
						view_url : 'job/edit/job_purchase_orders.js'
					});
					var purchase_order_count_label = Ti.UI.createLabel({
						right : 5,
						backgroundColor : self.table_view_row_number_label_background_color,
						color : '#fff',
						width : 30,
						height : 20,
						textAlign : 'center',
						text : purchase_order_count,
						borderRadius : 8
					});
					row.add(purchase_order_count_label);
					self.data[_section_no].add(row);
				}
				_section_no++;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_purchase_order_section');
				return;
			}
		}
		/**
		 * get job list or quote list which's assigen_from is null
		 */
		function _get_job_list_with_assigned_from_is_null_for_site_history(db, street_number, street, suburb, state_id, street_type_id) {
			try {
				var count_num = 0;
				var extra_where_condition = _setup_query_address_string(street_number, street, suburb, state_id, street_type_id);
				if (extra_where_condition === 'false') {
					return count_num;
				}
				var sql = '';
				var sql_params = null;
				sql_params = {
					is_task : false,
					is_calendar : false,// in calendar
					// or in filter
					is_scheduled : false,// query
					// assigned_from
					// is not null
					is_check_changed : false,// check
					// changed
					// field
					// or
					// not
					is_check_self_job : false,// only
					// check
					// current
					// user's
					// job
					order_by : 'my_job.reference_number desc',
					extra_where_condition : extra_where_condition,
					type : 'job',
					user_id : _selected_user_id,
					company_id : _selected_company_id
				};
				sql = self.setup_sql_query_for_display_job_list(sql_params);
				
				if (sql != '') {
					var rows = db.execute(sql);
					if ((rows != null) && (rows.getRowCount() > 0)) {
						while (rows.isValidRow()) {
							if ((rows.fieldByName('assigned_from') === null) || (rows.fieldByName('assigned_from') === '')) {
								count_num++;
							}
							rows.next();
						}
					}
					rows.close();
				}
				return count_num;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _get_job_list_with_assigned_from_is_null_for_site_history');
				return 0;
			}
		}
		/**
		 * get job list or quote list with assigned from is not null
		 */
		function _get_job_list_with_assigned_from_is_not_null_for_site_history(db, street_number, street, suburb, state_id, street_type_id) {
			try {
				var count_num = 0;
				var extra_where_condition = _setup_query_address_string(street_number, street, suburb, state_id, street_type_id);
				if (extra_where_condition === 'false') {
					return count_num;
				}
				var sql = '';
				var sql_params = {
					is_task : false,
					is_calendar : false,// in calendar
					// or in filter
					is_scheduled : true,// query
					// assigned_from
					// is not null
					is_check_changed : false,// check
					// changed
					// field
					// or
					// not
					is_check_self_job : false,// only
					// check
					// current
					// user's
					// job
					order_by : 'assigned_from desc',
					extra_left_join_condition : '',
					extra_where_condition : extra_where_condition,
					type : 'job',
					user_id : _selected_user_id,
					company_id : _selected_company_id
				};
				sql = self.setup_sql_query_for_display_job_list(sql_params);
				
				if (sql != '') {
					var rows = db.execute(sql);
					if (rows.getRowCount() > 0) {
						while (rows.isValidRow()) {
							if ((rows.fieldByName('assigned_from') != null) && (rows.fieldByName('assigned_from') != '')) {
								count_num++;
							}
							rows.next();
						}
					}
					rows.close();
				}
				return count_num;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _get_job_list_with_assigned_from_is_not_null_for_site_history');
				return 0;
			}
		}
		/**
		 * setup query address string
		 */
		function _setup_query_address_string(street_number, street, suburb, state_id, street_type_id) {
			try {
				var extra_where_condition = '';
				if ((street != undefined) && (street != null) && (street != '')) {
					var streetTypeName = '';
					var streetTypeId = 0;
					var newStreet = '';
					if (self.trim(street) != '') {
						var streetArray = self.trim(street).split(' ');
						if (streetArray.length > 1) {
							streetTypeName = streetArray[streetArray.length - 1];
							streetTypeId = self.return_street_type_id(streetTypeName);
						}
						if (streetTypeId > 0) {
							for ( var i = 0, j = streetArray.length - 1; i < j; i++) {
								if (i > 0) {
									newStreet += ' ';
								}
								newStreet += streetArray[i];
							}
						} else {
							streetTypeId = (street_type_id == null) ? 0 : street_type_id;
						}
					}
					
					if (newStreet != '') {
						extra_where_condition += '(upper(my_job.street)  = upper(\"' + newStreet + '\") or (upper(my_job.street)  = upper(\"' + newStreet + ' ' + streetTypeName + '\")))';
					} else {
						extra_where_condition += '(upper(my_job.street)  = upper(\"' + street + '\") or (upper(my_job.street)  = upper(\"' + street + ' ' + streetTypeName + '\")))';
					}
					if (streetTypeId > 0) {
						extra_where_condition += ' and my_job.locality_street_type_id=' + streetTypeId;
					}
					if ((street_number != undefined) && (street_number != null) && (street_number != '')) {
						extra_where_condition += ' and upper(my_job.street_number) = upper(\"' + street_number + '\")';
					}
					if ((suburb != undefined) && (suburb != null) && (suburb != '')) {
						extra_where_condition += ' and upper(my_job.suburb) =upper(\"' + suburb + '\")';
					}
					if ((state_id != undefined) && (state_id != null) && (state_id != '')) {
						extra_where_condition += ' and my_job.locality_state_id = ' + state_id;
					} else {
						extra_where_condition += ' and my_job.locality_state_id = 0';
					}
					if (_type === 'job') {
						extra_where_condition += ' and my_job.id not in (' + _selected_job_id + ')';
					} else {
					}
					return extra_where_condition;
				} else {
					return 'false';
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_query_address_string');
				return 'false';
			}
		}
		
		function _setup_row_for_operation_history_section(db) {
			try {
				var operation_history_count = 0;
				var rows = db.execute('SELECT * FROM my_' + _type + '_operation_log WHERE status_code=1 and ' + _type + '_id=?', _selected_job_id);
				operation_history_count = rows.getRowCount();
				rows.close();
				var row = Ti.UI.createTableViewRow({
					filter_class : 'operation_history',
					title : 'Operation History',
					className : 'operation_history',
					height : 'auto',
					hasChild : true,
					view_url : 'job/edit/job_operation.js'
				});
				var operation_history_log_label = Ti.UI.createLabel({
					right : 5,
					backgroundColor : self.table_view_row_number_label_background_color,
					color : '#fff',
					width : 30,
					height : 20,
					textAlign : 'center',
					text : operation_history_count,
					borderRadius : 8
				});
				row.add(operation_history_log_label);
				self.data[_section_no].add(row);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_operation_history_section');
				return;
			}
		}
		/**
		 * setup row for _init_media_section and _display_media_section
		 */
		function _setup_row_controls_for_media_section(rows) {
			try {
				var header_view = Ti.UI.createView({
					height : _header_view_height,
					width : self.screen_width
				});
				if (self.is_ios_7_plus()) {
					header_view.backgroundColor = self.set_table_view_header_backgroundcolor;
				}
				var header_title_label = Ti.UI.createLabel({
					font : {
						fontSize : _header_view_font_size,
						fontWeight : 'bold'
					},
					text : (rows.fieldByName('name').toLowerCase() === 'document') ? 'Other Media' : rows.fieldByName('name'),
					textAlign : 'left',
					top : 0,
					left : (self.is_ipad()) ? 50 : 10,
					width : 200,
					height : _header_view_title_height,
					color : self.section_header_title_font_color,
					shadowColor : self.section_header_title_shadow_color,
					shadowOffset : self.section_header_title_shadow_offset
				});
				if (self.is_ios_7_plus()) {
					header_title_label.left = 10;
				}
				header_view.add(header_title_label);
				
				var header_title_btn = Ti.UI.createButton({
					backgroundImage : self.get_file_path('image', 'btn_grey.png'),
					color : '#fff',
					font : {
						fontSize : _header_view_font_size,
						fontWeight : 'bold'
					},
					title : 'Add',
					textAlign : 'center',
					style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
					top : 0,
					right : (self.is_ipad()) ? 50 : 10,
					width : _header_view_button_width,
					height : _header_view_button_height
				});
				if (self.is_ios_7_plus()) {
					header_title_btn.right = 10;
				}
				header_view.add(header_title_btn);
				
				var section = Ti.UI.createTableViewSection({
					headerView : header_view
				});
				self.data[_section_no] = section;
				
				header_title_btn.addEventListener('click', function() {
					var temp_asset_code = rows.fieldByName('code');
					var temp_asset_path = rows.fieldByName('path');
					return function() {
						switch (temp_asset_code){
							case 1:// work order
							case 5:// documents
								_header_title_btn_click_event_for_media_work_order_and_document(temp_asset_path, temp_asset_code);
								break;
							case 2:// photo
							case 4:// video
								_header_title_btn_click_event_for_media_photo_and_video(temp_asset_path, temp_asset_code);
								break;
							case 3:// audio
								_header_title_btn_click_event_for_media_audio(temp_asset_path, temp_asset_code);
								break;
							case 6:// materials
								_header_title_btn_click_event_for_media_material(temp_asset_path, temp_asset_code);
								break;
							default:
						}
					};
				}());
				
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_controls_for_media_section');
				return;
			}
		}
		function _setup_row_for_media_section(rows, db) {
			try {
				if (rows.fieldByName('code') != 6) {
					var asset_rows = db.execute('SELECT * FROM my_' + _type + '_asset WHERE ' + _type + '_asset_type_code=? and status_code=1 and ' + _type + '_id=?', rows.fieldByName('code'), _selected_job_id);
					if (asset_rows.getRowCount() > 0) {
						var row = Ti.UI.createTableViewRow({
							filter_class : 'media',
							className : (rows.fieldByName('name')).toLowerCase(),
							title : 'Files',
							height : 'auto',
							hasChild : true,
							asset_type_code : rows.fieldByName('code'),
							asset_type_path : rows.fieldByName('path'),
							asset_type_name : rows.fieldByName('name'),
							view_url : 'job/edit/job_media.js'
						});
						
						var asset_number_label = Ti.UI.createLabel({
							right : 5,
							backgroundColor : self.table_view_row_number_label_background_color,
							color : '#fff',
							width : 30,
							height : 20,
							textAlign : 'center',
							text : asset_rows.getRowCount(),
							borderRadius : 8
						});
						row.add(asset_number_label);
						self.data[_section_no].add(row);
					}
					asset_rows.close();
				} else {
					asset_rows = db.execute('SELECT * FROM my_' + _type + '_assigned_item WHERE status_code=1 and ' + _type + '_id=?', _selected_job_id);
					var material_files = db.execute('SELECT * FROM my_' + _type + '_asset WHERE ' + _type + '_asset_type_code=? and status_code=1 and ' + _type + '_id=?', rows.fieldByName('code'), _selected_job_id);
					if ((asset_rows.getRowCount() > 0) || (material_files.getRowCount() > 0)) {
						row = Ti.UI.createTableViewRow({
							filter_class : 'media',
							className : (rows.fieldByName('name')).toLowerCase(),
							title : 'Items/Files',
							height : self.default_table_view_row_height,
							hasChild : true,
							asset_type_code : rows.fieldByName('code'),
							asset_type_path : rows.fieldByName('path'),
							asset_type_name : rows.fieldByName('name'),
							view_url : 'job/edit/job_materials.js'
						});
						
						asset_number_label = Ti.UI.createLabel({
							right : 45,
							backgroundColor : self.table_view_row_number_label_background_color,
							color : '#fff',
							width : 30,
							height : 20,
							textAlign : 'center',
							text : asset_rows.getRowCount(),
							borderRadius : 8
						});
						row.add(asset_number_label);
						var line_label = Ti.UI.createLabel({
							right : 25,
							width : 30,
							height : 20,
							textAlign : 'center',
							text : '/',
							borderRadius : 8
						});
						row.add(line_label);
						var material_files_number_label = Ti.UI.createLabel({
							right : 5,
							backgroundColor : self.table_view_row_number_label_background_color,
							color : '#fff',
							width : 30,
							height : 20,
							textAlign : 'center',
							text : material_files.getRowCount(),
							borderRadius : 8
						});
						row.add(material_files_number_label);
						self.data[_section_no].add(row);
					}
					asset_rows.close();
					material_files.close();
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_media_section');
				return;
			}
		}
		/**
		 * setup row for _init_start_btn_section and
		 * init_quote_accepted_section
		 */
		function _setup_row_for_start_job_btn_section(db) {
			try {
				
				var row = Ti.UI.createTableViewRow({
					filter_class : 'start_job',
					className : 'start_job',
					height : 'auto'
				});
				
				self.start_btn = Ti.UI.createButton({
					title : (_is_start_flag) ? 'Stop' : 'Start',
					backgroundImage : (_is_start_flag) ? self.get_file_path('image', 'BUTT_red_off.png') : self.get_file_path('image', 'BUTT_grn_off.png'),
					textAlign : 'center',
					height : 60,
					width : self.screen_width - 50,
					top : 10,
					bottom : 10
				});
				row.add(self.start_btn);
				
				// self.time_label = Ti.UI.createLabel({
				// text:'Elapsed
				// '+((_start_btn_timer_hours<10)?'0'+_start_btn_timer_hours:_start_btn_timer_hours)+':'+((_start_btn_timer_minutes<10)?'0'+_start_btn_timer_minutes:_start_btn_timer_minutes)+':'+((_start_btn_timer_seconds<10)?'0'+_start_btn_timer_seconds:_start_btn_timer_seconds),
				// textAlign:'center',
				// width:150,
				// right:15
				// });
				// row.add(self.time_label);
				if (_is_start_flag) {
					_start_btn_timer = setInterval(_start_job_record_timer, 1000);
				} else {
					if (_start_btn_timer != null) {
						clearInterval(_start_btn_timer);
						_start_btn_timer = null;
					}
				}
				self.data[_section_no].add(row);
				_section_no++;
				self.start_btn.addEventListener('click', function() {
					_start_stop_job();
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_start_job_btn_section');
				return;
			}
		}
		function _setup_row_for_quote_accepted_btn_section(db) {
			try {
				var row = Ti.UI.createTableViewRow({
					filter_class : 'quote_accepted',
					className : 'quote_accepted',
					height : 'auto'
				});
				
				self.quote_accepted_btn = Ti.UI.createButton({
					title : 'Quote Accepted',
					backgroundImage : self.get_file_path('image', 'BUTT_grn_off.png'),
					textAlign : 'center',
					height : 60,
					width : 150,
					top : 10,
					bottom : 10
				});
				row.add(self.quote_accepted_btn);
				self.data[_section_no].add(row);
				_section_no++;
				self.quote_accepted_btn.addEventListener('click', function() {
					_quote_accepted_event();
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_quote_accepted_btn_section');
				return;
			}
		}
		/**
		 * setup row for create unrelated job or quote
		 */
		function _setup_row_for_create_unrelated_job_btn_section(db) {
			try {
				var row = Ti.UI.createTableViewRow({
					filter_class : 'create_unrelated_job',
					className : 'create_unrelated_job',
					height : 'auto'
				});
				
				self.create_unrelated_job_btn = Ti.UI.createButton({
					title : 'Create Unrelated ' + self.ucfirst(_type),
					backgroundImage : self.get_file_path('image', 'BUTT_grn_off.png'),
					textAlign : 'center',
					height : 60,
					width : self.screen_width - 50,
					top : 10,
					bottom : 10
				});
				row.add(self.create_unrelated_job_btn);
				self.data[_section_no].add(row);
				_section_no++;
				self.create_unrelated_job_btn.addEventListener('click', function() {
					_create_unrelated_job_event();
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_row_for_create_unrelated_job_btn_section');
				return;
			}
		}
		/**
		 * quote accepted event
		 */
		function _quote_accepted_event() {
			try {
				if (Ti.Network.online) {
					var is_make_changed = _check_if_exist_change();
					if (is_make_changed) {
						self.show_message(L('message_quote_accepted_in_job_index_view'));
						return;
					} else {
						self.display_indicator('Quote Accepted ...', true);
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
									
									var temp_result = JSON.parse(this.responseText);
									
									if ((temp_result.error != undefined) && (temp_result.error.length > 0)) {
										self.hide_indicator();
										var error_string = '';
										for ( var i = 0, j = temp_result.error.length; i < j; i++) {
											if (i == j) {
												error_string += temp_result.error[i];
											} else {
												error_string += temp_result.error[i] + '\n';
											}
										}
										self.show_message(error_string);
										return;
									} else {
										self.hide_indicator();
										if (this.responseText === '[]') {
											self.show_message(L('message_quote_accepted_failure_in_job_index_view'));
											return;
										} else {
											self.refresh_job_and_relative_tables(this.responseText, 'all');
											var new_job_id_from_quote = temp_result.Job[0].id;
											var new_job_reference_number_from_quote = temp_result.Job[0].reference_number;
											var new_job_status_code_from_quote = temp_result.Job[0].job_status_code;
											self.show_message('A new job was created, number is ' + new_job_reference_number_from_quote);
											// update
											// calendar
											// list
											// if
											// open
											// this
											// job
											// from
											// calendar
											// or
											// team
											// view
											Ti.App.Properties.setBool('refresh_list', true);
											
											// open
											// new
											// job
											var new_win = Ti.UI.createWindow({
												url : self.get_file_path('url', 'job/edit/job_index_view.js'),
												type : 'job',
												action_for_job : 'edit_job',
												job_id : new_job_id_from_quote,
												job_reference_number : new_job_reference_number_from_quote,
												job_status_code : new_job_status_code_from_quote
											});
											Ti.UI.currentTab.open(new_win, {
												animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
											});
											
										}
									}
								} else {
									self.hide_indicator();
									var params = {
										message : L('message_quote_accepted_failure_in_job_index_view'),
										show_message : true,
										message_title : '',
										send_error_email : true,
										error_message : '',
										error_source : window_source + ' - _quote_accepted_event - xhr.onload - 1',
										server_response_message : this.responseText
									};
									self.processXYZ(params);
									return;
								}
							} catch (e) {
								self.hide_indicator();
								params = {
									message : L('message_quote_accepted_failure_in_job_index_view'),
									show_message : true,
									message_title : '',
									send_error_email : true,
									error_message : e,
									error_source : window_source + ' - _quote_accepted_event - xhr.onload - 2',
									server_response_message : this.responseText
								};
								self.processXYZ(params);
								return;
							}
						};
						xhr.onerror = function(e) {
							self.hide_indicator();
							var params = {
								message : L('message_quote_accepted_failure_in_job_index_view'),
								show_message : true,
								message_title : '',
								send_error_email : true,
								error_message : e,
								error_source : window_source + ' - _quote_accepted_event - xhr.onerror',
								server_response_message : this.responseText
							};
							self.processXYZ(params);
							return;
						};
						xhr.setTimeout(self.default_time_out);
						xhr.open('POST', self.get_host_url() + 'update', false);
						xhr.send({
							'type' : 'quote_accepted',
							'hash' : _selected_user_id,
							'user_id' : _selected_user_id,
							'quote_id' : _selected_job_id,
							'company_id' : _selected_company_id,
							'client_id' : _client_id,
							'status_code' : 1,
							'app_security_session' : self.is_simulator() ? self.default_udid : Titanium.Platform.id,
							'app_version_increment' : self.version_increment,
							'app_version' : self.version,
							'app_platform' : self.get_platform_info()
						});
					}
				} else {
					self.show_message(L('message_offline'), L('message_unable_to_connect'));
					return;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _quote_accepted_event');
				return;
			}
		}
		
		/**
		 * create unrelated job or quote event not need to connect with
		 * backend, create a new local job or quote
		 */
		function _create_unrelated_job_event() {
			try {
				
				var is_make_changed = _check_if_exist_change();
				if (is_make_changed) {
					if (_type === 'job') {
						self.show_message(L('message_create_unrelated_job_in_job_index_view'));
					} else {
						self.show_message(L('message_create_unrelated_quote_in_job_index_view'));
					}
					return;
				} else {
					self.display_indicator('Creating Unrelated ' + self.ucfirst(_type) + ' ...', true);
					
					var d = new Date();
					var new_job_id = parseInt(d.getTime(), 10);
					var new_job_reference_number = new_job_id;
					var new_job_status_code = 0;
					var db = Titanium.Database.open(self.get_db_name());
					var rows = db.execute('SELECT * FROM my_' + _type + ' WHERE id=?', _selected_job_id);
					if (rows.getRowCount() > 0) {
						if (rows.isValidRow()) {
							if (_type === 'job') {
								db.execute('INSERT INTO my_job (id,local_id,company_id,client_id,job_priority_code,job_status_code,scheduled_from,' + 'scheduled_to,reference_number,order_reference,sp,sub_number,unit_number,street_number,street,locality_street_type_id,street_type,' + 'locality_suburb_id,suburb,locality_state_id,latitude,longitude,point,boundary,geo_source_code,geo_accuracy_code,'
												+ 'title,description,booking_note,allocated_hours,status_code,due,order_source_code,is_task,changed,exist_any_changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', new_job_id, _selected_company_id + '-' + _selected_user_id + '-' + new_job_id, _selected_company_id,
												((rows.fieldByName('client_id') == undefined) && (rows.fieldByName('client_id') == null)) ? 0 : rows.fieldByName('client_id'), 0,// job
												// priority
												// code
												new_job_status_code,// job
												// status
												// code
												null, null, new_job_reference_number, '',// order_reference
												'',// sp
												((rows.fieldByName('sub_number') != undefined) && (rows.fieldByName('sub_number') != null)) ? rows.fieldByName('sub_number') : '', ((rows.fieldByName('unit_number') != undefined) && (rows.fieldByName('unit_number') != null)) ? rows.fieldByName('unit_number') : '',
												((rows.fieldByName('street_number') != undefined) && (rows.fieldByName('street_number') != null)) ? rows.fieldByName('street_number') : '', ((rows.fieldByName('street') != undefined) && (rows.fieldByName('street') != null)) ? rows.fieldByName('street') : '', ((rows.fieldByName('locality_street_type_id') != undefined) && (rows.fieldByName('locality_street_type_id') != null)) ? rows
																.fieldByName('locality_street_type_id') : 0, ((rows.fieldByName('street_type') != undefined) && (rows.fieldByName('street_type') != null)) ? rows.fieldByName('street_type') : '', ((rows.fieldByName('locality_suburb_id') != undefined) && (rows.fieldByName('locality_suburb_id') != null)) ? rows.fieldByName('locality_suburb_id') : 0,
												((rows.fieldByName('suburb') != undefined) && (rows.fieldByName('suburb') != null)) ? rows.fieldByName('suburb') : '', ((rows.fieldByName('locality_state_id') != undefined) && (rows.fieldByName('locality_state_id') != null)) ? rows.fieldByName('locality_state_id') : 0, ((rows.fieldByName('latitude') != undefined) && (rows.fieldByName('latitude') != null)) ? rows.fieldByName('latitude') : 0, ((rows
																.fieldByName('longitude') != undefined) && (rows.fieldByName('longitude') != null)) ? rows.fieldByName('longitude') : 0, ((rows.fieldByName('point') != undefined) && (rows.fieldByName('point') != null)) ? rows.fieldByName('point') : '', ((rows.fieldByName('boundary') != undefined) && (rows.fieldByName('boundary') != null)) ? rows.fieldByName('boundary') : '', ((rows
																.fieldByName('geo_source_code') != undefined) && (rows.fieldByName('geo_source_code') != null)) ? rows.fieldByName('geo_source_code') : 0, ((rows.fieldByName('geo_accuracy_code') != undefined) && (rows.fieldByName('geo_accuracy_code') != null)) ? rows.fieldByName('geo_accuracy_code') : 0, 'Untitled Job',// title
												'',// description
												'',// booking_note
												0,// allocated_hours
												1,// status
												// code
												'',// due
												0,// order
												// source
												// code
												0, 1, 1, '',// created
												0,// created
												// by
												'',// modified
												0// modified
								// by
								);
							} else {
								db.execute('INSERT INTO my_quote (id,local_id,company_id,client_id,quote_status_code,scheduled_from,' + 'scheduled_to,reference_number,order_reference,sp,sub_number,unit_number,street_number,street,locality_street_type_id,street_type,' + 'locality_suburb_id,suburb,locality_state_id,latitude,longitude,point,boundary,geo_source_code,geo_accuracy_code,'
												+ 'title,description,booking_note,allocated_hours,job_id,status_code,due,order_source_code,is_task,changed,exist_any_changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', new_job_id, _selected_company_id + '-' + _selected_user_id + '-' + new_job_id, _selected_company_id,
												((rows.fieldByName('client_id') == undefined) && (rows.fieldByName('client_id') == null)) ? 0 : rows.fieldByName('client_id'), new_job_status_code,// job
												// status
												// code
												null, null, new_job_reference_number, '',// order_reference
												'',// sp
												((rows.fieldByName('sub_number') != undefined) && (rows.fieldByName('sub_number') != null)) ? rows.fieldByName('sub_number') : '', ((rows.fieldByName('unit_number') != undefined) && (rows.fieldByName('unit_number') != null)) ? rows.fieldByName('unit_number') : '',
												((rows.fieldByName('street_number') != undefined) && (rows.fieldByName('street_number') != null)) ? rows.fieldByName('street_number') : '', ((rows.fieldByName('street') != undefined) && (rows.fieldByName('street') != null)) ? rows.fieldByName('street') : '', ((rows.fieldByName('locality_street_type_id') != undefined) && (rows.fieldByName('locality_street_type_id') != null)) ? rows
																.fieldByName('locality_street_type_id') : 0, ((rows.fieldByName('street_type') != undefined) && (rows.fieldByName('street_type') != null)) ? rows.fieldByName('street_type') : '', ((rows.fieldByName('locality_suburb_id') != undefined) && (rows.fieldByName('locality_suburb_id') != null)) ? rows.fieldByName('locality_suburb_id') : 0,
												((rows.fieldByName('suburb') != undefined) && (rows.fieldByName('suburb') != null)) ? rows.fieldByName('suburb') : '', ((rows.fieldByName('locality_state_id') != undefined) && (rows.fieldByName('locality_state_id') != null)) ? rows.fieldByName('locality_state_id') : 0, ((rows.fieldByName('latitude') != undefined) && (rows.fieldByName('latitude') != null)) ? rows.fieldByName('latitude') : 0, ((rows
																.fieldByName('longitude') != undefined) && (rows.fieldByName('longitude') != null)) ? rows.fieldByName('longitude') : 0, ((rows.fieldByName('point') != undefined) && (rows.fieldByName('point') != null)) ? rows.fieldByName('point') : '', ((rows.fieldByName('boundary') != undefined) && (rows.fieldByName('boundary') != null)) ? rows.fieldByName('boundary') : '', ((rows
																.fieldByName('geo_source_code') != undefined) && (rows.fieldByName('geo_source_code') != null)) ? rows.fieldByName('geo_source_code') : 0, ((rows.fieldByName('geo_accuracy_code') != undefined) && (rows.fieldByName('geo_accuracy_code') != null)) ? rows.fieldByName('geo_accuracy_code') : 0, 'Untitled Quote',// title
												'',// description
												'',// booking_note
												0,// allocated_hours
												0,// job
												// id
												1,// status
												// code
												'',// due
												0,// order
												// source
												// code
												0, 1, 1, '',// created
												0,// created
												// by
												'',// modified
												0// modified
								// by
								);
							}
						}
					}
					db.close();
					setTimeout(function() {
						var result = false;
						var db = Titanium.Database.open(self.get_db_name());
						var rows = db.execute('SELECT * FROM my_' + _type + ' WHERE id=?', new_job_id);
						if (rows.getRowCount() > 0) {
							result = true;
						}
						db.close();
						self.hide_indicator();
						if (result) {
							// open new job or quote
							var new_win = Ti.UI.createWindow({
								url : self.get_file_path('url', 'job/edit/job_index_view.js'),
								type : _type,
								job_id : new_job_id,
								job_reference_number : new_job_reference_number,
								job_status_code : new_job_status_code,
								action_for_job : 'edit_job'
							});
							Ti.UI.currentTab.open(new_win, {
								animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
							});
						} else {
							if (_type === 'job') {
								self.show_message(L('message_create_unrelated_job_in_job_index_view'));
							} else {
								self.show_message(L('message_create_unrelated_quote_in_job_index_view'));
							}
						}
					}, 500);
				}
			} catch (err) {
				self.hide_indicator();
				self.process_simple_error_message(err, window_source + ' - _create_unrelated_job_event');
				return;
			}
		}
		/**
		 * start or stop job event when click start or stop button
		 */
		function _start_stop_job() {
			try {
				var temp_action = '';
				if (_is_start_flag) {
					self.display_indicator('Stopping Job', true);
					_is_start_flag = false;
					temp_action = 'stop';
					self.start_btn.title = 'Start';
					self.start_btn.backgroundImage = self.get_file_path('image', 'BUTT_grn_off.png');
					if (_start_btn_timer != null) {
						clearInterval(_start_btn_timer);
						_start_btn_timer = null;
					}
				} else {
					self.display_indicator('Starting Job', true);
					_is_start_flag = true;
					temp_action = 'start';
					self.start_btn.title = 'Stop';
					self.start_btn.backgroundImage = self.get_file_path('image', 'BUTT_red_off.png');
					_start_btn_timer = setInterval(_start_job_record_timer, 1000);
				}
				_get_gps_when_start_stop_job(temp_action);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _start_stop_job');
				return;
			}
		}
		/**
		 * figure out escapsed time when click start button or open init
		 * page
		 */
		function _get_start_job_escpsed_time(db) {
			try {
				var db_is_created_flag = false;
				if ((db === undefined) || (db === null)) {
					db = Titanium.Database.open(self.get_db_name());
					db_is_created_flag = true;
				}
				var rows = db.execute('SELECT * from my_' + _type + '_operation_log WHERE ' + _type + '_id=? and manager_user_id=? and status_code=1 order by logged desc,id desc', _selected_job_id, _selected_user_id);
				if ((rows != null) && (rows.isValidRow())) {
					if (rows.fieldByName(_type + '_operation_log_type_code') === 1) {
						_is_start_flag = false;// end
						// by
						// stop
					} else {
						_is_start_flag = true;
					}
				}
				var time_array = [];
				var new_time_array = [];
				if (rows.getRowCount() > 0) {
					while (rows.isValidRow()) {
						var this_time_action = '';
						if (rows.fieldByName(_type + '_operation_log_type_code') === 1) {// last
							// time
							// is
							// stop
							// job
							this_time_action = 'stop';
						} else {
							this_time_action = 'start';
						}
						var temp_var = {
							status : this_time_action,
							time : self.get_seconds_value_by_time_string(rows.fieldByName('logged'))
						};
						time_array.push(temp_var);
						rows.next();
					}
				}
				rows.close();
				if (db_is_created_flag) {
					db.close();
				}
				for ( var i = 0, j = time_array.length; i < j; i++) {
					if ((i === 0) && (time_array[i].status === 'start')) {
						i++;
					}
					if ((i < time_array.length) && ((i + 1) < time_array.length)) {
						if ((time_array[i].status === 'stop') && (time_array[i + 1].status === 'start')) {
							temp_var = {
								start : time_array[i + 1].time,
								stop : time_array[i].time
							};
							new_time_array.push(temp_var);
						}
						i++;
					}
				}
				var total_seconds = 0;
				for (i = 0, j = new_time_array.length; i < j; i++) {
					total_seconds += new_time_array[i].stop - new_time_array[i].start;
				}
				if (time_array.length > 0) {
					if (time_array[0].status === 'start') {
						var new_date = new Date();
						total_seconds += (parseInt(new_date.getTime() / 1000, 10)) - time_array[0].time;
					}
				}
				if (total_seconds > 0) {
					if ((total_seconds > 0) && (total_seconds < 60)) {
						_start_btn_timer_seconds = total_seconds;
					}
					if ((total_seconds >= 60) && (total_seconds < 3600)) {
						_start_btn_timer_minutes = parseInt(total_seconds / 60, 10);
						_start_btn_timer_seconds = total_seconds - (_start_btn_timer_minutes * 60);
					}
					if ((total_seconds >= 3600)) {
						_start_btn_timer_hours = parseInt(total_seconds / 3600, 10);
						_start_btn_timer_minutes = parseInt((total_seconds - _start_btn_timer_hours * 3600) / 60, 10);
						_start_btn_timer_seconds = total_seconds - (_start_btn_timer_hours * 3600) - (_start_btn_timer_minutes * 60);
					}
				}
				return total_seconds;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _get_start_job_escpsed_time');
				return 0;
			}
		}
		/**
		 * refresh job ecapsed time when stop job
		 */
		function _refresh_job_ecapsed_time() {
			try {
				var total_seconds = _get_start_job_escpsed_time();
				var hh = 0;
				var mm = 0;
				var ss = 0;
				if (total_seconds > 0) {
					if ((total_seconds > 0) && (total_seconds < 60)) {
						ss = total_seconds;
					}
					if ((total_seconds >= 60) && (total_seconds < 3600)) {
						mm = parseInt(total_seconds / 60, 10);
						ss = total_seconds - (mm * 60);
					}
					if ((total_seconds >= 3600)) {
						hh = parseInt(total_seconds / 3600, 10);
						mm = parseInt((total_seconds - hh * 3600) / 60, 10);
						ss = total_seconds - (hh * 60 * 60) - (mm * 60);
					}
				}
				self.time_label.text = 'Elapsed ' + ((hh < 10) ? '0' + hh : hh) + ':' + ((mm < 10) ? '0' + mm : mm) + ':' + ((ss < 10) ? '0' + ss : ss);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _refresh_job_ecapsed_time');
				return;
			}
		}
		/**
		 * get gps location when click start or stop button
		 */
		function _get_gps_when_start_stop_job(action) {
			try {
				if (Titanium.Geolocation.locationServicesEnabled) {
					if (Titanium.Platform.model == 'google_sdk' || Titanium.Platform.model == 'Simulator' || Titanium.Platform.model == 'x86_64') {
						_update_job_status_of_server(0, 0, action);
					} else {
						_update_job_status_of_server(Ti.App.Properties.getString('job_start_stop_latitude'), Ti.App.Properties.getString('job_start_stop_longitude'), action);
					}
				} else {
					_update_job_status_of_server(0, 0, action);
				}
			} catch (err) {
				self.hide_indicator();
				self.process_simple_error_message(err, window_source + ' - _get_gps_when_start_stop_job');
				return;
			}
		}
		/**
		 * update job status (server side) if mobile is online when
		 * click start button (set job status to work in progress)
		 */
		function _update_job_status_of_server(latitude, longitude, action) {
			try {
				if (Ti.Network.online) {
					//get existed status log id
					var existedStatusLogIdArray = [];
					var db = Titanium.Database.open(self.get_db_name());
					var row = db.execute('SELECT * FROM my_'+_type+'_status_log where '+_type+"_id=? and id< 1000000000",_selected_job_id);
					if(row != null){
						while(row.isValidRow()){
							existedStatusLogIdArray.push(row.fieldByName('id'));
							row.next();
						}
						row.close();
					}
					Ti.API.info('existedStatusLogIdArray:'+existedStatusLogIdArray);
					var existedNotUploadedOperationLog = _setup_job_operation_log_for_upload(db);
					Ti.API.info('existedNotUploadedOperationLog:'+existedNotUploadedOperationLog);
					db.close();
					
					var d = new Date();
					var year = d.getFullYear();
					var month = d.getMonth() + 1;
					var date = d.getDate();
					var hours = d.getHours();
					var minutes = d.getMinutes();
					var seconds = d.getSeconds();
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
								Ti.API.info('this responseText:'+this.responseText);
								if (self.return_to_login_page_if_user_security_session_changed(this.responseText)) {
									return;
								}
								if (self.display_app_version_incompatiable(this.responseText)) {
									return;
								}
								if (_type == 'job') {
									self.update_selected_tables(null, 'JobOperationLog', JSON.parse(this.responseText));
									self.update_selected_tables(null, 'JobStatusLog', JSON.parse(this.responseText));
								} else {
									self.update_selected_tables(null, 'QuoteOperationLog', JSON.parse(this.responseText));
									self.update_selected_tables(null, 'QuoteStatusLog', JSON.parse(this.responseText));
								}
								// update job
								// status
								db = Titanium.Database.open(self.get_db_name());
								if ((_selected_job_id < 1000000000) && (action === 'start') && (_type == 'job')) {
									db.execute('UPDATE my_job SET job_status_code=4 WHERE id=?', _selected_job_id);
								}
								db.close();
								if (action === 'stop') {
									_refresh_job_ecapsed_time();
								} else {
									var total_seconds = _get_start_job_escpsed_time();
									if (total_seconds > 0) {
										if ((total_seconds > 0) && (total_seconds < 60)) {
											_start_btn_timer_seconds = total_seconds;
										}
										if ((total_seconds >= 60) && (total_seconds < 3600)) {
											_start_btn_timer_minutes = parseInt(total_seconds / 60, 10);
											_start_btn_timer_seconds = total_seconds - (_start_btn_timer_minutes * 60);
										}
										if ((total_seconds >= 3600)) {
											_start_btn_timer_hours = parseInt(total_seconds / 3600, 10);
											_start_btn_timer_minutes = parseInt((total_seconds - _start_btn_timer_hours * 3600) / 60, 10);
											_start_btn_timer_seconds = total_seconds - (_start_btn_timer_hours * 60 * 60) - (_start_btn_timer_minutes * 60);
										}
									}
									_start_job_record_timer();
								}
								// update
								// calendar list
								// if open this
								// job from
								// calendar or
								// team view
								Ti.App.Properties.setBool('refresh_list', true);
								self.hide_indicator();
								if ((action === 'stop')) {
									var alertDialog = null;
									alertDialog = Titanium.UI.createAlertDialog({
										title : 'Reminder',
										message : 'The timer has been stopped.',
										buttonNames : [ 'Close' ]
									});
									alertDialog.show();
									return;
								} else {
									var alertDialog2 = null;
									alertDialog2 = Titanium.UI.createAlertDialog({
										title : 'Reminder',
										message : 'The timer has been started.',
										buttonNames : [ 'Close' ]
									});
									alertDialog2.show();
									return;
								}
							} else {
								self.hide_indicator();
								_insert_record_to_operation_log(latitude, longitude, action);
							}
						} catch (e) {
							self.hide_indicator();
							var params = {
								message : 'Update ' + _type + ' operation failed.',
								show_message : true,
								message_title : '',
								send_error_email : true,
								error_message : e,
								error_source : window_source + ' - _update_job_status_of_server - xhr.onload - 1',
								server_response_message : this.responseText
							};
							self.processXYZ(params);
							return;
						}
					};
					xhr.onerror = function(e) {
						self.hide_indicator();
						var params = {
							message : 'Update ' + _type + ' operation failed.',
							show_message : true,
							message_title : '',
							send_error_email : true,
							error_message : e,
							error_source : window_source + ' - _update_job_status_of_server - xhr.onerror',
							server_response_message : this.responseText
						};
						self.processXYZ(params);
						return;
					};
					xhr.setTimeout(self.default_time_out);
					xhr.open('POST', self.get_host_url() + 'update', false);
					xhr.send({
						'type' : 'update_job_operation',
						'hash' : _selected_user_id,
						'job_type' : _type,
						'job_id' : _selected_job_id,
						'quote_id' : _selected_job_id,
						'job_operation_log_type_code' : (action === 'stop') ? 1 : 0,
						'quote_operation_log_type_code' : (action === 'stop') ? 1 : 0,
						'manager_user_id' : _selected_user_id,
						'description' : 'update ' + _type + ' operation',
						'logged' : year + '-' + ((month < 10) ? '0' + month : month) + '-' + ((date < 10) ? '0' + date : date) + ' ' + ((hours < 10) ? '0' + hours : hours) + ':' + ((minutes < 10) ? '0' + minutes : minutes) + ':' + ((seconds < 10) ? '0' + seconds : seconds),
						'latitude' : ((latitude === 0) ? null : latitude),
						'longitude' : ((longitude === 0) ? null : longitude),
						'status_code' : 1,
						'existed_status_log_id_string':(existedStatusLogIdArray.length>0)?existedStatusLogIdArray.join(','):'',
						'existed_not_uploaded_operation_log':existedNotUploadedOperationLog,
						'app_security_session' : self.is_simulator() ? self.default_udid : Titanium.Platform.id,
						'app_version_increment' : self.version_increment,
						'app_version' : self.version,
						'app_platform' : self.get_platform_info()
					});
				} else {
					_insert_record_to_operation_log(latitude, longitude, action);
					self.hide_indicator();
					return;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _update_job_status_of_server');
				return;
			}
		}
		/**
		 * setup timer for start job button
		 */
		function _start_job_record_timer() {
			try {
				_start_btn_timer_seconds++;
				if (_start_btn_timer_seconds > 59) {
					_start_btn_timer_minutes++;
					_start_btn_timer_seconds = 0;
					if (_start_btn_timer_minutes > 59) {
						_start_btn_timer_hours++;
						_start_btn_timer_minutes = 0;
					}
				}
				self.time_label.text = 'Elapsed: ' + ((_start_btn_timer_hours < 10) ? '0' + _start_btn_timer_hours : _start_btn_timer_hours) + ':' + ((_start_btn_timer_minutes < 10) ? '0' + _start_btn_timer_minutes : _start_btn_timer_minutes) + ':' + ((_start_btn_timer_seconds < 10) ? '0' + _start_btn_timer_seconds : _start_btn_timer_seconds);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _start_job_record_timer');
				return;
			}
		}
		/**
		 * insert record into operation log of local database
		 */
		function _insert_record_to_operation_log(latitude, longitude, action) {
			try {
				var d = new Date();
				var new_opeation_log_id = parseInt(d.getTime(), 10);
				var year = d.getFullYear();
				var month = d.getMonth() + 1;
				var date = d.getDate();
				var hours = d.getHours();
				var minutes = d.getMinutes();
				var seconds = d.getSeconds();
				var db = Titanium.Database.open(self.get_db_name());
				db.execute('INSERT INTO my_' + _type + '_operation_log (id,local_id,' + _type + '_id,' + _type + '_operation_log_type_code,' + 'manager_user_id,logged,latitude,longitude,status_code,changed)' + 'VALUES(?,?,?,?,?,?,?,?,?,?)', new_opeation_log_id, _selected_company_id + '-' + _selected_user_id + '-' + new_opeation_log_id, _selected_job_id, (action === 'start') ? 0 : 1, _selected_user_id, year + '-' + ((month < 10) ? '0' + month : month) + '-'
								+ ((date < 10) ? '0' + date : date) + ' ' + ((hours < 10) ? '0' + hours : hours) + ':' + ((minutes < 10) ? '0' + minutes : minutes) + ':' + ((seconds < 10) ? '0' + seconds : seconds), latitude, longitude, 1, 1);
				if ((_selected_job_id < 1000000000) && (action === 'start') && (_type == 'job')) {
					db.execute('UPDATE my_job SET job_status_code=4,changed=1 WHERE id=?', _selected_job_id);
				}
				db.close();
				if (action === 'stop') {
					_refresh_job_ecapsed_time();
					if ((action === 'stop')) {
						var alertDialog = null;
						if (_is_close_timer) {
							_is_close_timer = false;
							alertDialog = Titanium.UI.createAlertDialog({
								title : 'Reminder',
								message : 'The timer has been stopped.',
								buttonNames : [ 'Close' ]
							});
							alertDialog.show();
						} else {
							alertDialog = Titanium.UI.createAlertDialog({
								title : 'Reminder',
								message : 'Please update ' + _type + ' status.',
								buttonNames : [ 'Close' ]
							});
							alertDialog.show();
						}
						return;
					}
				} else {
					var total_seconds = _get_start_job_escpsed_time();
					if (total_seconds > 0) {
						if ((total_seconds > 0) && (total_seconds < 60)) {
							_start_btn_timer_seconds = total_seconds;
						}
						if ((total_seconds >= 60) && (total_seconds < 3600)) {
							_start_btn_timer_minutes = parseInt(total_seconds / 60, 10);
							_start_btn_timer_seconds = total_seconds - (_start_btn_timer_minutes * 60);
						}
						if ((total_seconds >= 3600)) {
							_start_btn_timer_hours = parseInt(total_seconds / 3600, 10);
							_start_btn_timer_minutes = parseInt((total_seconds - _start_btn_timer_hours * 3600) / 60, 10);
							_start_btn_timer_seconds = total_seconds - (_start_btn_timer_hours * 60 * 60) - (_start_btn_timer_minutes * 60);
						}
					}
					_start_job_record_timer();
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _insert_record_to_operation_log');
				return;
			}
		}
		/**
		 * display the play page of audio
		 */
		function _show_audio(asset_type_code, asset_type_path) {
			try {
				var new_win = Titanium.UI.createWindow({
					type : _type,
					url : self.get_file_path('url', 'job/base/job_create_audio.js'),
					job_id : _selected_job_id,
					job_reference_number : _selected_job_reference_number,
					asset_id : 0,
					asset_type_code : asset_type_code,
					asset_type_path : asset_type_path
				});
				Titanium.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _show_audio');
				return;
			}
		}
		/**
		 * upload job or quote details and related data
		 */
		function _upload_job_detail() {
			try {
				var db = Titanium.Database.open(self.get_db_name());
				var temp_flag = false;
				var row = db.execute('SELECT * FROM my_' + _type + ' WHERE id=?', _selected_job_id);
				if (row.getRowCount() <= 0) {
					row.close();
					db.close();
					if (_is_click_main_menu_btn) {// menu
						// menu
						self.close_all_window_and_return_to_menu();
					} else {
						if (_is_click_back_btn) {
							win.close();
						}
					}
					return true;
				} else {
					temp_flag = row.fieldByName('changed') ? true : false;
					var client_id = row.fieldByName('client_id');
					var local_id = row.fieldByName('local_id');
					var reference_number = row.fieldByName('reference_number');
					var order_reference = row.fieldByName('order_reference');
					var scheduled_from = row.fieldByName('scheduled_from');
					var scheduled_to = row.fieldByName('scheduled_to');
					var sub_number = ((row.fieldByName('sub_number') != '') && (row.fieldByName('sub_number') != null)) ? self.trim(row.fieldByName('sub_number').toLowerCase()) : '';
					var unit_number = ((row.fieldByName('unit_number') != '') && (row.fieldByName('unit_number') != null)) ? self.trim(row.fieldByName('unit_number').toLowerCase()) : '';
					var street_number = ((row.fieldByName('street_number') != '') && (row.fieldByName('street_number') != null)) ? self.trim(row.fieldByName('street_number').toLowerCase()) : '';
					var street = ((row.fieldByName('street') != '') && (row.fieldByName('street') != null)) ? self.trim(row.fieldByName('street').toUpperCase()) : '';
					var locality_street_type_id = row.fieldByName('locality_street_type_id');
					var locality_suburb_id = row.fieldByName('locality_suburb_id');
					var suburb = ((row.fieldByName('suburb') != '') && (row.fieldByName('suburb') != null)) ? self.trim(row.fieldByName('suburb').toUpperCase()) : '';
					var postcode = ((row.fieldByName('postcode') != '') && (row.fieldByName('postcode') != null)) ? self.trim(row.fieldByName('postcode').toUpperCase()) : '';
					var state_id = row.fieldByName('locality_state_id');
					var site_or_sp_name = self.trim(row.fieldByName('sp'));
					var job_status_code = row.fieldByName(_type + '_status_code');
					var job_priority_code = (_type === 'job') ? row.fieldByName(_type + '_priority_code') : 0;
					var allocated_hours = (row.fieldByName('allocated_hours') === '') ? 0 : row.fieldByName('allocated_hours');
					var job_title = row.fieldByName('title');
					var descriptionText = row.fieldByName('description');
					var bookingNoteText = row.fieldByName('booking_note');
					var latitudeText = row.fieldByName('latitude');
					var longitudeText = row.fieldByName('longitude');
					var due = (row.fieldByName('due') === null) ? '' : row.fieldByName('due');
					var order_source_code = (row.fieldByName('order_source_code') === null) ? 0 : row.fieldByName('order_source_code');
				}
				var operation_log_list = _setup_job_operation_log_for_upload(db);
				var status_log_list = _setup_job_status_log_for_upload(db);
				var client_contact_list = _setup_job_client_contact_for_upload(db);
				var site_contact_list = _setup_job_site_contact_for_upload(db);
				var assigned_user_list = _setup_job_assigned_user_for_upload(db);
				var note_list = _setup_job_note_for_upload(db);
				var asset_list = _setup_job_asset_for_upload(db);
				var oversize_asset_list = _setup_job_asset_for_over_size_files(db);
				var material_list = _setup_job_material_log_for_upload(db);
				var invoice_signature_list = _setup_job_invoice_signature_for_upload(db);
				var invoice_list = _setup_job_invoice_for_upload(db);
				var custom_report_signature_list = _setup_job_custom_report_signature_for_upload(db);
				var custom_report_list = _setup_job_custom_report_for_upload(db);
				row.close();
				db.close();
				var _is_item_management = parseInt(Ti.App.Properties.getString('current_company_active_material_location'));
				
				self.display_indicator('Saving ' + self.ucfirst(_type) + ' ...', true);
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
							var temp_result = '';
							if ((xhr.readyState == 4) && (this.status == 200)) {
								if (self.return_to_login_page_if_user_security_session_changed(this.responseText)) {
									return false;
								}
								if (self.display_app_version_incompatiable(this.responseText)) {
									return false;
								}
								temp_result = JSON.parse(this.responseText);
								if ((temp_result.job_error != undefined) && (temp_result.job_error.length > 0)) {
									self.hide_indicator();
									var error_string = '';
									for ( var i = 0, j = temp_result.job_error.length; i < j; i++) {
										if (i == j) {
											error_string += temp_result.job_error[i];
										} else {
											error_string += temp_result.job_error[i] + '\n';
										}
									}
									
									self.show_message(error_string);
									return false;
								}
								
								var new_selected_job_id = 0;
								var new_selected_job_reference_number = 0;
								var new_selected_job_status_code = 0;
								var new_client_id = 0;
								if (_type === 'job') {
									new_selected_job_id = (temp_result.Job[0] != undefined) ? temp_result.Job[0].id : 0;
									new_selected_job_reference_number = (temp_result.Job[0] != undefined) ? temp_result.Job[0].reference_number : 0;
									new_selected_job_status_code = (temp_result.Job[0] != undefined) ? temp_result.Job[0].job_status_code : 0;
									new_client_id = (temp_result.Job[0] != undefined) ? temp_result.Job[0].client_id : 0;
								} else {
									new_selected_job_id = (temp_result.Quote[0] != undefined) ? temp_result.Quote[0].id : 0;
									new_selected_job_reference_number = (temp_result.Quote[0] != undefined) ? temp_result.Quote[0].reference_number : 0;
									new_selected_job_status_code = (temp_result.Quote[0] != undefined) ? temp_result.Quote[0].quote_status_code : 0;
									new_client_id = (temp_result.Quote[0] != undefined) ? temp_result.Quote[0].client_id : 0;
								}
								if (new_selected_job_id <= 0) {
									self.hide_indicator();
									if (_is_click_main_menu_btn) {// menu
										// menu
										self.close_all_window_and_return_to_menu();
									} else {
										if (_is_click_back_btn) {
											win.close();
										} else {
											// save
											// job
											// exist
											// some
											// error,
											// so
											// close
											// window.
											win.close();
										}
									}
									return false;
								} else {
									Ti.App.Properties.setBool('update_job_status_with_error', false);
									self.refresh_job_and_relative_tables(this.responseText, _type);
									_remove_old_data_after_save_to_office(temp_result, new_selected_job_id, new_selected_job_reference_number, oversize_asset_list);
									
									_update_media_file_name_and_add_to_upload_queue_after_save_to_office(asset_list, oversize_asset_list, new_selected_job_id, new_selected_job_reference_number);
									_update_invoice_signature_file_name_and_add_to_upload_queue_after_save_to_office(invoice_signature_list, new_selected_job_id, new_selected_job_reference_number);
									_update_report_signature_file_name_and_add_to_upload_queue_after_save_to_office(custom_report_signature_list, new_selected_job_id, new_selected_job_reference_number);
									if (_selected_job_id > 0) {
										if (Ti.App.Properties.getBool('update_job_status_with_error') || (oversize_asset_list != null)) {
											_update_job_exist_any_changed_status(new_selected_job_id, 1);
										} else {
											_update_job_exist_any_changed_status(new_selected_job_id, 0);
										}
										
										// get
										// saved
										// job
										// and
										// set
										// variable
										// by
										// this
										// job
										_selected_job_id = new_selected_job_id;
										_selected_job_reference_number = new_selected_job_reference_number;
										_selected_job_status_code = new_selected_job_status_code;
										_client_id = new_client_id;
										
										setTimeout(function() {
											self.hide_indicator();
											if (temp_flag || (status_log_list != null && status_log_list.length > 0) || (assigned_user_list != null && assigned_user_list.length > 0)) {
												Ti.App.Properties.setBool('refresh_list', true);
											}
											if (_is_click_main_menu_btn) {// menu
												// menu
												self.close_all_window_and_return_to_menu();
											} else {
												if (_is_click_back_btn) {
													win.close();
												} else {
													if (_action_for_job === 'add_job') {
														_action_for_job = 'edit_job';
														self.display();
													}
													var alertDialog = Titanium.UI.createAlertDialog({
														title : 'Reminder',
														message : self.ucfirst(_type) + ' has been saved to office.',
														buttonNames : [ 'Close' ]
													});
													alertDialog.show();
												}
											}
											Ti.App.fireEvent('async_save_data');
										}, 500);
										return true;
									}
									return true;
								}
							} else {
								self.hide_indicator();
								var params = {
									message : 'Save ' + _type + ' failed.',
									show_message : true,
									message_title : '',
									send_error_email : true,
									error_message : '',
									error_source : window_source + ' - _upload_job_detail - xhr.onload - 1',
									server_response_message : this.responseText
								};
								self.processXYZ(params);
								return false;
							}
							
						} catch (e) {
							self.hide_indicator();
							params = {
								message : 'Save ' + _type + ' failed.',
								show_message : true,
								message_title : '',
								send_error_email : true,
								error_message : e,
								error_source : window_source + ' - _upload_job_detail - xhr.onload - 2',
								server_response_message : this.responseText
							};
							self.processXYZ(params);
							return false;
						}
					};
					xhr.onerror = function(e) {
						self.hide_indicator();
						var params = {
							message : 'Save ' + _type + ' failed.',
							show_message : true,
							message_title : '',
							send_error_email : true,
							error_message : e,
							error_source : window_source + ' - _upload_job_detail - xhr.onerror',
							server_response_message : this.responseText
						};
						self.processXYZ(params);
						return false;
					};
					xhr.onsendstream = function(e) {
						self.update_progress(e.progress, true);
					};
					xhr.setTimeout(self.default_time_out);
					xhr.open('POST', self.get_host_url() + 'update', false);
					xhr.send({
						'type' : 'save_job',
						'hash' : _selected_user_id,
						'user_id' : _selected_user_id,
						'company_id' : _selected_company_id,
						'id' : _selected_job_id,
						'local_id' : local_id,
						'client_id' : (client_id === 0) ? null : client_id,
						'reference_number' : reference_number,
						'order_reference' : (order_reference === null) ? '' : order_reference,
						'scheduled_from' : scheduled_from,
						'scheduled_to' : scheduled_to,
						'sub_number' : (sub_number === '') ? null : sub_number,
						'unit_number' : (unit_number === '') ? null : unit_number,
						'street_number' : (street_number === '') ? null : street_number,
						'street' : (street === '') ? null : street,
						'suburb' : (suburb === '') ? null : suburb,
						'postcode' : (postcode === '') ? null : postcode,
						'locality_street_type_id' : (locality_street_type_id === 0) ? null : locality_street_type_id,
						'locality_suburb_id' : (locality_suburb_id === 0) ? null : locality_suburb_id,
						'locality_state_id' : (state_id === 0) ? null : state_id,
						'sp' : (site_or_sp_name === '') ? null : site_or_sp_name,
						'job_status_code' : job_status_code,
						'quote_status_code' : job_status_code,
						'job_priority_code' : job_priority_code,
						'allocated_hours' : (allocated_hours === '') ? 0 : allocated_hours,
						'title' : job_title,
						'description' : (descriptionText === '') ? null : descriptionText,
						'booking_note' : (bookingNoteText === '') ? null : bookingNoteText,
						'longitude' : longitudeText,
						'latitude' : latitudeText,
						'status_code' : 1,
						'due' : due,
						'order_source_code' : order_source_code,
						'job_type' : _type,
						'job_changed' : temp_flag,
						'is_update_job_detail' : temp_flag,
						'operation_log_list' : operation_log_list,
						'status_log_list' : status_log_list,
						'client_contact_list' : client_contact_list,
						'site_contact_list' : site_contact_list,
						'assigned_user_list' : assigned_user_list,
						'note_list' : note_list,
						'asset_list' : asset_list,
						'material_list' : material_list,
						'invoice_list' : invoice_list,
						'invoice_signature_list' : invoice_signature_list,
						'custom_report_list' : custom_report_list,
						'custom_report_signature_list' : custom_report_signature_list,
						'is_item_management' : _is_item_management,
						'app_security_session' : self.is_simulator() ? self.default_udid : Titanium.Platform.id,
						'app_version_increment' : self.version_increment,
						'app_version' : self.version,
						'app_platform' : self.get_platform_info()
					});
				} catch (e) {
					self.hide_indicator();
					var params = {
						message : 'Save ' + _type + ' failed.',
						show_message : true,
						message_title : '',
						send_error_email : true,
						error_message : e,
						error_source : window_source + ' - _upload_job_detail - 3',
						server_response_message : ''
					};
					self.processXYZ(params);
					return false;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _upload_job_detail');
				return false;
			}
		}
		
		function _remove_old_data_after_save_to_office(temp_result, new_selected_job_id, new_selected_job_reference_number, oversize_asset_list_string) {
			try {
				var i = 0, j = 0;
				var db = Titanium.Database.open(self.get_db_name());
				if (_selected_job_id > 1000000000) {
					db.execute('delete from my_' + _type + ' where id=?', _selected_job_id);
				}
				_remove_old_data_and_save_error_info_for_job_operation_log(db, temp_result, new_selected_job_id, new_selected_job_reference_number);
				_remove_old_data_and_save_error_info_for_job_status_log(db, temp_result, new_selected_job_id, new_selected_job_reference_number);
				_remove_old_data_and_save_error_info_for_job_client_contact(db, temp_result, new_selected_job_id, new_selected_job_reference_number);
				_remove_old_data_and_save_error_info_for_job_site_contact(db, temp_result, new_selected_job_id, new_selected_job_reference_number);
				_remove_old_data_and_save_error_info_for_job_assigned_user(db, temp_result, new_selected_job_id, new_selected_job_reference_number);
				_remove_old_data_and_save_error_info_for_job_note(db, temp_result, new_selected_job_id, new_selected_job_reference_number);
				_remove_old_data_and_save_error_info_for_job_asset(db, temp_result, new_selected_job_id, new_selected_job_reference_number, oversize_asset_list_string);
				_remove_old_data_and_save_error_info_for_job_assigned_item(db, temp_result, new_selected_job_id, new_selected_job_reference_number);
				_remove_old_data_and_save_error_info_for_job_invoice_signature(db, temp_result, new_selected_job_id, new_selected_job_reference_number);
				if (self.is_available_for_locksmith(_type)) {
					_remove_old_data_and_save_error_info_for_job_invoice_locksmith_signature(db, temp_result, new_selected_job_id, new_selected_job_reference_number);
				}
				_remove_old_data_and_save_error_info_for_job_custom_report(db, temp_result, new_selected_job_id, new_selected_job_reference_number);
				_remove_old_data_and_save_error_info_for_job_custom_report_signature(db, temp_result, new_selected_job_id, new_selected_job_reference_number);
				db.close();
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _remove_old_data_after_save_to_office');
				return;
			}
		}
		function _remove_old_data_and_save_error_info_for_job_operation_log(db, temp_result, new_selected_job_id, new_selected_job_reference_number) {
			try {
				if ((temp_result.job_operation_log_error != undefined) && (temp_result.job_operation_log_error.length > 0)) {
					var temp_job_operation_log_id_array = [];
					var temp_job_operation_log_message_array = [];
					for ( var i = 0, j = temp_result.job_operation_log_error.length; i < j; i++) {
						if (parseInt(temp_result.job_operation_log_error[i].id, 10) > 0) {
							temp_job_operation_log_id_array.push(temp_result.job_operation_log_error[i].id);
							var temp_error_str = '';
							for ( var m = 0, n = temp_result.job_operation_log_error[i].error.length; m < n; m++) {
								if (m === 0) {
									temp_error_str = 'Operation Log:' + temp_result.job_operation_log_error[i].error[m];
								} else {
									temp_error_str += '\n' + 'Operation Log:' + temp_result.job_operation_log_error[i].error[m];
								}
							}
							temp_job_operation_log_message_array.push(temp_error_str);
						}
					}
					if (temp_job_operation_log_id_array.length > 0) {
						db.execute('delete from my_' + _type + '_operation_log where ' + _type + '_id=? and id > 1000000000 and id not in (' + temp_job_operation_log_id_array.join(',') + ')', _selected_job_id);
						db.execute('UPDATE my_' + _type + '_operation_log  SET ' + _type + '_id=? WHERE id>1000000000 and id in (' + temp_job_operation_log_id_array.join(',') + ')', new_selected_job_id);
						for (i = 0, j = temp_job_operation_log_id_array.length; i < j; i++) {
							_save_error_info_to_database_after_save_to_office(db, temp_job_operation_log_message_array[i], temp_job_operation_log_id_array[i], new_selected_job_id, new_selected_job_reference_number);
						}
						Ti.App.Properties.setBool('update_job_status_with_error', true);
					} else {
						db.execute('delete from my_' + _type + '_operation_log where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
					}
				} else {
					db.execute('delete from my_' + _type + '_operation_log where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _remove_old_data_and_save_error_info_for_job_operation_log');
				return;
			}
		}
		function _remove_old_data_and_save_error_info_for_job_status_log(db, temp_result, new_selected_job_id, new_selected_job_reference_number) {
			try {
				if ((temp_result.job_status_log_error != undefined) && (temp_result.job_status_log_error.length > 0)) {
					var temp_job_status_log_id_array = [];
					var temp_job_status_log_message_array = [];
					for ( var i = 0, j = temp_result.job_status_log_error.length; i < j; i++) {
						if (parseInt(temp_result.job_status_log_error[i].id, 10) > 0) {
							temp_job_status_log_id_array.push(temp_result.job_status_log_error[i].id);
							var temp_error_str = '';
							for ( var m = 0, n = temp_result.job_status_log_error[i].error.length; m < n; m++) {
								if (m === 0) {
									temp_error_str = 'Status Log:' + temp_result.job_status_log_error[i].error[m];
								} else {
									temp_error_str += '\n' + 'Status Log:' + temp_result.job_status_log_error[i].error[m];
								}
							}
							temp_job_status_log_message_array.push(temp_error_str);
						}
					}
					if (temp_job_status_log_id_array.length > 0) {
						db.execute('delete from my_' + _type + '_status_log where ' + _type + '_id=? and id > 1000000000 and id not in (' + temp_job_status_log_id_array.join(',') + ')', _selected_job_id);
						db.execute('UPDATE my_' + _type + '_status_log  SET ' + _type + '_id=? WHERE id>1000000000 and id in (' + temp_job_status_log_id_array.join(',') + ')', new_selected_job_id);
						for (i = 0, j = temp_job_status_log_id_array.length; i < j; i++) {
							_save_error_info_to_database_after_save_to_office(db, temp_job_status_log_message_array[i], temp_job_status_log_id_array[i], new_selected_job_id, new_selected_job_reference_number);
						}
						Ti.App.Properties.setBool('update_job_status_with_error', true);
					} else {
						db.execute('delete from my_' + _type + '_status_log where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
					}
				} else {
					db.execute('delete from my_' + _type + '_status_log where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _remove_old_data_and_save_error_info_for_job_status_log');
				return;
			}
		}
		function _remove_old_data_and_save_error_info_for_job_client_contact(db, temp_result, new_selected_job_id, new_selected_job_reference_number) {
			try {
				if ((temp_result.job_client_contact_error != undefined) && (temp_result.job_client_contact_error.length > 0)) {
					var temp_job_client_contact_id_array = [];
					var temp_job_client_contact_message_array = [];
					for ( var i = 0, j = temp_result.job_client_contact_error.length; i < j; i++) {
						if (parseInt(temp_result.job_client_contact_error[i].id, 10) > 0) {
							temp_job_client_contact_id_array.push(temp_result.job_client_contact_error[i].id);
							var temp_error_str = '';
							for ( var m = 0, n = temp_result.job_client_contact_error[i].error.length; m < n; m++) {
								if (m === 0) {
									temp_error_str = 'Client Contact:' + temp_result.job_client_contact_error[i].error[m];
								} else {
									temp_error_str += '\n' + 'Client Contact:' + temp_result.job_client_contact_error[i].error[m];
								}
							}
							temp_job_client_contact_message_array.push(temp_error_str);
						}
					}
					if (temp_job_client_contact_id_array.length > 0) {
						db.execute('delete from my_' + _type + '_client_contact where ' + _type + '_id=? and id > 1000000000 and id not in (' + temp_job_client_contact_id_array.join(',') + ')', _selected_job_id);
						db.execute('UPDATE my_' + _type + '_client_contact  SET ' + _type + '_id=? WHERE id>1000000000 and id in (' + temp_job_client_contact_id_array.join(',') + ')', new_selected_job_id);
						for (i = 0, j = temp_job_client_contact_id_array.length; i < j; i++) {
							_save_error_info_to_database_after_save_to_office(db, temp_job_client_contact_message_array[i], temp_job_client_contact_id_array[i], new_selected_job_id, new_selected_job_reference_number);
						}
						Ti.App.Properties.setBool('update_job_status_with_error', true);
					} else {
						db.execute('delete from my_' + _type + '_client_contact where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
					}
				} else {
					db.execute('delete from my_' + _type + '_client_contact where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _remove_old_data_and_save_error_info_for_job_client_contact');
				return;
			}
		}
		function _remove_old_data_and_save_error_info_for_job_site_contact(db, temp_result, new_selected_job_id, new_selected_job_reference_number) {
			try {
				if ((temp_result.job_site_contact_error != undefined) && (temp_result.job_site_contact_error.length > 0)) {
					var temp_job_site_contact_id_array = [];
					var temp_job_site_contact_message_array = [];
					for ( var i = 0, j = temp_result.job_site_contact_error.length; i < j; i++) {
						if (parseInt(temp_result.job_site_contact_error[i].id, 10) > 0) {
							temp_job_site_contact_id_array.push(temp_result.job_site_contact_error[i].id);
							var temp_error_str = '';
							for ( var m = 0, n = temp_result.job_site_contact_error[i].error.length; m < n; m++) {
								if (m === 0) {
									temp_error_str = 'Site Contact:' + temp_result.job_site_contact_error[i].error[m];
								} else {
									temp_error_str += '\n' + 'Site Contact:' + temp_result.job_site_contact_error[i].error[m];
								}
							}
							temp_job_site_contact_message_array.push(temp_error_str);
						}
					}
					if (temp_job_site_contact_id_array.length > 0) {
						db.execute('delete from my_' + _type + '_site_contact where ' + _type + '_id=? and id > 1000000000 and id not in (' + temp_job_site_contact_id_array.join(',') + ')', _selected_job_id);
						db.execute('UPDATE my_' + _type + '_site_contact  SET ' + _type + '_id=? WHERE id>1000000000 and id in (' + temp_job_site_contact_id_array.join(',') + ')', new_selected_job_id);
						for (i = 0, j = temp_job_site_contact_id_array.length; i < j; i++) {
							_save_error_info_to_database_after_save_to_office(db, temp_job_site_contact_message_array[i], temp_job_site_contact_id_array[i], new_selected_job_id, new_selected_job_reference_number);
						}
						Ti.App.Properties.setBool('update_job_status_with_error', true);
					} else {
						db.execute('delete from my_' + _type + '_site_contact where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
					}
				} else {
					db.execute('delete from my_' + _type + '_site_contact where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _remove_old_data_and_save_error_info_for_job_site_contact');
				return;
			}
		}
		function _remove_old_data_and_save_error_info_for_job_assigned_user(db, temp_result, new_selected_job_id, new_selected_job_reference_number) {
			try {
				if ((temp_result.job_assigned_user_error != undefined) && (temp_result.job_assigned_user_error.length > 0)) {
					var temp_job_assigned_user_id_array = [];
					var temp_job_assigned_user_message_array = [];
					for ( var i = 0, j = temp_result.job_assigned_user_error.length; i < j; i++) {
						if (parseInt(temp_result.job_assigned_user_error[i].id, 10) > 0) {
							temp_job_assigned_user_id_array.push(temp_result.job_assigned_user_error[i].id);
							var temp_error_str = '';
							for ( var m = 0, n = temp_result.job_assigned_user_error[i].error.length; m < n; m++) {
								if (m === 0) {
									temp_error_str = 'Assigned User:' + temp_result.job_assigned_user_error[i].error[m];
								} else {
									temp_error_str += '\n' + 'Assigned User:' + temp_result.job_assigned_user_error[i].error[m];
								}
							}
							temp_job_assigned_user_message_array.push(temp_error_str);
						}
					}
					if (temp_job_assigned_user_id_array.length > 0) {
						db.execute('delete from my_' + _type + '_assigned_user where ' + _type + '_id=? and id > 1000000000 and id not in (' + temp_job_assigned_user_id_array.join(',') + ')', _selected_job_id);
						db.execute('UPDATE my_' + _type + '_assigned_user  SET ' + _type + '_id=? WHERE id>1000000000 and id in (' + temp_job_assigned_user_id_array.join(',') + ')', new_selected_job_id);
						for (i = 0, j = temp_job_assigned_user_id_array.length; i < j; i++) {
							_save_error_info_to_database_after_save_to_office(db, temp_job_assigned_user_message_array[i], temp_job_assigned_user_id_array[i], new_selected_job_id, new_selected_job_reference_number);
						}
						Ti.App.Properties.setBool('update_job_status_with_error', true);
					} else {
						db.execute('delete from my_' + _type + '_assigned_user where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
					}
				} else {
					db.execute('delete from my_' + _type + '_assigned_user where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _remove_old_data_and_save_error_info_for_job_assigned_user');
				return;
			}
		}
		function _remove_old_data_and_save_error_info_for_job_note(db, temp_result, new_selected_job_id, new_selected_job_reference_number) {
			try {
				if ((temp_result.job_note_error != undefined) && (temp_result.job_note_error.length > 0)) {
					var temp_job_note_id_array = [];
					var temp_job_note_message_array = [];
					for ( var i = 0, j = temp_result.job_note_error.length; i < j; i++) {
						if (parseInt(temp_result.job_note_error[i].id, 10) > 0) {
							temp_job_note_id_array.push(temp_result.job_note_error[i].id);
							var temp_error_str = '';
							for ( var m = 0, n = temp_result.job_note_error[i].error.length; m < n; m++) {
								if (m === 0) {
									temp_error_str = 'Note:' + temp_result.job_note_error[i].error[m];
								} else {
									temp_error_str += '\n' + 'Note:' + temp_result.job_note_error[i].error[m];
								}
							}
							temp_job_note_message_array.push(temp_error_str);
						}
					}
					if (temp_job_note_id_array.length > 0) {
						db.execute('delete from my_' + _type + '_note where ' + _type + '_id=? and id > 1000000000 and id not in (' + temp_job_note_id_array.join(',') + ')', _selected_job_id);
						db.execute('UPDATE my_' + _type + '_note  SET ' + _type + '_id=? WHERE id>1000000000 and id in (' + temp_job_note_id_array.join(',') + ')', new_selected_job_id);
						for (i = 0, j = temp_job_note_id_array.length; i < j; i++) {
							_save_error_info_to_database_after_save_to_office(db, temp_job_note_message_array[i], temp_job_note_id_array[i], new_selected_job_id, new_selected_job_reference_number);
						}
						Ti.App.Properties.setBool('update_job_status_with_error', true);
					} else {
						db.execute('delete from my_' + _type + '_note where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
					}
				} else {
					db.execute('delete from my_' + _type + '_note where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _remove_old_data_and_save_error_info_for_job_note');
				return;
			}
		}
		function _remove_old_data_and_save_error_info_for_job_asset(db, temp_result, new_selected_job_id, new_selected_job_reference_number, oversize_asset_list_string) {
			try {
				var oversize_asset_list = JSON.parse(oversize_asset_list_string);// oversize
				// files,
				// some
				// files
				// which
				// size
				// is
				// too
				// bigger,
				// can't
				// upload
				// to
				// server.'
				var temp_job_asset_id_array = [];
				if (oversize_asset_list != undefined && oversize_asset_list != null) {
					for ( var i = 0, j = oversize_asset_list.length; i < j; i++) {
						temp_job_asset_id_array.push(oversize_asset_list[i].id);
					}
				}
				if ((temp_result.job_asset_error != undefined) && (temp_result.job_asset_error.length > 0)) {
					var temp_job_asset_error_id_array = [];
					var temp_job_asset_message_array = [];
					for (i = 0, j = temp_result.job_asset_error.length; i < j; i++) {
						if (parseInt(temp_result.job_asset_error[i].id, 10) > 0) {
							temp_job_asset_error_id_array.push(temp_result.job_asset_error[i].id);
							var temp_error_str = '';
							for ( var m = 0, n = temp_result.job_asset_error[i].error.length; m < n; m++) {
								if (m === 0) {
									temp_error_str = 'Media File:' + temp_result.job_asset_error[i].error[m];
								} else {
									temp_error_str += '\n' + 'Media File:' + temp_result.job_asset_error[i].error[m];
								}
							}
							temp_job_asset_message_array.push(temp_error_str);
						}
					}
					if (temp_job_asset_error_id_array.length > 0) {
						if (temp_job_asset_id_array.length > 0) {
							db.execute('delete from my_' + _type + '_asset where ' + _type + '_id=? and id > 1000000000 and is_local_record=1 and id not in (' + temp_job_asset_error_id_array.join(',') + ',' + temp_job_asset_id_array.join(',') + ')', _selected_job_id);
							db.execute('UPDATE my_' + _type + '_asset  SET ' + _type + '_id=? WHERE id>1000000000 and id in (' + temp_job_asset_error_id_array.join(',') + ',' + temp_job_asset_id_array.join(',') + ')', new_selected_job_id);
						} else {
							db.execute('delete from my_' + _type + '_asset where ' + _type + '_id=? and id > 1000000000 and is_local_record=1 and id not in (' + temp_job_asset_error_id_array.join(',') + ')', _selected_job_id);
							db.execute('UPDATE my_' + _type + '_asset  SET ' + _type + '_id=? WHERE id>1000000000 and id in (' + temp_job_asset_error_id_array.join(',') + ')', new_selected_job_id);
						}
						for (i = 0, j = temp_job_asset_error_id_array.length; i < j; i++) {
							_save_error_info_to_database_after_save_to_office(db, temp_job_asset_message_array[i], temp_job_asset_error_id_array[i], new_selected_job_id, new_selected_job_reference_number);
						}
						Ti.App.Properties.setBool('update_job_status_with_error', true);
					} else {
						if (temp_job_asset_id_array.length > 0) {
							db.execute('delete from my_' + _type + '_asset where ' + _type + '_id=? and id > 1000000000 and is_local_record=1 and id not in (' + temp_job_asset_id_array.join(',') + ')', _selected_job_id);
							db.execute('UPDATE my_' + _type + '_asset  SET ' + _type + '_id=? WHERE id>1000000000 and id in (' + temp_job_asset_id_array.join(',') + ')', new_selected_job_id);
						} else {
							db.execute('delete from my_' + _type + '_asset where ' + _type + '_id=? and id > 1000000000 and is_local_record=1', _selected_job_id);
						}
					}
				} else {
					if (temp_job_asset_id_array.length > 0) {
						db.execute('delete from my_' + _type + '_asset where ' + _type + '_id=? and id > 1000000000 and is_local_record=1 and id not in (' + temp_job_asset_id_array.join(',') + ')', _selected_job_id);
						db.execute('UPDATE my_' + _type + '_asset  SET ' + _type + '_id=? WHERE id>1000000000 and id in (' + temp_job_asset_id_array.join(',') + ')', new_selected_job_id);
					} else {
						db.execute('delete from my_' + _type + '_asset where ' + _type + '_id=? and id > 1000000000 and is_local_record=1', _selected_job_id);
					}
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _remove_old_data_and_save_error_info_for_job_asset');
				return;
			}
		}
		function _remove_old_data_and_save_error_info_for_job_assigned_item(db, temp_result, new_selected_job_id, new_selected_job_reference_number) {
			try {
				if ((temp_result.job_assigned_item_error != undefined) && (temp_result.job_assigned_item_error.length > 0)) {
					var temp_job_assigned_item_id_array = [];
					var temp_job_assigned_item_message_array = [];
					for ( var i = 0, j = temp_result.job_assigned_item_error.length; i < j; i++) {
						if (parseInt(temp_result.job_assigned_item_error[i].id, 10) > 0) {
							temp_job_assigned_item_id_array.push(temp_result.job_assigned_item_error[i].id);
							var temp_error_str = '';
							for ( var m = 0, n = temp_result.job_assigned_item_error[i].error.length; m < n; m++) {
								if (m === 0) {
									temp_error_str = 'Assigned Material Item:' + temp_result.job_assigned_item_error[i].error[m];
								} else {
									temp_error_str += '\n' + 'Assgiend Material Item:' + temp_result.job_assigned_item_error[i].error[m];
								}
							}
							temp_job_assigned_item_message_array.push(temp_error_str);
						}
					}
					if (temp_job_assigned_item_id_array.length > 0) {
						db.execute('delete from my_' + _type + '_assigned_item where ' + _type + '_id=? and id > 1000000000 and id not in (' + temp_job_assigned_item_id_array.join(',') + ')', _selected_job_id);
						db.execute('UPDATE my_' + _type + '_assigned_item  SET ' + _type + '_id=? WHERE id>1000000000 and id in (' + temp_job_assigned_item_id_array.join(',') + ')', new_selected_job_id);
						for (i = 0, j = temp_job_assigned_item_id_array.length; i < j; i++) {
							_save_error_info_to_database_after_save_to_office(db, temp_job_assigned_item_message_array[i], temp_job_assigned_item_id_array[i], new_selected_job_id, new_selected_job_reference_number);
						}
						Ti.App.Properties.setBool('update_job_status_with_error', true);
					} else {
						db.execute('delete from my_' + _type + '_assigned_item where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
					}
				} else {
					db.execute('delete from my_' + _type + '_assigned_item where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _remove_old_data_and_save_error_info_for_job_assigned_item');
				return;
			}
		}
		function _remove_old_data_and_save_error_info_for_job_invoice(db, temp_result, new_selected_job_id, new_selected_job_reference_number) {
			try {
				if ((temp_result.job_invoice_error != undefined) && (temp_result.job_invoice_error.length > 0)) {
					var temp_job_invoice_id_array = [];
					var temp_job_invoice_message_array = [];
					for ( var i = 0, j = temp_result.job_invoice_error.length; i < j; i++) {
						if (parseInt(temp_result.job_invoice_error[i].id, 10) > 0) {
							temp_job_invoice_id_array.push(temp_result.job_invoice_error[i].id);
							var temp_error_str = '';
							for ( var m = 0, n = temp_result.job_invoice_error[i].error.length; m < n; m++) {
								if (m === 0) {
									temp_error_str = 'Invoice:' + temp_result.job_invoice_error[i].error[m];
								} else {
									temp_error_str += '\n' + 'Invoice:' + temp_result.job_invoice_error[i].error[m];
								}
							}
							temp_job_invoice_message_array.push(temp_error_str);
						}
					}
					if (temp_job_invoice_id_array.length > 0) {
						db.execute('delete from my_' + _type + '_invoice where ' + _type + '_id=? and id > 1000000000 and id not in (' + temp_job_invoice_id_array.join(',') + ')', _selected_job_id);
						db.execute('UPDATE my_' + _type + '_invoice  SET ' + _type + '_id=? WHERE id>1000000000 and id in (' + temp_job_invoice_id_array.join(',') + ')', new_selected_job_id);
						for (i = 0, j = temp_job_invoice_id_array.length; i < j; i++) {
							_save_error_info_to_database_after_save_to_office(db, temp_job_invoice_message_array[i], temp_job_invoice_id_array[i], new_selected_job_id, new_selected_job_reference_number);
						}
						Ti.App.Properties.setBool('update_job_status_with_error', true);
					} else {
						db.execute('delete from my_' + _type + '_invoice where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
					}
				} else {
					db.execute('delete from my_' + _type + '_invoice where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _remove_old_data_and_save_error_info_for_job_invoice');
				return;
			}
		}
		function _remove_old_data_and_save_error_info_for_job_invoice_signature(db, temp_result, new_selected_job_id, new_selected_job_reference_number) {
			try {
				if ((temp_result.job_invoice_signature_error != undefined) && (temp_result.job_invoice_signature_error.length > 0)) {
					var temp_job_invoice_signature_id_array = [];
					var temp_job_invoice_signature_message_array = [];
					for ( var i = 0, j = temp_result.job_invoice_signature_error.length; i < j; i++) {
						if (parseInt(temp_result.job_invoice_signature_error[i].id, 10) > 0) {
							temp_job_invoice_signature_id_array.push(temp_result.job_invoice_signature_error[i].id);
							var temp_error_str = '';
							for ( var m = 0, n = temp_result.job_invoice_signature_error[i].error.length; m < n; m++) {
								if (m === 0) {
									temp_error_str = 'Signature:' + temp_result.job_invoice_signature_error[i].error[m];
								} else {
									temp_error_str += '\n' + 'Signature:' + temp_result.job_invoice_signature_error[i].error[m];
								}
							}
							temp_job_invoice_signature_message_array.push(temp_error_str);
						}
					}
					if (temp_job_invoice_signature_id_array.length > 0) {
						db.execute('delete from my_' + _type + '_invoice_signature where ' + _type + '_id=? and id > 1000000000 and id not in (' + temp_job_invoice_signature_id_array.join(',') + ')', _selected_job_id);
						db.execute('UPDATE my_' + _type + '_invoice_signature  SET ' + _type + '_id=? WHERE id>1000000000 and id in (' + temp_job_invoice_signature_id_array.join(',') + ')', new_selected_job_id);
						for (i = 0, j = temp_job_invoice_signature_id_array.length; i < j; i++) {
							_save_error_info_to_database_after_save_to_office(db, temp_job_invoice_signature_message_array[i], temp_job_invoice_signature_id_array[i], new_selected_job_id, new_selected_job_reference_number);
						}
						Ti.App.Properties.setBool('update_job_status_with_error', true);
					} else {
						db.execute('delete from my_' + _type + '_invoice_signature where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
					}
				} else {
					db.execute('delete from my_' + _type + '_invoice_signature where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _remove_old_data_and_save_error_info_for_job_invoice_signature');
				return;
			}
		}
		function _remove_old_data_and_save_error_info_for_job_invoice_locksmith_signature(db, temp_result, new_selected_job_id, new_selected_job_reference_number) {
			try {
				if ((temp_result.job_invoice_locksmith_signature_error != undefined) && (temp_result.job_invoice_locksmith_signature_error.length > 0)) {
					var temp_job_invoice_locksmith_signature_id_array = [];
					var temp_job_invoice_locksmith_signature_message_array = [];
					for ( var i = 0, j = temp_result.job_invoice_locksmith_signature_error.length; i < j; i++) {
						if (parseInt(temp_result.job_invoice_locksmith_signature_error[i].id, 10) > 0) {
							temp_job_invoice_locksmith_signature_id_array.push(temp_result.job_invoice_locksmith_signature_error[i].id);
							var temp_error_str = '';
							for ( var m = 0, n = temp_result.job_invoice_locksmith_signature_error[i].error.length; m < n; m++) {
								if (m === 0) {
									temp_error_str = 'Signature:' + temp_result.job_invoice_locksmith_signature_error[i].error[m];
								} else {
									temp_error_str += '\n' + 'Signature:' + temp_result.job_invoice_locksmith_signature_error[i].error[m];
								}
							}
							temp_job_invoice_locksmith_signature_message_array.push(temp_error_str);
						}
					}
					if (temp_job_invoice_locksmith_signature_id_array.length > 0) {
						db.execute('delete from my_' + _type + '_invoice_locksmith_signature where ' + _type + '_id=? and id > 1000000000 and id not in (' + temp_job_invoice_locksmith_signature_id_array.join(',') + ')', _selected_job_id);
						db.execute('UPDATE my_' + _type + '_invoice_locksmith_signature  SET ' + _type + '_id=? WHERE id>1000000000 and id in (' + temp_job_invoice_locksmith_signature_id_array.join(',') + ')', new_selected_job_id);
						for (i = 0, j = temp_job_invoice_locksmith_signature_id_array.length; i < j; i++) {
							_save_error_info_to_database_after_save_to_office(db, temp_job_invoice_locksmith_signature_message_array[i], temp_job_invoice_locksmith_signature_id_array[i], new_selected_job_id, new_selected_job_reference_number);
						}
						Ti.App.Properties.setBool('update_job_status_with_error', true);
					} else {
						db.execute('delete from my_' + _type + '_invoice_locksmith_signature where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
					}
				} else {
					db.execute('delete from my_' + _type + '_invoice_locksmith_signature where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _remove_old_data_and_save_error_info_for_job_invoice_locksmith_signature');
				return;
			}
		}
		function _remove_old_data_and_save_error_info_for_job_custom_report(db, temp_result, new_selected_job_id, new_selected_job_reference_number) {
			try {
				if ((temp_result.job_custom_report_error != undefined) && (temp_result.job_custom_report_error.length > 0)) {
					var temp_job_custom_report_id_data_array = [];
					var temp_job_custom_report_data_message_array = [];
					for ( var i = 0, j = temp_result.job_custom_report_error.length; i < j; i++) {
						if (parseInt(temp_result.job_custom_report_error[i].id, 10) > 0) {
							temp_job_custom_report_id_data_array.push(temp_result.job_custom_report_error[i].id);
							var temp_error_str = '';
							for ( var m = 0, n = temp_result.job_custom_report_error[i].error.length; m < n; m++) {
								if (m === 0) {
									temp_error_str = 'Custom Report:' + temp_result.job_custom_report_error[i].error[m];
								} else {
									temp_error_str += '\n' + 'Custom Report:' + temp_result.job_custom_report_error[i].error[m];
								}
							}
							temp_job_custom_report_data_message_array.push(temp_error_str);
						}
					}
					if (temp_job_custom_report_id_data_array.length > 0) {
						db.execute('delete from my_' + _type + '_custom_report_data where ' + _type + '_id=? and id > 1000000000 and id not in (' + temp_job_custom_report_id_data_array.join(',') + ')', _selected_job_id);
						db.execute('UPDATE my_' + _type + '_custom_report_data  SET ' + _type + '_id=? WHERE id>1000000000 and id in (' + temp_job_custom_report_id_data_array.join(',') + ')', new_selected_job_id);
						for (i = 0, j = temp_job_custom_report_id_data_array.length; i < j; i++) {
							_save_error_info_to_database_after_save_to_office(db, temp_job_custom_report_data_message_array[i], temp_job_custom_report_id_data_array[i], new_selected_job_id, new_selected_job_reference_number);
						}
						Ti.App.Properties.setBool('update_job_status_with_error', true);
					} else {
						db.execute('delete from my_' + _type + '_custom_report_data where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
					}
				} else {
					db.execute('delete from my_' + _type + '_custom_report_data where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _remove_old_data_and_save_error_info_for_job_custom_report');
				return;
			}
		}
		function _remove_old_data_and_save_error_info_for_job_custom_report_signature(db, temp_result, new_selected_job_id, new_selected_job_reference_number) {
			try {
				if ((temp_result.job_custom_report_signature_error != undefined) && (temp_result.job_custom_report_signature_error.length > 0)) {
					var temp_job_custom_report_signature_id_array = [];
					var temp_job_custom_report_signature_message_array = [];
					for ( var i = 0, j = temp_result.job_custom_report_signature_error.length; i < j; i++) {
						if (parseInt(temp_result.job_invoice_signature_error[i].id, 10) > 0) {
							temp_job_custom_report_signature_id_array.push(temp_result.job_custom_report_signature_error[i].id);
							var temp_error_str = '';
							for ( var m = 0, n = temp_result.job_custom_report_signature_error[i].error.length; m < n; m++) {
								if (m === 0) {
									temp_error_str = 'Custom Report Signature:' + temp_result.job_custom_report_signature_error[i].error[m];
								} else {
									temp_error_str += '\n' + 'Custom Report Signature:' + temp_result.job_custom_report_signature_error[i].error[m];
								}
							}
							temp_job_custom_report_signature_message_array.push(temp_error_str);
						}
					}
					if (temp_job_custom_report_signature_id_array.length > 0) {
						db.execute('delete from my_' + _type + '_custom_report_signature where ' + _type + '_id=? and id > 1000000000 and id not in (' + temp_job_custom_report_signature_id_array.join(',') + ')', _selected_job_id);
						db.execute('UPDATE my_' + _type + '_custom_report_signature  SET ' + _type + '_id=? WHERE id>1000000000 and id in (' + temp_job_custom_report_signature_id_array.join(',') + ')', new_selected_job_id);
						for (i = 0, j = temp_job_custom_report_signature_id_array.length; i < j; i++) {
							_save_error_info_to_database_after_save_to_office(db, temp_job_custom_report_signature_message_array[i], temp_job_custom_report_signature_id_array[i], new_selected_job_id, new_selected_job_reference_number);
						}
						Ti.App.Properties.setBool('update_job_status_with_error', true);
					} else {
						db.execute('delete from my_' + _type + '_custom_report_signature where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
					}
				} else {
					db.execute('delete from my_' + _type + '_custom_report_signature where ' + _type + '_id=? and id > 1000000000', _selected_job_id);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _remove_old_data_and_save_error_info_for_job_custom_report_signature');
				return;
			}
		}
		
		function _save_error_info_to_database_after_save_to_office(db, message, updating_id, new_selected_job_id, new_selected_job_reference_number) {
			try {
				// save error info to database
				var d = new Date();
				db.execute('INSERT INTO my_updating_errors_for_data (id,user_id,company_id,type,message,updating_id,relation_id,relation_reference_number,is_read,created)' + 'VALUES(?,?,?,?,?,?,?,?,?,?)', parseInt(d.getTime(), 10), _selected_user_id, _selected_company_id, _type, message, updating_id, new_selected_job_id, new_selected_job_reference_number, 0, parseInt(d.getTime() / 1000, 10));
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _save_error_info_to_database_after_save_to_office');
				return;
			}
		}
		function _update_media_file_name_and_add_to_upload_queue_after_save_to_office(asset_list_string, oversize_asset_list_string, new_selected_job_id, new_selected_job_reference_number) {
			try {
				// available files for uploading
				var asset_list = JSON.parse(asset_list_string);
				
				// oversize
				// files,
				// some
				// files
				// which
				// size
				// is
				// too
				// bigger,
				// can't
				// upload
				// to
				// server.'
				var oversize_asset_list = JSON.parse(oversize_asset_list_string);
				
				// update local asset folder, if it is new job
				
				var asset_folder = Ti.Filesystem.getFile(self.file_directory + _selected_company_id + '/' + _type, _selected_job_reference_number);
				if (asset_folder.exists()) {
					if (new_selected_job_reference_number != _selected_job_reference_number) {
						asset_folder.rename(new_selected_job_reference_number);
					}
				}
				
				// rename files
				if (asset_list != null) {
					var db = Titanium.Database.open(self.get_db_name());
					db.execute('UPDATE my_' + _type + ' SET exist_any_changed=1 WHERE id=?', new_selected_job_id);
					for ( var i = 0, j = asset_list.length; i < j; i++) {
						if (asset_list[i].status_code != 2) {
							// update upload record
							// table,
							// add new record
							var d = new Date();
							var id = parseInt(d.getTime(), 10);
							var row = db.execute('SELECT * FROM my_updating_records_for_data WHERE id=?', id);
							if (row.getRowCount() <= 0) {
								var asset_type_name = 'File';
								var temp_row = null;
								if (_type === 'job') {
									temp_row = db.execute('SELECT * FROM my_' + _type + '_asset_type_code where code=?', asset_list[i].job_asset_type_code);
								} else {
									temp_row = db.execute('SELECT * FROM my_' + _type + '_asset_type_code where code=?', asset_list[i].quote_asset_type_code);
								}
								if (temp_row.isValidRow()) {
									asset_type_name = temp_row.fieldByName('name');
								}
								temp_row.close();
								Ti.API.info('add to my_updating_records_for_data local_id:' + asset_list[i].local_id);
								db.execute('INSERT INTO my_updating_records_for_data (id,user_id,company_id,type,failure_times,upload_status,message,error_message,updating_id,table_name,relation_id,relation_reference_number,relation_id_field_name,relation_table,created)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', id, _selected_user_id, _selected_company_id, _type, 0, 0, 'Uploading Media Files ...', asset_type_name, asset_list[i].local_id,
												'my_' + _type + '_asset', new_selected_job_id, new_selected_job_reference_number, _type + '_id', 'my_' + _type, parseInt(d.getTime() / 1000, 10));
							}
						}
					}
					db.close();
					
					for (i = 0, j = asset_list.length; i < j; i++) {
						if ((asset_list[i].id > 1000000000) && (asset_list[i].path_original != '') && (asset_list[i].is_local_record === 1)) {
							var temp_path_original = asset_list[i].path_original;
							var temp_file_name_array = temp_path_original.split('/');
							var temp_asset_type_path = temp_file_name_array[temp_file_name_array.length - 2];
							var temp_file_folder_path = '';
							var temp_file_origin_name = temp_file_name_array[temp_file_name_array.length - 1];
							for ( var m = 0, n = temp_file_name_array.length - 1; m < n; m++) {
								if (m === 0) {
									temp_file_folder_path += temp_file_name_array[m];
								} else {
									temp_file_folder_path += '/' + temp_file_name_array[m];
								}
							}
							var temp_file_name_array2 = temp_file_name_array[temp_file_name_array.length - 1].split('_');
							var mediafile = Ti.Filesystem.getFile(self.file_directory + _selected_company_id + '/' + _type + '/' + new_selected_job_reference_number + '/' + temp_asset_type_path, temp_file_origin_name);
							var real_file_name = new_selected_job_reference_number + '_' + temp_file_name_array2[temp_file_name_array2.length - 1];
							if (mediafile.exists()) {
								mediafile.rename(real_file_name);
							}
							var resize_media_file = Ti.Filesystem.getFile(self.file_directory + _selected_company_id + '/' + _type + '/' + new_selected_job_reference_number + '/' + temp_asset_type_path, 'resized_' + temp_file_origin_name);
							if (resize_media_file.exists()) {
								resize_media_file.rename('resized_' + real_file_name);
							}
							var thumb_media_file = Ti.Filesystem.getFile(self.file_directory + _selected_company_id + '/' + _type + '/' + new_selected_job_reference_number + '/' + temp_asset_type_path, 'thumb_' + temp_file_origin_name);
							if (thumb_media_file.exists()) {
								thumb_media_file.rename('thumb_' + real_file_name);
							}
							mediafile = Ti.Filesystem.getFile(self.file_directory + _selected_company_id + '/' + _type + '/' + new_selected_job_reference_number + '/' + temp_asset_type_path, real_file_name);
						}
					}
				}
				
				if (oversize_asset_list != undefined && oversize_asset_list != null) {
					for (i = 0, j = oversize_asset_list.length; i < j; i++) {
						if ((oversize_asset_list[i].id > 1000000000) && (oversize_asset_list[i].path_original != '') && (oversize_asset_list[i].is_local_record === 1)) {
							temp_path_original = oversize_asset_list[i].path_original;
							temp_file_name_array = temp_path_original.split('/');
							temp_asset_type_path = temp_file_name_array[temp_file_name_array.length - 2];
							temp_file_folder_path = '';
							temp_file_origin_name = temp_file_name_array[temp_file_name_array.length - 1];
							for (m = 0, n = temp_file_name_array.length - 1; m < n; m++) {
								if (m === 0) {
									temp_file_folder_path += temp_file_name_array[m];
								} else {
									temp_file_folder_path += '/' + temp_file_name_array[m];
								}
							}
							temp_file_name_array2 = temp_file_name_array[temp_file_name_array.length - 1].split('_');
							mediafile = Ti.Filesystem.getFile(self.file_directory + _selected_company_id + '/' + _type + '/' + new_selected_job_reference_number + '/' + temp_asset_type_path, temp_file_origin_name);
							real_file_name = new_selected_job_reference_number + '_' + temp_file_name_array2[temp_file_name_array2.length - 1];
							if (mediafile.exists()) {
								mediafile.rename(real_file_name);
							}
							resize_media_file = Ti.Filesystem.getFile(self.file_directory + _selected_company_id + '/' + _type + '/' + new_selected_job_reference_number + '/' + temp_asset_type_path, 'resized_' + temp_file_origin_name);
							if (resize_media_file.exists()) {
								resize_media_file.rename('resized_' + real_file_name);
							}
							thumb_media_file = Ti.Filesystem.getFile(self.file_directory + _selected_company_id + '/' + _type + '/' + new_selected_job_reference_number + '/' + temp_asset_type_path, 'thumb_' + temp_file_origin_name);
							if (thumb_media_file.exists()) {
								thumb_media_file.rename('thumb_' + real_file_name);
							}
							mediafile = Ti.Filesystem.getFile(self.file_directory + _selected_company_id + '/' + _type + '/' + new_selected_job_reference_number + '/' + temp_asset_type_path, real_file_name);
						}
					}
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _update_media_file_name_and_add_to_upload_queue_after_save_to_office');
				return;
			}
		}
		function _update_invoice_signature_file_name_and_add_to_upload_queue_after_save_to_office(invoice_signature_list_string, new_selected_job_id, new_selected_job_reference_number) {
			try {
				var invoice_signature_list = JSON.parse(invoice_signature_list_string);
				// update local asset folder, if it is new job
				
				var signature_folder = Ti.Filesystem.getFile(self.file_directory + _selected_company_id + '/' + _type, _selected_job_reference_number + '/invoice_signature');
				if (signature_folder.exists()) {
					if (new_selected_job_reference_number != _selected_job_reference_number) {
						signature_folder.rename(new_selected_job_reference_number);
					}
				}
				// rename files
				if (invoice_signature_list != null) {
					var db = Titanium.Database.open(self.get_db_name());
					db.execute('UPDATE my_' + _type + ' SET exist_any_changed=1 WHERE id=?', new_selected_job_id);
					for ( var i = 0, j = invoice_signature_list.length; i < j; i++) {
						// update upload record table,
						// add new record
						var d = new Date();
						var id = parseInt(d.getTime(), 10);
						var row = db.execute('SELECT * FROM my_updating_records_for_data WHERE id=?', id);
						if (row.getRowCount() <= 0) {
							db.execute('INSERT INTO my_updating_records_for_data (id,user_id,company_id,type,failure_times,upload_status,message,error_message,updating_id,table_name,relation_id,relation_reference_number,relation_id_field_name,relation_table,created)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', id, _selected_user_id, _selected_company_id, _type, 0, 0, 'Uploading Signature Files ...', 'Signature', invoice_signature_list[i].local_id, 'my_' + _type
											+ '_invoice_signature', new_selected_job_id, new_selected_job_reference_number, _type + '_id', 'my_' + _type, parseInt(d.getTime() / 1000, 10));
						}
					}
					db.close();
					for (i = 0, j = invoice_signature_list.length; i < j; i++) {
						if ((invoice_signature_list[i].id > 1000000000) && (invoice_signature_list[i].path != '') && (invoice_signature_list[i].is_local_record == 1)) {
							var temp_path_original = invoice_signature_list[i].path;
							var temp_file_name_array = temp_path_original.split('/');
							var temp_asset_type_path = temp_file_name_array[temp_file_name_array.length - 2];
							var temp_file_folder_path = '';
							var temp_file_origin_name = temp_file_name_array[temp_file_name_array.length - 1];
							for ( var m = 0, n = temp_file_name_array.length - 1; m < n; m++) {
								if (m === 0) {
									temp_file_folder_path += temp_file_name_array[m];
								} else {
									temp_file_folder_path += '/' + temp_file_name_array[m];
								}
							}
							var temp_file_name_array2 = temp_file_name_array[temp_file_name_array.length - 1].split('_');
							var mediafile = Ti.Filesystem.getFile(self.file_directory + _selected_company_id + '/' + _type + '/' + new_selected_job_reference_number + '/' + temp_asset_type_path, temp_file_origin_name);
							var real_file_name = new_selected_job_reference_number + '_' + temp_file_name_array2[temp_file_name_array2.length - 1];
							if (mediafile.exists()) {
								mediafile.rename(real_file_name);
							}
							mediafile = Ti.Filesystem.getFile(self.file_directory + _selected_company_id + '/' + _type + '/' + new_selected_job_reference_number + '/' + temp_asset_type_path, real_file_name);
						}
					}
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _update_invoice_signature_file_name_and_add_to_upload_queue_after_save_to_office');
				return;
			}
		}
		function _update_report_signature_file_name_and_add_to_upload_queue_after_save_to_office(report_signature_list_string, new_selected_job_id, new_selected_job_reference_number) {
			try {
				var report_signature_list = JSON.parse(report_signature_list_string);
				// update local asset folder, if it is new job
				
				var signature_folder = Ti.Filesystem.getFile(self.file_directory + _selected_company_id + '/' + _type, _selected_job_reference_number + '/report_signature');
				if (signature_folder.exists()) {
					if (new_selected_job_reference_number != _selected_job_reference_number) {
						signature_folder.rename(new_selected_job_reference_number);
					}
				}
				// rename files
				if (report_signature_list != null) {
					var db = Titanium.Database.open(self.get_db_name());
					db.execute('UPDATE my_' + _type + ' SET exist_any_changed=1 WHERE id=?', new_selected_job_id);
					for ( var i = 0, j = report_signature_list.length; i < j; i++) {
						// update upload record table,
						// add new record
						var d = new Date();
						var id = parseInt(d.getTime(), 10);
						var row = db.execute('SELECT * FROM my_updating_records_for_data WHERE id=?', id);
						if (row.getRowCount() <= 0) {
							db.execute('INSERT INTO my_updating_records_for_data (id,user_id,company_id,type,failure_times,upload_status,message,error_message,updating_id,table_name,relation_id,relation_reference_number,relation_id_field_name,relation_table,created)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', id, _selected_user_id, _selected_company_id, _type, 0, 0, 'Uploading Signature Files ...', 'Signature', report_signature_list[i].local_id, 'my_' + _type
											+ '_custom_report_signature', new_selected_job_id, new_selected_job_reference_number, _type + '_id', 'my_' + _type, parseInt(d.getTime() / 1000, 10));
							self.temp_number++;
						}
					}
					db.close();
					for (i = 0, j = report_signature_list.length; i < j; i++) {
						if ((report_signature_list[i].id > 1000000000) && (report_signature_list[i].path != '') && (report_signature_list[i].is_local_record == 1)) {
							var temp_path_original = report_signature_list[i].path;
							var temp_file_name_array = temp_path_original.split('/');
							var temp_asset_type_path = temp_file_name_array[temp_file_name_array.length - 2];
							var temp_file_folder_path = '';
							var temp_file_origin_name = temp_file_name_array[temp_file_name_array.length - 1];
							for ( var m = 0, n = temp_file_name_array.length - 1; m < n; m++) {
								if (m === 0) {
									temp_file_folder_path += temp_file_name_array[m];
								} else {
									temp_file_folder_path += '/' + temp_file_name_array[m];
								}
							}
							var temp_file_name_array2 = temp_file_name_array[temp_file_name_array.length - 1].split('_');
							var mediafile = Ti.Filesystem.getFile(self.file_directory + _selected_company_id + '/' + _type + '/' + new_selected_job_reference_number + '/' + temp_asset_type_path, temp_file_origin_name);
							var real_file_name = new_selected_job_reference_number + '_' + temp_file_name_array2[temp_file_name_array2.length - 1];
							if (mediafile.exists()) {
								mediafile.rename(real_file_name);
							}
							mediafile = Ti.Filesystem.getFile(self.file_directory + _selected_company_id + '/' + _type + '/' + new_selected_job_reference_number + '/' + temp_asset_type_path, real_file_name);
						}
					}
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _update_report_signature_file_name_and_add_to_upload_queue_after_save_to_office');
				return;
			}
		}
		function _setup_job_operation_log_for_upload(db) {
			try {
				var operation_log_list = [];
				var data_rows = db.execute('SELECT * FROM my_' + _type + '_operation_log WHERE changed=1 and ' + _type + '_id=?', _selected_job_id);
				if (data_rows.getRowCount() > 0) {
					while (data_rows.isValidRow()) {
						var temp_var = {
							'id' : data_rows.fieldByName('id'),
							'local_id' : data_rows.fieldByName('local_id'),
							'job_id' : (_type == 'job') ? _selected_job_id : 0,
							'quote_id' : (_type == 'quote') ? _selected_job_id : 0,
							'job_operation_log_type_code' : (_type == 'job') ? data_rows.fieldByName('job_operation_log_type_code') : '',
							'quote_operation_log_type_code' : (_type == 'quote') ? data_rows.fieldByName('quote_operation_log_type_code') : '',
							'manager_user_id' : data_rows.fieldByName('manager_user_id'),
							'description' : 'update job operation',
							'logged' : data_rows.fieldByName('logged'),
							'latitude' : data_rows.fieldByName('latitude'),
							'longitude' : data_rows.fieldByName('longitude'),
							'status_code' : data_rows.fieldByName('status_code')
						};
						operation_log_list.push(temp_var);
						data_rows.next();
					}
				}
				data_rows.close();
				if (operation_log_list.length > 0) {
					return JSON.stringify(operation_log_list);
				} else {
					return null;
				}
			} catch (err) {
				db.close();
				self.process_simple_error_message(err, window_source + ' - _setup_job_operation_log_for_upload');
				return false;
			}
		}
		function _setup_job_status_log_for_upload(db) {
			try {
				var status_log_list = [];
				var data_rows = db.execute('SELECT * FROM my_' + _type + '_status_log WHERE changed=1 and ' + _type + '_id=?', _selected_job_id);
				if (data_rows.getRowCount() > 0) {
					while (data_rows.isValidRow()) {
						var temp_var = {
							'id' : data_rows.fieldByName('id'),
							'local_id' : data_rows.fieldByName('local_id'),
							'job_id' : (_type === 'job') ? _selected_job_id : 0,
							'quote_id' : (_type === 'quote') ? _selected_job_id : 0,
							'job_status_code' : (_type === 'job') ? data_rows.fieldByName('job_status_code') : 0,
							'quote_status_code' : (_type === 'quote') ? data_rows.fieldByName('quote_status_code') : 0,
							'manager_user_id' : data_rows.fieldByName('manager_user_id'),
							'reason' : data_rows.fieldByName('reason'),
							'status_code' : data_rows.fieldByName('status_code')
						};
						status_log_list.push(temp_var);
						data_rows.next();
					}
				}
				data_rows.close();
				if (status_log_list.length > 0) {
					return JSON.stringify(status_log_list);
				} else {
					return null;
				}
			} catch (err) {
				db.close();
				self.process_simple_error_message(err, window_source + ' - _setup_job_status_log_for_upload');
				return null;
			}
		}
		function _setup_job_client_contact_for_upload(db) {
			try {
				var client_contact_list = [];
				var data_rows = db.execute('SELECT * FROM my_' + _type + '_client_contact WHERE changed=1 and ' + _type + '_id=?', _selected_job_id);
				if (data_rows.getRowCount() > 0) {
					while (data_rows.isValidRow()) {
						var temp_var = {
							'id' : data_rows.fieldByName('id'),
							'local_id' : data_rows.fieldByName('local_id'),
							'job_id' : (_type === 'job') ? _selected_job_id : 0,
							'quote_id' : (_type === 'quote') ? _selected_job_id : 0,
							'client_contact_id' : data_rows.fieldByName('client_contact_id'),
							'note' : (data_rows.fieldByName('note') === null) ? '' : data_rows.fieldByName('note'),
							'status_code' : (data_rows.fieldByName('status_code') === null) ? 0 : data_rows.fieldByName('status_code')
						};
						client_contact_list.push(temp_var);
						data_rows.next();
					}
				}
				data_rows.close();
				if (client_contact_list.length > 0) {
					return JSON.stringify(client_contact_list);
				} else {
					return null;
				}
			} catch (err) {
				db.close();
				self.process_simple_error_message(err, window_source + ' - _setup_job_client_contact_for_upload');
				return null;
			}
		}
		function _setup_job_site_contact_for_upload(db) {
			try {
				var site_contact_list = [];
				var data_rows = db.execute('SELECT * FROM my_' + _type + '_site_contact WHERE changed=1 and ' + _type + '_id=?', _selected_job_id);
				if (data_rows.getRowCount() > 0) {
					while (data_rows.isValidRow()) {
						var temp_var = {
							'id' : data_rows.fieldByName('id'),
							'local_id' : data_rows.fieldByName('local_id'),
							'job_id' : (_type === 'job') ? _selected_job_id : 0,
							'quote_id' : (_type === 'quote') ? _selected_job_id : 0,
							'salutation_code' : data_rows.fieldByName('salutation_code'),
							'first_name' : data_rows.fieldByName('first_name'),
							'last_name' : data_rows.fieldByName('last_name'),
							'phone_mobile' : data_rows.fieldByName('phone_mobile'),
							'phone_work' : data_rows.fieldByName('phone_work'),
							'phone' : data_rows.fieldByName('phone'),
							'email' : data_rows.fieldByName('email'),
							'note' : data_rows.fieldByName('note'),
							'is_primary_contact' : data_rows.fieldByName('is_primary_contact'),
							'status_code' : data_rows.fieldByName('status_code')
						};
						site_contact_list.push(temp_var);
						data_rows.next();
					}
				}
				data_rows.close();
				if (site_contact_list.length > 0) {
					return JSON.stringify(site_contact_list);
				} else {
					return null;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_job_site_contact_for_upload');
				return null;
			}
		}
		function _setup_job_assigned_user_for_upload(db) {
			try {
				var assigned_user_list = [];
				var data_rows = db.execute('SELECT * FROM my_' + _type + '_assigned_user WHERE changed=1 and ' + _type + '_id=?', _selected_job_id);
				if (data_rows.getRowCount() > 0) {
					while (data_rows.isValidRow()) {
						var temp_var = {
							'id' : data_rows.fieldByName('id'),
							'local_id' : data_rows.fieldByName('local_id'),
							'job_id' : (_type === 'job') ? _selected_job_id : 0,
							'quote_id' : (_type === 'quote') ? _selected_job_id : 0,
							'manager_user_id' : data_rows.fieldByName('manager_user_id'),
							'job_assigned_user_code' : data_rows.fieldByName('job_assigned_user_code'),
							'assigned_from' : data_rows.fieldByName('assigned_from'),
							'assigned_to' : data_rows.fieldByName('assigned_to'),
							'status_code' : data_rows.fieldByName('status_code')
						};
						assigned_user_list.push(temp_var);
						data_rows.next();
					}
				}
				data_rows.close();
				if (assigned_user_list.length > 0) {
					return JSON.stringify(assigned_user_list);
				} else {
					return null;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_job_assigned_user_for_upload');
				return null;
			}
		}
		function _setup_job_note_for_upload(db) {
			try {
				var note_list = [];
				var data_rows = db.execute('SELECT * FROM my_' + _type + '_note WHERE changed=1 and ' + _type + '_id=?', _selected_job_id);
				if (data_rows.getRowCount() > 0) {
					while (data_rows.isValidRow()) {
						var temp_var = {
							'id' : data_rows.fieldByName('id'),
							'local_id' : data_rows.fieldByName('local_id'),
							'job_id' : _selected_job_id,
							'quote_id' : _selected_job_id,
							'quote_note_type_code' : data_rows.fieldByName(_type + '_note_type_code'),
							'job_note_type_code' : data_rows.fieldByName(_type + '_note_type_code'),
							'description' : (data_rows.fieldByName('description') === null) ? '' : data_rows.fieldByName('description'),
							'status_code' : data_rows.fieldByName('status_code')
						};
						note_list.push(temp_var);
						data_rows.next();
					}
				}
				data_rows.close();
				if (note_list.length > 0) {
					return JSON.stringify(note_list);
				} else {
					return null;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_job_note_for_upload');
				return null;
			}
		}
		function _setup_job_asset_for_over_size_files(db) {
			try {
				var asset_list = [];
				var data_rows = db.execute('SELECT * FROM my_' + _type + '_asset WHERE changed=1 and ' + _type + '_id=? order by id asc', _selected_job_id);
				if (data_rows.getRowCount() > 0) {
					while (data_rows.isValidRow()) {
						var temp_upload_is_over_limit = false;
						if (data_rows.fieldByName('is_local_record')) {
							var tempFileSize = parseInt(data_rows.fieldByName('file_size'), 10);
							switch (data_rows.fieldByName('mime_type')){
								case 'image/jpeg':
									if (tempFileSize > parseInt(Titanium.App.Properties.getString('app_media_upload_limit_image'), 10)) {
										temp_upload_is_over_limit = true;
									}
									break;
								case 'video/mp4':
									if (tempFileSize > parseInt(Titanium.App.Properties.getString('app_media_upload_limit_video'), 10)) {
										temp_upload_is_over_limit = true;
									}
									break;
								case 'audio/wav':
									if (tempFileSize > parseInt(Titanium.App.Properties.getString('app_media_upload_limit_audio'), 10)) {
										temp_upload_is_over_limit = true;
									}
									break;
								default:
									if (tempFileSize > parseInt(Titanium.App.Properties.getString('app_media_upload_limit_document'), 10)) {
										temp_upload_is_over_limit = true;
									}
							}
						}
						if (temp_upload_is_over_limit) {
							var temp_var = {
								'id' : data_rows.fieldByName('id'),
								'local_id' : data_rows.fieldByName('local_id'),
								'job_id' : (_type === 'job') ? _selected_job_id : 0,
								'quote_id' : (_type === 'quote') ? _selected_job_id : 0,
								'name' : (data_rows.fieldByName('name') === null) ? '' : data_rows.fieldByName('name'),
								'description' : (data_rows.fieldByName('description') === null) ? '' : data_rows.fieldByName('description'),
								'job_asset_type_code' : (_type === 'job') ? data_rows.fieldByName('job_asset_type_code') : 0,
								'quote_asset_type_code' : (_type === 'quote') ? data_rows.fieldByName('quote_asset_type_code') : 0,
								'path' : ((data_rows.fieldByName('path') === null) || (data_rows.fieldByName('path') === '')) ? data_rows.fieldByName('path_original') : data_rows.fieldByName('path'),
								'path_original' : ((data_rows.fieldByName('path') === null) || (data_rows.fieldByName('path') === '')) ? data_rows.fieldByName('path_original') : data_rows.fieldByName('path'),
								'mime_type' : data_rows.fieldByName('mime_type'),
								'width' : data_rows.fieldByName('width'),
								'height' : data_rows.fieldByName('height'),
								'file_size' : data_rows.fieldByName('file_size'),
								'is_local_record' : data_rows.fieldByName('is_local_record'),
								'status_code' : data_rows.fieldByName('status_code')
							};
							asset_list.push(temp_var);
						}
						data_rows.next();
					}
				}
				data_rows.close();
				if (asset_list.length > 0) {
					return JSON.stringify(asset_list);
				} else {
					return null;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_job_asset_for_over_size_files');
				return null;
			}
		}
		function _setup_job_asset_for_upload(db) {
			try {
				var asset_list = [];
				var data_rows = db.execute('SELECT * FROM my_' + _type + '_asset WHERE changed=1 and ' + _type + '_id=? order by id asc', _selected_job_id);
				if (data_rows.getRowCount() > 0) {
					while (data_rows.isValidRow()) {
						var temp_upload_is_over_limit = false;
						if (data_rows.fieldByName('is_local_record')) {
							var tempFileSize = parseInt(data_rows.fieldByName('file_size'), 10);
							switch (data_rows.fieldByName('mime_type')){
								case 'image/jpeg':
									if (tempFileSize > parseInt(Titanium.App.Properties.getString('app_media_upload_limit_image'), 10)) {
										temp_upload_is_over_limit = true;
									}
									break;
								case 'video/mp4':
									if (tempFileSize > parseInt(Titanium.App.Properties.getString('app_media_upload_limit_video'), 10)) {
										temp_upload_is_over_limit = true;
									}
									break;
								case 'audio/wav':
									if (tempFileSize > parseInt(Titanium.App.Properties.getString('app_media_upload_limit_audio'), 10)) {
										temp_upload_is_over_limit = true;
									}
									break;
								default:
									if (tempFileSize > parseInt(Titanium.App.Properties.getString('app_media_upload_limit_document'), 10)) {
										temp_upload_is_over_limit = true;
									}
							}
						}
						if (!temp_upload_is_over_limit) {
							var temp_var = {
								'id' : data_rows.fieldByName('id'),
								'local_id' : data_rows.fieldByName('local_id'),
								'job_id' : (_type === 'job') ? _selected_job_id : 0,
								'quote_id' : (_type === 'quote') ? _selected_job_id : 0,
								'name' : (data_rows.fieldByName('name') === null) ? '' : data_rows.fieldByName('name'),
								'description' : (data_rows.fieldByName('description') === null) ? '' : data_rows.fieldByName('description'),
								'job_asset_type_code' : (_type === 'job') ? data_rows.fieldByName('job_asset_type_code') : 0,
								'quote_asset_type_code' : (_type === 'quote') ? data_rows.fieldByName('quote_asset_type_code') : 0,
								'path' : ((data_rows.fieldByName('path') === null) || (data_rows.fieldByName('path') === '')) ? data_rows.fieldByName('path_original') : data_rows.fieldByName('path'),
								'path_original' : ((data_rows.fieldByName('path') === null) || (data_rows.fieldByName('path') === '')) ? data_rows.fieldByName('path_original') : data_rows.fieldByName('path'),
								'mime_type' : data_rows.fieldByName('mime_type'),
								'width' : data_rows.fieldByName('width'),
								'height' : data_rows.fieldByName('height'),
								'file_size' : data_rows.fieldByName('file_size'),
								'is_local_record' : data_rows.fieldByName('is_local_record'),
								'status_code' : data_rows.fieldByName('status_code')
							};
							asset_list.push(temp_var);
						}
						data_rows.next();
					}
				}
				data_rows.close();
				if (asset_list.length > 0) {
					return JSON.stringify(asset_list);
				} else {
					return null;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_job_asset_for_upload');
				return null;
			}
		}
		function _setup_job_material_log_for_upload(db) {
			try {
				var material_list = [];
				var data_rows = db.execute('SELECT * FROM my_' + _type + '_assigned_item WHERE changed=1 and ' + _type + '_id=?', _selected_job_id);
				if (data_rows.getRowCount() > 0) {
					while (data_rows.isValidRow()) {
						var temp_var = {
							'id' : data_rows.fieldByName('id'),
							'local_id' : data_rows.fieldByName('local_id'),
							'job_id' : (_type === 'job') ? _selected_job_id : 0,
							'quote_id' : (_type === 'quote') ? _selected_job_id : 0,
							'job_library_item_id' : data_rows.fieldByName('job_library_item_id'),
							'materials_locations_id' : (data_rows.fieldByName('materials_locations_id') == null) ? 0 : data_rows.fieldByName('materials_locations_id'),
							'item_order' : 0,
							'units' : data_rows.fieldByName('units'),
							'status_code' : data_rows.fieldByName('status_code')
						};
						material_list.push(temp_var);
						data_rows.next();
					}
				}
				data_rows.close();
				if (material_list.length > 0) {
					return JSON.stringify(material_list);
				} else {
					return null;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_job_material_log_for_upload');
				return null;
			}
		}
		function _setup_job_invoice_for_upload(db) {
			try {
				var invoice_list = [];
				var data_rows = db.execute('SELECT * FROM my_' + _type + '_invoice WHERE changed=1 and ' + _type + '_id=?', _selected_job_id);
				if (data_rows.getRowCount() > 0) {
					while (data_rows.isValidRow()) {
						var temp_var = {
							'id' : data_rows.fieldByName('id'),
							'local_id' : data_rows.fieldByName('local_id'),
							'company_id' : data_rows.fieldByName('company_id'),
							'job_id' : data_rows.fieldByName('job_id'),
							'job_invoice_status_code' : data_rows.fieldByName('job_invoice_status_code'),
							'job_invoice_template_id' : data_rows.fieldByName('job_invoice_template_id'),
							'setup' : data_rows.fieldByName('setup'),
							'invoice_date' : data_rows.fieldByName('invoice_date'),
							'description' : data_rows.fieldByName('description'),
							'description_items' : data_rows.fieldByName('description_items'),
							'description_labour' : data_rows.fieldByName('description_labour'),
							'mark_up' : data_rows.fieldByName('mark_up'),
							'discount' : data_rows.fieldByName('discount'),
							'hidematerial' : data_rows.fieldByName('hidematerial'),
							'hidelabour' : data_rows.fieldByName('hidelabour'),
							'total_amount' : data_rows.fieldByName('total_amount'),
							'payment_terms' : data_rows.fieldByName('payment_terms'),
							'payment_comments' : data_rows.fieldByName('payment_comments'),
							'path' : data_rows.fieldByName('path'),
							'account_external_reference' : data_rows.fieldByName('account_external_reference'),
							'is_export' : data_rows.fieldByName('is_export'),
							'export_modify_time' : data_rows.fieldByName('export_modify_time'),
							'status_code' : data_rows.fieldByName('status_code')
						};
						invoice_list.push(temp_var);
						data_rows.next();
					}
				}
				data_rows.close();
				if (invoice_list.length > 0) {
					return JSON.stringify(invoice_list);
				} else {
					return null;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_job_invoice_for_upload');
				return null;
			}
		}
		function _setup_job_invoice_signature_for_upload(db) {
			try {
				var invoice_signature_list = [];
				var data_rows = db.execute('SELECT * FROM my_' + _type + '_invoice_signature WHERE changed=1 and ' + _type + '_id=?', _selected_job_id);
				if (data_rows.getRowCount() > 0) {
					while (data_rows.isValidRow()) {
						var temp_var = {
							'id' : data_rows.fieldByName('id'),
							'local_id' : data_rows.fieldByName('local_id'),
							'job_id' : _selected_job_id,
							'quote_id' : _selected_job_id,
							'job_invoice_id' : (_type == 'job') ? data_rows.fieldByName('job_invoice_id') : 0,
							'quote_print_id' : (_type == 'quote') ? data_rows.fieldByName('quote_print_id') : 0,
							'client_name' : data_rows.fieldByName('client_name'),
							'path' : data_rows.fieldByName('path'),
							'time' : data_rows.fieldByName('time'),
							'mime_type' : data_rows.fieldByName('mime_type'),
							'width' : data_rows.fieldByName('width'),
							'height' : data_rows.fieldByName('height'),
							'file_size' : data_rows.fieldByName('file_size'),
							'status_code' : data_rows.fieldByName('status_code')
						};
						invoice_signature_list.push(temp_var);
						data_rows.next();
					}
				}
				data_rows.close();
				if (invoice_signature_list.length > 0) {
					return JSON.stringify(invoice_signature_list);
				} else {
					return null;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_job_invoice_signature_for_upload');
				return null;
			}
		}
		function _setup_job_custom_report_for_upload(db) {
			try {
				var custom_report_list = [];
				var data_rows = db.execute('SELECT * FROM my_' + _type + '_custom_report_data WHERE changed=1 and ' + _type + '_id=?', _selected_job_id);
				if (data_rows.getRowCount() > 0) {
					while (data_rows.isValidRow()) {
						var temp_var = {
							'id' : data_rows.fieldByName('id'),
							'local_id' : data_rows.fieldByName('local_id'),
							'job_id' : data_rows.fieldByName(_type + '_id'),
							'custom_report_id' : data_rows.fieldByName('custom_report_id'),
							'manager_user_id' : data_rows.fieldByName('manager_user_id'),
							'custom_report_data' : data_rows.fieldByName('custom_report_data'),
							'status_code' : data_rows.fieldByName('status_code')
						};
						custom_report_list.push(temp_var);
						data_rows.next();
					}
				}
				data_rows.close();
				if (custom_report_list.length > 0) {
					return JSON.stringify(custom_report_list);
				} else {
					return null;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_job_custom_report_for_upload');
				return null;
			}
		}
		function _setup_job_custom_report_signature_for_upload(db) {
			try {
				var custom_report_signature_list = [];
				var data_rows = db.execute('SELECT * FROM my_' + _type + '_custom_report_signature WHERE changed=1 and ' + _type + '_id=?', _selected_job_id);
				if (data_rows.getRowCount() > 0) {
					while (data_rows.isValidRow()) {
						var temp_var = {
							'id' : data_rows.fieldByName('id'),
							'local_id' : data_rows.fieldByName('local_id'),
							'job_id' : _selected_job_id,
							'quote_id' : _selected_job_id,
							'job_custom_report_data_id' : data_rows.fieldByName(_type + '_custom_report_data_id'),
							'quote_custom_report_data_id' : data_rows.fieldByName(_type + '_custom_report_data_id'),
							'client_name' : data_rows.fieldByName('client_name'),
							'path' : data_rows.fieldByName('path'),
							'time' : data_rows.fieldByName('time'),
							'mime_type' : data_rows.fieldByName('mime_type'),
							'width' : data_rows.fieldByName('width'),
							'height' : data_rows.fieldByName('height'),
							'file_size' : data_rows.fieldByName('file_size'),
							'status_code' : data_rows.fieldByName('status_code')
						};
						custom_report_signature_list.push(temp_var);
						data_rows.next();
					}
				}
				data_rows.close();
				if (custom_report_signature_list.length > 0) {
					return JSON.stringify(custom_report_signature_list);
				} else {
					return null;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _setup_job_custom_report_signature_for_upload');
				return null;
			}
		}
		/*
		 * update exist_any_changed = 0 for job or quote
		 */
		function _update_job_exist_any_changed_status(job_id, result) {
			try {
				var db = Titanium.Database.open(self.get_db_name());
				if (result == 1) {
					db.execute('UPDATE my_' + _type + ' SET exist_any_changed=1 WHERE id=?', job_id);
				} else {
					db.execute('UPDATE my_' + _type + ' SET exist_any_changed=0 WHERE id=?', job_id);
				}
				db.close();
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _update_job_exist_any_changed_status');
				return;
			}
		}
		/*
		 * check if exist any change
		 */
		function _check_if_exist_change() {
			try {
				var is_make_changed = false;
				// check if make any change
				// if make any change then prompt to save or
				// update
				// else return to "view job" page
				var db = Titanium.Database.open(self.get_db_name());
				var rows = db.execute('SELECT * FROM my_' + _type + ' WHERE changed=1 and id=?', _selected_job_id);
				if (rows.getRowCount() > 0) {
					is_make_changed = true;
				} else {
					// check local database
					var table_array = [];
					if (_type === 'job') {
						table_array.push('my_' + _type + '_operation_log');
					}
					table_array.push('my_' + _type + '_status_log');
					table_array.push('my_' + _type + '_client_contact');
					table_array.push('my_' + _type + '_site_contact');
					table_array.push('my_' + _type + '_note');
					table_array.push('my_' + _type + '_asset');
					table_array.push('my_' + _type + '_contact_history');
					table_array.push('my_' + _type + '_assigned_user');
					table_array.push('my_' + _type + '_assigned_item');
					table_array.push('my_' + _type + '_invoice');
					table_array.push('my_' + _type + '_invoice_signature');
					table_array.push('my_' + _type + '_custom_report_data');
					table_array.push('my_' + _type + '_custom_report_signature');
					for ( var i = 0, j = table_array.length; i < j; i++) {
						// if any changed record does
						// not in the
						// my_updating_records, then set
						// is_make_changed = true
						rows = db.execute('SELECT * FROM ' + table_array[i] + ' WHERE changed=1 and ' + _type + '_id=?', _selected_job_id);
						var row_count = rows.getRowCount();
						if (row_count > 0) {
							is_make_changed = true;
							rows.close();
							break;
						} else {
							rows.close();
						}
					}
					
				}
				db.close();
				
				if (is_make_changed && (_selected_job_id > 1000000000)) {
					_create_an_empty_job(_selected_job_id, _type);
				}
				
				db = Titanium.Database.open(self.get_db_name());
				if (is_make_changed) {
					db.execute('UPDATE my_' + _type + ' SET exist_any_changed=1 WHERE id=?', _selected_job_id);
				} else {
					db.execute('UPDATE my_' + _type + ' SET exist_any_changed=0 WHERE id=?', _selected_job_id);
				}
				
				if (_exist_upload_file_failure) {
					db.execute('UPDATE my_' + _type + ' SET exist_any_changed=1 WHERE id=?', _selected_job_id);
				}
				
				db.close();
				return is_make_changed;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _check_if_exist_change');
				return false;
			}
		}
		/**
		 * insert into a empty job to database if user click main menu
		 * button in job_note_edit page, or other some sub page when
		 * user create new job or quote
		 */
		function _create_an_empty_job(job_id, job_type) {
			try {
				var db = Titanium.Database.open(self.get_db_name());
				var rows = db.execute('SELECT * FROM my_' + job_type + ' WHERE id=?', job_id);
				if (rows.getRowCount() > 0) {
					rows.close();
				} else {
					if (job_type == 'job') {
						db.execute('INSERT INTO my_job (id,local_id,company_id,client_id,job_priority_code,job_status_code,scheduled_from,' + 'scheduled_to,reference_number,order_reference,sp,sub_number,unit_number,street_number,street,locality_street_type_id,street_type,' + 'locality_suburb_id,suburb,locality_state_id,latitude,longitude,point,boundary,geo_source_code,geo_accuracy_code,'
										+ 'title,description,booking_note,allocated_hours,status_code,due,order_source_code,is_task,changed,exist_any_changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', job_id, _selected_company_id + '-' + _selected_user_id + '-' + job_id, _selected_company_id, 0, 0, 0, null, null, job_id, null, '', '', '', '', '', 0, '', 0, '', 0,
										null, null, null, null, null, null, 'Untitled ' + self.ucfirst(job_type), '', '', '', 1, null, '', 0, 1, 0, null, _selected_user_id, 0, null);
					} else {
						db.execute('INSERT INTO my_quote (id,local_id,company_id,client_id,quote_status_code,scheduled_from,' + 'scheduled_to,reference_number,order_reference,sp,sub_number,unit_number,street_number,street,locality_street_type_id,street_type,' + 'locality_suburb_id,suburb,locality_state_id,latitude,longitude,point,boundary,geo_source_code,geo_accuracy_code,'
										+ 'title,description,booking_note,allocated_hours,job_id,status_code,due,order_source_code,is_task,changed,exist_any_changed,created,created_by,modified_by,modified)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', job_id, _selected_company_id + '-' + _selected_user_id + '-' + job_id, _selected_company_id, 0, 0, null, null, job_id, null, '', '', '', '', '', 0, '', 0, '',
										0, null, null, null, null, null, null, 'Untitled ' + self.ucfirst(job_type), '', '', '', 0, 1, null, '', 0, 1, 0, null, _selected_user_id, 0, null);
					}
				}
				db.close();
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _create_an_empty_job');
				return false;
			}
		}
		/*
		 * check if need to send notification
		 */
		function _check_if_need_send_notification() {
			try {
				var status_flag = false;
				if (_selected_job_id > 1000000000) {
					status_flag = true;
				} else {
					var db = Titanium.Database.open(self.get_db_name());
					var rows = db.execute('SELECT * FROM my_' + _type + '_assigned_user WHERE changed=1 and ' + _type + '_id=?', _selected_job_id);
					if (rows.getRowCount() > 0) {
						status_flag = true;
					}
					rows.close();
					db.close();
					if (!status_flag) {
						db = Titanium.Database.open(self.get_db_name());
						rows = db.execute('SELECT * FROM my_' + _type + '_status_log WHERE changed=1 and ' + _type + '_id=?', _selected_job_id);
						if (rows.getRowCount() > 0) {
							status_flag = true;
						}
						rows.close();
						db.close();
					}
				}
				return status_flag;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _check_if_need_send_notification');
				return;
			}
		}
		/*
		 * save action
		 */
		function _save_action() {
			try {
				if (!self.check_if_exist_upload_file_failure(_selected_job_id, _type, _selected_company_id)) {
					_exist_upload_file_failure = false;
				}
				Ti.API.info('_exist_upload_file_failure:' + _exist_upload_file_failure);
				if (_check_if_exist_change() || (_selected_job_id > 1000000000)) {
					var option_dialog = null;
					option_dialog = Ti.UI.createOptionDialog({
						options : (self.is_ipad()) ? [ 'YES (Send To Office)', 'NO (Save To Phone)', 'NO (Remove Changes)', 'Cancel', '' ] : [ 'YES (Send To Office)', 'NO (Save To Phone)', 'NO (Remove Changes)', 'Cancel' ],
						buttonNames : [ 'Cancel' ],
						destructive : 0,
						cancel : 3,
						title : (_selected_job_id > 1000000000) ? 'This ' + _type + ' doesn\'t send to office.Do you want to send it?' : 'This ' + _type + ' has been changed. Do you want to send it to office?'
					});
					option_dialog.show();
					option_dialog.addEventListener('click', function(e) {
						switch (e.index){
							case 0:// yes,save and
								// upload
								// check if
								// enter job
								// detail
								Ti.API.info('b1');
								if (_exist_upload_file_failure) {
									Ti.API.info('b2');
									var db = Titanium.Database.open(self.get_db_name());
									db.execute('UPDATE my_updating_records SET upload_status=0,failure_times=0 WHERE relation_id=? and type=? and upload_status in (1,3)', _selected_job_id, _type);
									db.close();
									Ti.App.fireEvent('async_save_data');
								}
								Ti.API.info('b3');
								_save_to_office();
								break;
							case 1:
								_save_to_phone();
								break;
							case 2:// remove
								// changes
								_remove_change();
								break;
							case 3:// cancel
								self.nav_left_btn.index = -1;
								break;
						}
					});
				} else {
					if (_exist_upload_file_failure) {
						option_dialog = Ti.UI.createOptionDialog({
							options : (self.is_ipad()) ? [ 'YES', 'NO', 'Cancel', '' ] : [ 'YES', 'NO', 'Cancel' ],
							buttonNames : [ 'Cancel' ],
							destructive : 0,
							cancel : 2,
							title : 'Some files upload failed. Do you want to upload again?'
						});
						option_dialog.show();
						option_dialog.addEventListener('click', function(e) {
							switch (e.index){
								case 0:// yes,upload
									var db = Titanium.Database.open(self.get_db_name());
									db.execute('UPDATE my_updating_records SET upload_status=0,failure_times=0 WHERE relation_id=? and type=? and upload_status in (1,3)', _selected_job_id, _type);
									db.close();
									if (_is_click_main_menu_btn) {// menu
										// menu
										self.close_all_window_and_return_to_menu();
									} else {
										if (_is_click_back_btn) {
											win.close();
										}
									}
									Ti.App.fireEvent('async_save_data');
									break;
								case 1:
									if (_is_click_main_menu_btn) {// menu
										// menu
										self.close_all_window_and_return_to_menu();
									} else {
										if (_is_click_back_btn) {
											win.close();
										}
									}
									break;
								case 2:// cancel
									self.nav_left_btn.index = -1;
									break;
							}
						});
					} else {
						if (_is_click_main_menu_btn) {// menu
							// menu
							self.close_all_window_and_return_to_menu();
						} else {
							if (_is_click_back_btn) {
								win.close();
							} else {
								var alertDialog = Titanium.UI.createAlertDialog({
									title : 'Reminder',
									message : 'Nothing to save.',
									buttonNames : [ 'Close' ]
								});
								alertDialog.show();
							}
						}
					}
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _save_action');
				return;
			}
		}
		function _save_to_office() {
			try {
				if (Ti.Network.online) {
					return _save_to_server();
				} else {
					self.show_message(L('message_offline_and_save_to_local_in_job_index_view'));
					Ti.App.Properties.setBool('refresh_list', true);
					if (_is_click_main_menu_btn) {// menu
						// menu
						self.close_all_window_and_return_to_menu();
					} else {
						if (_is_click_back_btn) {
							win.close();
						}
					}
					return false;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _save_to_office');
				return false;
			}
		}
		function _save_to_phone() {
			try {
				var db = Titanium.Database.open(self.get_db_name());
				var rows = db.execute('SELECT * FROM my_' + _type + ' WHERE id=?', _selected_job_id);
				if (rows.getRowCount() <= 0) {
					rows.close();
					db.close();
					self.show_message('Please enter ' + _type + ' detail.');
					return false;
				}
				if (rows.fieldByName('title') === null) {
					rows.close();
					db.close();
					self.show_message('Please enter ' + _type + ' detail.');
					return false;
				}
				rows.close();
				db.close();
				Ti.App.Properties.setBool('refresh_list', true);
				if (_is_click_main_menu_btn) {// menu menu
					self.close_all_window_and_return_to_menu();
				} else {
					if (_is_click_back_btn) {
						win.close();
					} else {
						var alertDialog = Titanium.UI.createAlertDialog({
							title : 'Reminder',
							message : self.ucfirst(_type) + ' has been saved.',
							buttonNames : [ 'Close' ]
						});
						alertDialog.show();
					}
				}
				return true;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _save_to_phone');
				return false;
			}
		}
		function _remove_change() {
			try {
				if (_selected_job_id > 1000000000) {
					_clean_database_and_file(_selected_job_id);
					if (_is_click_main_menu_btn) {// menu
						// menu
						self.close_all_window_and_return_to_menu();
					} else {
						win.close();
					}
				} else {
					if (Ti.Network.online) {
						self.display_indicator('Loading Data ...', false);
						var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
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
										self.hide_indicator();
										return;
									}
									_delete_new_record_and_file(_selected_job_id);
									self.refresh_job_and_relative_tables(this.responseText, _type);
									Ti.App.Properties.setBool('refresh_list', true);
									if (_is_click_main_menu_btn) {// menu
										// menu
										self.hide_indicator();
										self.close_all_window_and_return_to_menu();
									} else {
										if (_is_click_back_btn) {
											self.hide_indicator();
											win.close();
										} else {
											self.display();
											self.hide_indicator();
										}
									}
								} else {
									self.hide_indicator();
									var params = {
										message : 'Download ' + _type + ' failed.',
										show_message : true,
										message_title : '',
										send_error_email : true,
										error_message : '',
										error_source : window_source + ' - _remove_change - xhr.onload - 1',
										server_response_message : this.responseText
									};
									self.processXYZ(params);
									return;
								}
							} catch (e) {
								self.hide_indicator();
								params = {
									message : 'Download ' + _type + ' failed.',
									show_message : true,
									message_title : '',
									send_error_email : true,
									error_message : e,
									error_source : window_source + ' - _remove_change - xhr.onload - 1',
									server_response_message : this.responseText
								};
								self.processXYZ(params);
								return;
							}
						};
						xhr.onerror = function(e) {
							self.hide_indicator();
							var params = {
								message : 'Download ' + _type + ' failed.',
								show_message : true,
								message_title : '',
								send_error_email : true,
								error_message : e,
								error_source : window_source + ' - _remove_change - xhr.onerror',
								server_response_message : this.responseText
							};
							self.processXYZ(params);
							return;
						};
						xhr.setTimeout(self.default_time_out);
						xhr.open('POST', self.get_host_url() + 'update', false);
						xhr.send({
							'type' : 'download_job',
							'job_type' : _type,
							'hash' : _selected_user_id,
							'company_id' : _selected_company_id,
							'user_id' : _selected_user_id,
							'job_id_string' : _selected_job_id,
							'app_security_session' : self.is_simulator() ? self.default_udid : Titanium.Platform.id,
							'app_version_increment' : self.version_increment,
							'app_version' : self.version,
							'app_platform' : self.get_platform_info()
						});
					} else {
						self.show_message(L('message_offline_and_system_cant_remove_change_in_job_index_view'));
						return;
					}
				}
			} catch (err) {
				self.hide_indicator();
				self.process_simple_error_message(err, window_source + ' - _remove_change');
				return;
			}
		}
		/**
		 * save job or quote
		 */
		function _save() {
			try {
				var is_make_changed = _check_if_exist_change();
				if (!is_make_changed) {
					if (_is_click_main_menu_btn) {// menu
						// menu
						self.close_all_window_and_return_to_menu();
					} else {
						if (_is_click_back_btn) {
							win.close();
						}
					}
				} else {
					_save_action();
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _save');
				return;
			}
		}
		/**
		 * save data to server
		 */
		function _save_to_server() {
			try {
				// check if enter job detail
				var tempMessage = "";
				var db = Titanium.Database.open(self.get_db_name());
				var rows = db.execute('SELECT * FROM my_' + _type + ' WHERE id=?', _selected_job_id);
				if ((rows.getRowCount() <= 0) || (rows.fieldByName('title') === null)) {
					if (tempMessage != '') {
						tempMessage += '\n';
					}
					tempMessage += 'Please enter ' + _type + ' detail.';
				}
				rows.close();
				// check assigned user,
				rows = db.execute('SELECT * FROM my_' + _type + '_assigned_user WHERE status_code=1 and ' + _type + '_id=?', _selected_job_id);
				if (rows.getRowCount() <= 0) {
					if (tempMessage != '') {
						tempMessage += '\n';
					}
					tempMessage += 'Please select assigned user.';
				}
				rows.close();
				db.close();
				if (tempMessage != '') {
					self.nav_left_btn.index = -1;
					self.show_message(tempMessage);
					return false;
				}
				// check online or not, if offline then save to
				// local
				if (!Ti.Network.online) {
					self.show_message(L('message_offline_and_save_to_local_in_job_index_view'));
					Ti.App.Properties.setBool('refresh_list', true);
					if (_is_click_main_menu_btn) {// menu
						// menu
						self.close_all_window_and_return_to_menu();
					} else {
						if (_is_click_back_btn) {
							win.close();
						}
					}
					return false;
				} else {
					return _upload_job_detail();
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _save_to_server');
				return false;
			}
		}
		/**
		 * clean database and files (delete data from database and delte
		 * files from local)
		 */
		function _clean_database_and_file(job_id) {
			try {
				var db = Titanium.Database.open(self.get_db_name());
				db.execute('delete from my_' + _type + ' where id=?', job_id);
				if (_type === 'job') {
					db.execute('delete from my_' + _type + '_operation_log where ' + _type + '_id=?', job_id);
				}
				db.execute('delete from my_' + _type + '_status_log where ' + _type + '_id=?', job_id);
				db.execute('delete from my_' + _type + '_client_contact where ' + _type + '_id=?', job_id);
				db.execute('delete from my_' + _type + '_site_contact where ' + _type + '_id=?', job_id);
				db.execute('delete from my_' + _type + '_note where ' + _type + '_id=?', job_id);
				db.execute('delete from my_' + _type + '_asset where ' + _type + '_id=?', job_id);
				db.execute('delete from my_' + _type + '_contact_history where ' + _type + '_id=?', job_id);
				db.execute('delete from my_' + _type + '_assigned_user where ' + _type + '_id=?', job_id);
				db.execute('delete from my_' + _type + '_assigned_item where ' + _type + '_id=?', job_id);
				db.execute('delete from my_' + _type + '_invoice where ' + _type + '_id=?', job_id);
				db.execute('delete from my_' + _type + '_invoice_signature where ' + _type + '_id=?', job_id);
				db.execute('delete from my_' + _type + '_custom_report_data where ' + _type + '_id=?', job_id);
				db.execute('delete from my_' + _type + '_custom_report_signature where ' + _type + '_id=?', job_id);
				db.execute('delete from my_' + _type + '_operation_manual where ' + _type + '_id=?', job_id);
				db.close();
				
				var temp_folder = Ti.Filesystem.getFile(self.file_directory + _selected_company_id + '/' + _type, job_id);
				if (temp_folder.exists()) {
					temp_folder.deleteDirectory(true);
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _clean_database_and_file');
				return;
			}
		}
		/**
		 * delete new record which id > 1000000000 from local databae
		 */
		function _delete_new_record_and_file(job_id) {
			try {
				var db = Titanium.Database.open(self.get_db_name());
				if (_type === 'job') {
					db.execute('delete from my_' + _type + '_operation_log where ' + _type + '_id=? and id>1000000000', job_id);
				}
				db.execute('delete from my_' + _type + '_status_log where ' + _type + '_id=? and id>1000000000', job_id);
				db.execute('delete from my_' + _type + '_client_contact where ' + _type + '_id=? and id>1000000000', job_id);
				db.execute('delete from my_' + _type + '_site_contact where ' + _type + '_id=? and id>1000000000', job_id);
				db.execute('delete from my_' + _type + '_note where ' + _type + '_id=? and id>1000000000', job_id);
				db.execute('delete from my_' + _type + '_asset where ' + _type + '_id=? and id>1000000000', job_id);
				db.execute('delete from my_' + _type + '_contact_history where ' + _type + '_id=? and id>1000000000', job_id);
				db.execute('delete from my_' + _type + '_assigned_user where ' + _type + '_id=? and id>1000000000', job_id);
				db.execute('delete from my_' + _type + '_assigned_item where ' + _type + '_id=? and id>1000000000', job_id);
				db.execute('delete from my_' + _type + '_invoice where ' + _type + '_id=? and id>1000000000', job_id);
				db.execute('delete from my_' + _type + '_invoice_signature where ' + _type + '_id=? and id>1000000000', job_id);
				db.execute('delete from my_' + _type + '_custom_report_data where ' + _type + '_id=? and id>1000000000', job_id);
				db.execute('delete from my_' + _type + '_custom_report_signature where ' + _type + '_id=? and id>1000000000', job_id);
				db.execute('delete from my_' + _type + '_operation_manual where ' + _type + '_id=? and id>1000000000', job_id);
				db.execute('UPDATE my_' + _type + ' SET exist_any_changed=0 WHERE id=?', job_id);// update
				// job's
				// exist_any_changed
				// column
				// right
				// now
				db.close();
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _delete_new_record_and_file');
				return;
			}
		}
		/**
		 * when user open the job or quote, display the eror info of
		 * upload data last times. maybe this feature should be display
		 * in otherwhere.
		 */
		function _display_error_info() {
			try {
				var message = '';
				var name_array = [];
				var db = Titanium.Database.open(self.get_db_name());
				var rows = db.execute('SELECT * FROM my_updating_records WHERE upload_status=3 and relation_id=? and type=? and company_id=?', _selected_job_id, _type, _selected_company_id);
				if (rows.getRowCount() > 0) {
					_exist_upload_file_failure = true;
					while (rows.isValidRow()) {
						var temp_row = db.execute('SELECT * FROM my_updating_errors_for_data WHERE updating_id=? and relation_id=? and type=? and company_id=?', rows.fieldByName('updating_id'), _selected_job_id, _type, _selected_company_id);
						if (temp_row.isValidRow()) {
							
						} else {
							var d = new Date();
							db.execute('INSERT INTO my_updating_errors_for_data (id,user_id,company_id,type,message,updating_id,table_name,relation_id,relation_reference_number,relation_id_field_name,relation_table,is_read,created)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', parseInt(d.getTime(), 10), rows.fieldByName('user_id'), rows.fieldByName('company_id'), rows.fieldByName('type'), rows.fieldByName('error_message'), rows.fieldByName('updating_id'), rows
											.fieldByName('table_name'), rows.fieldByName('relation_id'), rows.fieldByName('relation_reference_number'), rows.fieldByName('relation_id_field_name'), rows.fieldByName('relation_table'), 0, rows.fieldByName('created'));
						}
						temp_row.close();
						rows.next();
					}
					
				}
				rows.close();
				
				rows = db.execute('SELECT * FROM my_updating_errors_for_data WHERE is_read=0 and relation_id=? and type=? and company_id=?', _selected_job_id, _type, _selected_company_id);
				if (rows.getRowCount() > 0) {
					while (rows.isValidRow()) {
						var temp_flag = false;
						for ( var i = 0, j = name_array.length; i < j; i++) {
							if (name_array[i].name === rows.fieldByName('message')) {
								temp_flag = true;
								name_array[i].number++;
							}
						}
						if (!temp_flag) {
							var temp_var = {
								name : rows.fieldByName('message')
							};
							name_array.push(temp_var);
						}
						rows.next();
					}
				}
				rows.close();
				db.close();
				if (name_array.length > 0) {
					message = 'Failure to upload data in the following sections:\n';
					for (i = 0, j = name_array.length; i < j; i++) {
						message += name_array[i].name + '\n';
					}
				}
				if (message != '') {
					self.show_message(message);
					db = Titanium.Database.open(self.get_db_name());
					db.execute('DELETE FROM my_updating_errors_for_data WHERE relation_id=? and type=? and company_id=?', _selected_job_id, _type, _selected_company_id);
					db.close();
					return;
				}
			} catch (err) {
				self.run_in_background_for_sync_upload();
				self.process_simple_error_message(err, window_source + ' - _display_error_info');
				return;
			}
		}
	}
	
	win.addEventListener('focus', function() {
		try {
			Ti.App.Properties.setBool('lock_table_flag', true);
			if (job_edit_index_page_obj === null) {
				var F = function() {
				};
				F.prototype = operate_camera_page.prototype;
				job_edit_index_page.prototype = new F();
				job_edit_index_page.prototype.constructor = job_edit_index_page;
				job_edit_index_page_obj = new job_edit_index_page();
				job_edit_index_page_obj.init();
			} else {
				job_edit_index_page_obj.display();
			}
		} catch (err) {
			alert(err);
			return;
		}
	});
	
	win.addEventListener('close', function() {
		try {
			Ti.API.info('job index view page close event');
			Ti.App.Properties.setBool('lock_table_flag', false);
			// job_edit_index_page_obj.win_close('job_edit_page');
			
			var is_need_to_refresh = false;
			if ((win.parent_win != undefined) && (win.parent_win != null) && (win.parent_win.title == 'Site History')) {
			} else {
				is_need_to_refresh = true;
			}
			job_edit_index_page_obj.close_window();
			job_edit_index_page_obj = null;
			win = null;
			if (is_need_to_refresh) {
				Ti.App.fireEvent('refresh_job_filter_list');
			}
		} catch (err) {
			alert(err);
			return;
		}
	});
	
	win.addEventListener('touchMainMenu', function(e) {
		try {
			if ((job_edit_index_page_obj != undefined) && (job_edit_index_page_obj != null)) {
				job_edit_index_page_obj.touchMainMenu();
			}
		} catch (err) {
			alert(err);
			return;
		}
	});
}());
