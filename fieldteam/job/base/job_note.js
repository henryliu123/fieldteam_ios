/**
 * Description: note editor
 */

(function() {
	Titanium.include(Ti.App.Properties.getString('base_folder_name') + 'fieldteam.js');
	var win = Titanium.UI.currentWindow;
	var job_base_note_page_obj = null;
	
	function job_base_note_page() {
		var self = this;
		var window_source = 'job_base_note_page';
		if (win.action_for_note == 'edit_job_note') {
			win.title = 'Edit Note';
		} else {
			win.title = 'Add Note';
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
				_init_note_type_field();
				_init_note_description_field();
				if (win.action_for_note == 'edit_job_note') {
					_init_delete_btn();
				}
				// call int_table_view function of parent class:
				// fieldteam.js
				self.init_table_view();
				self.table_view.addEventListener('scroll', function(e) {
					if (_is_note_description_content_field_focused) {
						_selected_field_object.blur();
					}
				});
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
				var db = Titanium.Database.open(self.get_db_name());
				var rows = db.execute('SELECT * FROM my_' + _type + '_note WHERE id=?', _selected_job_note_id);
				if ((rows.getRowCount() > 0) && (rows.isValidRow())) {
					_note_description = rows.fieldByName('description');
					_note_type_code = rows.fieldByName(_type + '_note_type_code');
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
								error_string += self.data[i].valuePrompt;
							}
						} else {
							if (self.data[i].children[self.data[i].valuePosition - 1].value === '') {
								error_string += self.data[i].valuePrompt;
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
					if (_selected_job_note_id > 0) {// update
						db.execute('UPDATE my_' + _type + '_note SET description=?,' + _type + '_note_type_code=?,changed=? ' + ' WHERE id=' + _selected_job_note_id, _note_description, _note_type_code, 1);
					} else {// add
						var new_time_value = parseInt(d.getTime(), 10);
						db.execute('INSERT INTO my_' + _type + '_note (id,local_id,' + _type + '_id,description,' + _type + '_note_type_code,status_code,changed)' + 'VALUES(?,?,?,?,?,?,?)', new_time_value, _selected_company_id + '-' + _selected_user_id + '-' + new_time_value, _selected_job_id, _note_description, _note_type_code, 1, 1);
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
				self.process_simple_error_message(err, window_source + ' - self.nav_right_btn_click_event ');
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
				var index = e.index;
				var filter_class = self.data[index].filter_class;
				switch (filter_class){
					case 'set_note_type':
						_event_for_note_type(e);
						break;
					case 'set_note_description':
						_display_note_edit_page(e);
						break;						
					case 'set_delete_button':
						_event_for_delete_btn();
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
				if (Ti.App.Properties.getBool('update_unique_code_job_note_view_flag')) {
					_note_type_code = Ti.App.Properties.getString('update_unique_code_job_note_view_id');
					if (_current_selected_row != null) {
						_current_selected_row.note_type_code = _note_type_code;
						_current_selected_row.note_type_name = Ti.App.Properties.getString('update_unique_code_job_note_view_content');
						_current_selected_row.children[_current_selected_row.children.length - 1].text = _current_selected_row.note_type_name;
						if ((_current_selected_row.note_type_name === '') || (_current_selected_row.note_type_name === null)) {
							_current_selected_row.children[_current_selected_row.children.length - 1].visible = false;
							_current_selected_row.children[_current_selected_row.children.length - 2].visible = true;
						} else {
							_current_selected_row.children[_current_selected_row.children.length - 1].visible = true;
							_current_selected_row.children[_current_selected_row.children.length - 2].visible = false;
						}
					}
					_is_make_changed = true;
					Ti.App.Properties.setBool('update_unique_code_job_note_view_flag', false);
				}
                                if(Ti.App.Properties.getBool('update_edit_textarea_field_job_note_description_view_flag')){                                         
                                	_note_description = Ti.App.Properties.getString('update_edit_textarea_field_job_note_description_view_content');
                                        if(_current_selected_row != null){
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _note_description;
                                                if((_note_description === '')||( _note_description === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                                                           
                                        }
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('update_edit_textarea_field_job_note_description_view_flag',false);
                                }  				
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.update_field_value_after_set_properite');
				return;
			}
		};
		
		// private member
		var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
		var _selected_company_id = Ti.App.Properties.getString('current_company_id');
		var _type = win.type;
		var _selected_job_id = win.job_id;
		var _selected_job_note_id = win.job_note_id;
		var _note_description = '';
		var _note_type_code = win.job_note_type;
		var _current_selected_row = null;
		var _is_make_changed = false;
		var _is_note_description_content_field_focused = false;
		var _selected_field_object = null;
		var _current_field_num = 0;
		// private method
		/**
		 * init note type field
		 */
		function _init_note_type_field() {
			try {
				_current_field_num++;
				var is_required_field = true;
				var note_type_name = '';
				var db = Titanium.Database.open(self.get_db_name());
				var rows = db.execute('SELECT * FROM my_' + _type + '_note_type_code WHERE code=?', _note_type_code);
				if ((rows.getRowCount() > 0) && (rows.isValidRow())) {
					note_type_name = rows.fieldByName('name');
				} else {
					note_type_name = '';
				}
				rows.close();
				db.close();
				var note_type_field = Ti.UI.createTableViewRow({
					className : 'set_note_type',
					filter_class : 'set_note_type',
					hasChild : true,
					note_type_code : _note_type_code,
					note_type_name : note_type_name,
					valueRequired : is_required_field,
					valuePosition : 3,
					valueType : 'text',
					valuePrompt : 'Please select type.',
					height : ((note_type_name === '') || (note_type_name === null)) ? self.default_table_view_row_height : 'auto'
				});
				var note_type_title_field = Ti.UI.createLabel({
					text : 'Type',
					color : self.font_color,
					font : {
						fontSize : self.font_size,
						fontWeight : self.font_weight
					},
					left : 10
				});
				note_type_field.add(note_type_title_field);
				
				var note_type_required_text_label = Ti.UI.createLabel({
					right : 10,
					height : self.default_table_view_row_height,
					width : self.set_a_field_width_in_table_view_row(note_type_title_field.text),
					textAlign : 'right',
					text : 'Required',
					opacity : self.hint_text_font_opacity,
					color : self.hint_text_font_color,
					font : {
						fontSize : self.normal_font_size
					}
				});
				note_type_field.add(note_type_required_text_label);
				
				var note_type_content_field = Ti.UI.createLabel({
					right : 10,
					height : ((note_type_name === '') || (note_type_name === null)) ? self.default_table_view_row_height : 'auto',
					width : self.set_a_field_width_in_table_view_row(note_type_title_field.text),
					textAlign : 'right',
					text : note_type_name,
					color : self.selected_value_font_color,
					font : {
						fontSize : self.normal_font_size
					}
				});
				note_type_field.add(note_type_content_field);
				self.data.push(note_type_field);
				if ((note_type_name === '') || (note_type_name === null)) {
					note_type_content_field.visible = false;
				} else {
					note_type_required_text_label.visible = false;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_note_type_field');
				return;
			}
		}
		
		function _init_note_description_field() {
			try {
				_current_field_num++;
				var is_required_field = true;
				var note_field = Ti.UI.createTableViewRow({
					className : 'set_note_description',
					filter_class : 'set_note_description',
					valueRequired : is_required_field,// for
					// check
					// value
					valuePosition : 3,// for check
					// value
					valueType : 'text',// for check
					// value
					valuePrompt : 'Please enter description.',// for
					// check
					// value
					height : 'auto',
					hasChild : true
				});
				var note_title_field = Ti.UI.createLabel({
					text : 'Description',
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
					text : _note_description,
					color : self.selected_value_font_color,
					font : {
						fontSize : self.normal_font_size
					}
				});
				note_field.add(note_content_field);
				self.data.push(note_field);
				
				if ((self.trim(_note_description) === '') || (_note_description === null)) {
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
		 * init delete button field
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
		 * event for note type
		 */
		function _event_for_note_type(e) {
			try {
				var note_type_win = Ti.UI.createWindow({
					url : self.get_file_path('url', 'base/select_unique_code_from_table_view.js'),
					win_title : 'Select Note Type',
					existed_id_array : '2',
					table_name : 'my_' + _type + '_note_type_code',// table
					// name
					display_name : 'name',// need to shwo
					// field
					content : e.row.note_type_code,
					content_value : e.row.note_type_name,
					source : 'job_note'
				});
				Titanium.UI.currentTab.open(note_type_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_note_type');
				return;
			}
		}
		/**
		 * display note edit page
		 */
		function _display_note_edit_page(e) {
			try {
				var address_win = Ti.UI.createWindow({
					title : 'Edit Description',
					url : self.get_file_path('url', 'base/edit_textarea_field.js'),
					content : _note_description,
					source : 'job_note_description'
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
		 * event for delete button
		 */
		function _event_for_delete_btn() {
			try {
				var optionDialog = Ti.UI.createOptionDialog({
					options : (self.is_ipad()) ? [ 'YES', 'NO', '' ] : [ 'YES', 'NO' ],
					buttonNames : [ 'Cancel' ],
					destructive : 0,
					cancel : 1,
					title : L('message_delete_note_in_job_note')
				});
				optionDialog.show();
				optionDialog.addEventListener('click', function(e) {
					if (e.index === 0) {
						var db = Titanium.Database.open(self.get_db_name());
						if (_selected_job_note_id > 1000000000) {
							db.execute('DELETE FROM my_' + _type + '_note WHERE id=?', _selected_job_note_id);
						} else {
							db.execute('UPDATE my_' + _type + '_note SET changed=?,status_code=?  WHERE id=' + _selected_job_note_id, 1, 2);
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
					var rows = db.execute('SELECT * FROM my_' + _type + '_note WHERE id=?', _selected_job_note_id);
					if ((rows.getRowCount() > 0) && (rows.isValidRow())) {
						if (_note_type_code != rows.fieldByName(_type + '_note_type_code')) {
							is_make_changed = true;
						}
						if ((!is_make_changed) && (_note_description != rows.fieldByName('description'))) {
							is_make_changed = true;
						}
					}
					rows.close();
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
			if (job_base_note_page_obj === null) {
				var F = function() {
				};
				F.prototype = FieldTeam.prototype;
				job_base_note_page.prototype = new F();
				job_base_note_page.prototype.constructor = job_base_note_page;
				job_base_note_page_obj = new job_base_note_page();
				job_base_note_page_obj.init();
			} else {
				job_base_note_page_obj.update_field_value_after_set_properites();
			}
		} catch (err) {
			alert(err);
			return;
		}
	});
	
	win.addEventListener('close', function() {
		try {
			job_base_note_page_obj.close_window();
			job_base_note_page_obj = null;
			win = null;
		} catch (err) {
			alert(err);
			return;
		}
	});
}());