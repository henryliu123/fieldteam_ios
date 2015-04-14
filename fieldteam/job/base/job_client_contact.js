/**
 * Description: client_contact editor
 */

(function() {
	Titanium.include(Ti.App.Properties.getString('base_folder_name') + 'fieldteam.js');
	var win = Titanium.UI.currentWindow;
	var job_base_cleint_contact_page_obj = null;
	
	function job_base_cleint_contact_page() {
		var self = this;
		var window_source = 'job_base_cleint_contact_page';
		if (win.action_for_client_contact == 'edit_job_client_contact') {
			win.title = 'Edit Client Contact';
		} else {
			win.title = 'Add Client Contact';
		}
		// public method
		/**
		 * override init function of parent class: fieldteam.js
		 */
		self.init = function() {
			try {
				self.init_auto_release_pool(win);
				self.data = [];
				// call init_navigation_bar function of parent
				// class: fieldteam.js
				self.init_navigation_bar('Done', 'Main,Back');
				self.init_vars();
				_init_client_contact_field();
				_init_contact_note_field();
				if (_action_for_client_contact == 'edit_job_client_contact') {
					_init_delete_btn();
				}
				// call init_table_view function of parent
				// class: fieldteam.js
				self.init_table_view();
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
				var existed_client_contact_id_array = [];
				var db = Titanium.Database.open(self.get_db_name());
				var temp_rows = db.execute('SELECT * FROM my_' + _type + '_client_contact WHERE ' + _type + '_id=? and status_code=1', _selected_job_id);
				if (temp_rows.getRowCount() > 0) {
					while (temp_rows.isValidRow()) {
						if ((temp_rows.fieldByName('client_contact_id') != null) && (temp_rows.fieldByName('client_contact_id') > 0)) {
							existed_client_contact_id_array.push(temp_rows.fieldByName('client_contact_id'));
						}
						temp_rows.next();
					}
				}
				temp_rows.close();
				if (existed_client_contact_id_array.length > 0) {
					_exist_client_contact_id_string = existed_client_contact_id_array.join(',');
				}
				
				var rows = db.execute('SELECT * FROM my_client_contact WHERE id=?', _selected_client_contact_id);
				if ((rows.getRowCount() > 0) && (rows.isValidRow())) {
					_client_contact_name = rows.fieldByName('first_name') + ' ' + rows.fieldByName('last_name');
				} else {
					_client_contact_name = '';
				}
				rows.close();
				
				rows = db.execute('SELECT * FROM my_' + _type + '_client_contact WHERE id=?', _selected_job_client_contact_id);
				if ((rows.getRowCount() > 0) && (rows.isValidRow())) {
					_client_contact_note = rows.fieldByName('note');
				} else {
					_client_contact_note = '';
				}
				rows.close();
				db.close();
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.init_vars');
				return;
			}
		};
		/**
		 * override nav_right_btn_click_event function of parent class:
		 * fieldteam.js
		 */
		self.nav_right_btn_click_event = function(e) {
			try {
				var error_string = '';
				for ( var i = 0, j = self.data.length; i < j; i++) {
					if (self.data[i].valueRequired) {
						if (self.data[i].valueType === 'text') {
							if (self.data[i].children[self.data[i].valuePosition - 1].text === '') {
								error_string += self.data[i].valuePrompt + '\n';
							}
						} else {
							if (self.data[i].children[self.data[i].valuePosition - 1].value === '') {
								error_string += self.data[i].valuePrompt + '\n';
							}
						}
					}
				}
				if (error_string != '') {
					self.show_message(error_string);
					return;
				}
				if (_check_if_exist_change()) {
					var db = Titanium.Database.open(self.get_db_name());
					var d = new Date();
					if (_selected_job_client_contact_id > 0) {// update
						db.execute('UPDATE my_' + _type + '_client_contact SET ' + _type + '_id=?,client_contact_id=?,note=?,changed=? ' + ' WHERE id=' + _selected_job_client_contact_id, _selected_job_id, _selected_client_contact_id, _client_contact_note, 1);
					} else {// add
						var new_time_value = parseInt(d.getTime(), 10);
						db.execute('INSERT INTO my_' + _type + '_client_contact (id,local_id,' + _type + '_id,client_contact_id,' + 'note,status_code,changed)' + 'VALUES(?,?,?,?,?,?,?)', new_time_value, _selected_company_id + '-' + _selected_user_id + '-' + new_time_value, _selected_job_id, _selected_client_contact_id, _client_contact_note, 1, 1);
					}
					db.close();
				}
				if (e.index == self.default_main_menu_button_index) {// menu
											// menu
					self.close_all_window_and_return_to_menu();
				} else {
					win.close();
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.nav_right_btn_click_event');
				return;
			}
		};
		/**
		 * override nav_right_btn_click_event function of parent class:
		 * fieldteam.js
		 */
		self.nav_left_btn_click_event = function(e) {
			try {
				if (_check_if_exist_change()) {
					var option_dialog = Ti.UI.createOptionDialog({
						options : (self.is_ipad()) ? [ 'YES', 'NO', 'Cancel', '' ] : [ 'YES', 'NO', 'Cancel' ],
						buttonNames : [ 'Cancel' ],
						destructive : 0,
						cancel : 2,
						title : L('message_save_changes')
					});
					option_dialog.show();
					option_dialog.addEventListener('click', function(evt) {
						switch (evt.index){
							case 0:
								self.nav_right_btn_click_event(e);
								break;
							case 1:
								if (e.index == self.default_main_menu_button_index) {// menu
															// menu
									self.close_all_window_and_return_to_menu();
								} else {
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
				_current_selected_row = e.row;
				var filter_class = self.data[e.index].filter_class;
				switch (filter_class){
					case 'set_client_contact':
						_event_for_client_contact(e);
						break;
					case 'set_client_contact_note':
						_display_note_edit_page(e);
						break;							
					case 'set_delete_button':
						_event_for_delete_btn(e);
						break;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.table_view_click_event');
				return;
			}
		};
		/**
		 * update field value after set properties in focus event call
		 * it
		 */
		self.update_field_value_after_set_properites = function() {
			try {
				
				if (Ti.App.Properties.getBool('select_client_contact_client_contact_view_flag')) {
					_selected_client_contact_id = Ti.App.Properties.getString('select_client_contact_client_contact_view_id');
					var temp_content = Ti.App.Properties.getString('select_client_contact_client_contact_view_content');
					if (_current_selected_row != null) {
						_current_selected_row.client_contact_id = _selected_client_contact_id;
						_current_selected_row.children[_current_selected_row.children.length - 1].text = temp_content;
						if ((temp_content === '') || (temp_content === null)) {
							_current_selected_row.children[_current_selected_row.children.length - 1].visible = false;
							_current_selected_row.children[_current_selected_row.children.length - 2].visible = true;
						} else {
							_current_selected_row.children[_current_selected_row.children.length - 1].visible = true;
							_current_selected_row.children[_current_selected_row.children.length - 2].visible = false;
						}
					}
					_is_make_changed = true;
					Ti.App.Properties.setBool('select_client_contact_client_contact_view_flag', false);
				}
                                if(Ti.App.Properties.getBool('update_edit_textarea_field_job_client_contact_note_view_flag')){                                         
                                	_client_contact_note = Ti.App.Properties.getString('update_edit_textarea_field_job_client_contact_note_view_content');
                                        if(_current_selected_row != null){
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _client_contact_note;
                                                if((_client_contact_note === '')||( _client_contact_note === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                                                           
                                        }
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('update_edit_textarea_field_job_client_contact_note_view_flag',false);
                                }  					
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.update_field_value_after_set_properites');
				return;
			}
		};
		
		// private member
		var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
		var _selected_company_id = Ti.App.Properties.getString('current_company_id');
		var _type = win.type;
		var _selected_job_id = win.job_id;// Ti.App.Properties.getString('currentSelectedJobID');
		var _selected_client_contact_id = win.client_contact_id;
		var _selected_job_client_contact_id = win.job_client_contact_id;
		var _selected_client_id = ((win.client_id === undefined) || (win.client_id === null)) ? 0 : win.client_id;
		var _exist_client_contact_id_string = '';
		var _action_for_client_contact = win.action_for_client_contact;
		var _client_contact_name = '';
		var _client_contact_note = '';
		var _current_selected_row = null;
		var _is_make_changed = false;
		var _current_field_num = 0;
		// private method
		/**
		 * init client contact field
		 */
		function _init_client_contact_field() {
			try {
				_current_field_num++;
				var is_required_field = true;
				var client_contact_field = Ti.UI.createTableViewRow({
					className : 'set_client_contact',
					filter_class : 'set_client_contact',
					hasChild : true,
					client_contact_id : _selected_client_contact_id,
					valueRequired : true,// for check
								// value
					valuePosition : 3,// for check
								// value
					valueType : 'text',// for check
								// value
					valuePrompt : 'Please select client contact.',// for
											// check
											// value
					height : ((_client_contact_name === '') || (_client_contact_name === null)) ? self.default_table_view_row_height : 'auto'
				});
				var client_contact_title_field = Ti.UI.createLabel({
					text : 'Contact',
					color : self.font_color,
					font : {
						fontSize : self.font_size,
						fontWeight : self.font_weight
					},
					left : 10
				});
				client_contact_field.add(client_contact_title_field);
				
				var client_contact_required_text_label = Ti.UI.createLabel({
					right : 10,
					height : self.default_table_view_row_height,
					width : self.set_a_field_width_in_table_view_row(client_contact_title_field.text),
					textAlign : 'right',
					text : (is_required_field) ? 'Required' : 'Optional',
					opacity : self.hint_text_font_opacity,
					color : self.hint_text_font_color,
					font : {
						fontSize : self.normal_font_size
					}
				});
				client_contact_field.add(client_contact_required_text_label);
				
				var client_contact_content_field = Ti.UI.createLabel({
					right : 10,
					height : ((_client_contact_name === '') || (_client_contact_name === null)) ? self.default_table_view_row_height : 'auto',
					width : self.set_a_field_width_in_table_view_row(client_contact_title_field.text),
					textAlign : 'right',
					text : _client_contact_name,
					color : self.selected_value_font_color,
					font : {
						fontSize : self.normal_font_size
					}
				});
				client_contact_field.add(client_contact_content_field);
				self.data.push(client_contact_field);
				if ((_client_contact_name === '') || (_client_contact_name === null)) {
					client_contact_content_field.visible = false;
				} else {
					client_contact_required_text_label.visible = false;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_client_contact_field');
				return;
			}
		}
		
		function _init_contact_note_field() {
			try {
				_current_field_num++;
				var is_required_field = false;
				var note_field = Ti.UI.createTableViewRow({
					className : 'set_client_contact_note',
					filter_class : 'set_client_contact_note',
					valueRequired : is_required_field,// for
					// check
					// value
					valuePosition : 3,// for check
					// value
					valueType : 'value',// for check
					// value
					valuePrompt : 'Please enter note.',// for
					// check
					// value
					height : 'auto',
					hasChild : true
				});
				var note_title_field = Ti.UI.createLabel({
					text : 'Note',
					color : self.font_color,
					font : {
						fontSize : self.font_size,
						fontWeight : self.font_weight
					},
					left : 10
				});
				note_field.add(note_title_field);
				
				var note_required_text_label = Ti.UI.createLabel({
					right : 10,
					height : self.default_table_view_row_height,
					width : self.set_a_field_width_in_table_view_row(note_title_field.text),
					textAlign : 'right',
					text : (is_required_field) ? 'Required' : 'Optional',
					opacity : self.hint_text_font_opacity,
					color : self.hint_text_font_color,
					font : {
						fontSize : self.normal_font_size
					}
				});
				note_field.add(note_required_text_label);
				
				var note_content_field = Ti.UI.createLabel({
					right : 10,
					height : 'auto',
					width : self.set_a_field_width_in_table_view_row(note_title_field.text),
					textAlign : 'right',
					text : _client_contact_note,
					color : self.selected_value_font_color,
					font : {
						fontSize : self.normal_font_size
					}
				});
				note_field.add(note_content_field);
				self.data.push(note_field);
				
				if ((self.trim(_client_contact_note) === '') || (_client_contact_note === null)) {
					note_content_field.visible = false;
				} else {
					note_required_text_label.visible = false;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_note_description_field');
				return;
			}
		}
		
				/**
		 * init detele button
		 */
		function _init_delete_btn() {
			try {
				var delete_button_field = Ti.UI.createTableViewRow({
					className : 'set_delete_button',
					filter_class : 'set_delete_button',
					header : ''
				});
				var delete_button = Ti.UI.createButton({
					title : 'Delete',
					backgroundImage : self.get_file_path('image', 'BUTT_red_off.png'),
					textAlign : 'center',
					height : self.default_table_view_row_height,
					width : (self.is_ipad()) ? self.screen_width - self.ipad_button_reduce_length_in_tableview : self.screen_width - self.iphone_button_reduce_length_in_tableview
				});
				delete_button_field.add(delete_button);
				self.data.push(delete_button_field);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_delete_btn');
				return;
			}
		}
		/**
		 * event for client contact
		 */
		function _event_for_client_contact(e) {
			try {
				var client_contact_type_win = Ti.UI.createWindow({
					url : self.get_file_path('url', 'client_contact/select_client_contact.js'),
					client_contact_id : _selected_client_contact_id,
					client_id : _selected_client_id,
					exist_client_contact_id_string : _exist_client_contact_id_string,
					source : 'client_contact'
				});
				Titanium.UI.currentTab.open(client_contact_type_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_client_contact');
				return;
			}
		}
		/**
		 * display note edit page
		 */
		function _display_note_edit_page(e) {
			try {
				var address_win = Ti.UI.createWindow({
					title : 'Edit Note',
					url : self.get_file_path('url', 'base/edit_textarea_field.js'),
					content : _client_contact_note,
					source : 'job_client_contact_note'
				});
				Titanium.UI.currentTab.open(address_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _display_note_edit_page');
				return;
			}
		}	
		/**
		 * delete button event
		 */
		function _event_for_delete_btn(e) {
			try {
				var optionDialog = Ti.UI.createOptionDialog({
					options : (self.is_ipad()) ? [ 'YES', 'NO', '' ] : [ 'YES', 'NO' ],
					buttonNames : [ 'Cancel' ],
					destructive : 0,
					cancel : 1,
					title : L('message_delete_client_contact_in_job_client_contact')
				});
				optionDialog.show();
				optionDialog.addEventListener('click', function(e) {
					if (e.index === 0) {
						var db = Titanium.Database.open(self.get_db_name());
						if (_selected_job_client_contact_id > 1000000000) {
							db.execute('DELETE FROM my_' + _type + '_client_contact WHERE id=?', _selected_job_client_contact_id);
						} else {
							db.execute('UPDATE my_' + _type + '_client_contact SET changed=?,status_code=?  WHERE id=' + _selected_job_client_contact_id, 1, 2);
						}
						db.close();
						win.close();
					}
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_delete_btn');
				return;
			}
		}
		/**
		 * check if exist any change
		 */
		function _check_if_exist_change() {
			try {
				var is_make_changed = false;
				if (_is_make_changed) {
					is_make_changed = true;
				} else {
					var db = Titanium.Database.open(self.get_db_name());
					var rows = db.execute('SELECT * FROM my_' + _type + '_client_contact WHERE id=?', _selected_job_client_contact_id);
					if ((rows != null) && (rows.getRowCount() > 0) && (rows.isValidRow())) {
						if ((!is_make_changed) && (_selected_client_contact_id != rows.fieldByName('client_contact_id'))) {
							is_make_changed = true;
						}
						if ((!is_make_changed) && (_client_contact_note != rows.fieldByName('note'))) {
							is_make_changed = true;
						}
					}
					if (rows != null) {
						rows.close();
					}
					db.close();
				}
				return is_make_changed;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _check_if_exist_change');
				return false;
			}
		}
	}
	
	win.addEventListener('focus', function() {
		try {
			if (job_base_cleint_contact_page_obj === null) {
				var F = function() {
				};
				F.prototype = FieldTeam.prototype;
				job_base_cleint_contact_page.prototype = new F();
				job_base_cleint_contact_page.prototype.constructor = job_base_cleint_contact_page;
				job_base_cleint_contact_page_obj = new job_base_cleint_contact_page();
				job_base_cleint_contact_page_obj.init();
			} else {
				job_base_cleint_contact_page_obj.update_field_value_after_set_properites();
			}
		} catch (err) {
			alert(err);
			return;
		}
	});
	
	win.addEventListener('close', function() {
		try {
			job_base_cleint_contact_page_obj.close_window();
			job_base_cleint_contact_page_obj = null;
			win = null;
		} catch (err) {
			aert(err);
			return;
		}
	});
}());