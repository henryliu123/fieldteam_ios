//display job detail
(function() {
	Titanium.include(Ti.App.Properties.getString('base_folder_name') + 'operate_camera.js');
	var win = Titanium.UI.currentWindow;
	var job_edit_job_material_page_obj = null;
	
	function job_edit_job_material_page() {
		var self = this;
		var window_source = 'job_edit_job_material_page';
		win.title = self.ucfirst(win.type) + ' Materials';
		
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
				if (!_is_task) {
					self.init_navigation_bar('Add', 'Main,Back');
				} else {
					self.init_navigation_bar('', 'Main,Back');
				}
				self.init_vars();
				if (!_is_task) {
					_init_bottom_tool_bar();
				}
				// call init_table_view function of parent
				// class: fieldteam.js
				self.init_table_view();
				if (!_is_task) {
					self.table_view.bottom = self.default_table_view_row_height;
				}
				// call init_no_result_label function of parent
				// class: fieldteam.js
				self.init_no_result_label();
				_cancel_button = Titanium.UI.createButton({
					systemButton : Titanium.UI.iPhone.SystemButton.CANCEL
				});
				_cancel_button.addEventListener('click', function() {
					win.setRightNavButton(self.nav_right_btn);
					self.table_view.editing = false;
					self.bottom_tool_bar.visible = true;
				});
				self.table_view.addEventListener('delete', function(e) {
					_event_for_delete_btn(e);
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.init');
				return;
			}
		};
		/**
		 * override ini_vars function of parent class: fieldteam.js
		 */
		self.init_vars = function() {
			try {
				_display_material_item();
				_display_material_file();
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.init_vars');
				return;
			}
		};
		/**
		 * display result list
		 */
		self.display = function() {
			try {
				self.data = [];
				self.table_view.setData([]);
				self.init_vars();
				if (self.data.length > 0) {
					self.no_result_label.visible = false;
				} else {
					self.no_result_label.visible = true;
				}
				self.table_view.setData(self.data, {
					animationStyle : Titanium.UI.iPhone.RowAnimationStyle.DOWN
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.display');
				return;
			}
		};
		/**
		 * override event_for_table_view_click function of parent class:
		 * fieldteam.js
		 */
		self.table_view_click_event = function(e) {
			try {
				if (e.row.filter_class === 'job_material_item') {
					var material_win = Ti.UI.createWindow({
						url : self.get_file_path('url', 'job/base/job_material_detail.js'),
						type : _type,
						job_id : e.row.job_id,
						job_assigned_item_id : e.row.job_assigned_item_id,
						job_library_item_id : e.row.job_library_item_id
					});
					Titanium.UI.currentTab.open(material_win, {
						animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
					});
				} else {// file
					if (e.source.name === 'upload_btn') {
						_upload_media_file();
					} else {
						var new_win = Titanium.UI.createWindow({
							type : _type,
							url : self.get_file_path('url', 'job/base/job_display_file.js'),
							job_id : e.row.job_id,
							job_reference_number : _selected_job_reference_number,
							asset_id : e.row.asset_id,
							asset_type_name : e.row.asset_type_name,
							asset_type_code : e.row.asset_type_code,
							asset_type_path : e.row.asset_type_path,
							asset_mime_type : e.row.asset_mime_type,
							file_name : e.row.path_original
						});
						Titanium.UI.currentTab.open(new_win, {
							animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
						});
					}
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.table_view_click_event');
				return;
			}
		};
		/**
		 * override nav_right_btn_click_event function of parent class:
		 * fieldteam.js
		 */
		self.nav_right_btn_click_event = function(e) {
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
									self.show_camera('', _selected_job_id, _selected_job_reference_number, _selected_company_id, _type, _asset_type_path, _asset_type_code);
								}
								if (e.index === 1) {
									self.show_library('', _selected_job_id, _selected_job_reference_number, _selected_company_id, _type, _asset_type_path, _asset_type_code);
								}
								if (e.index === 2) {
									_show_audio(_asset_type_code, _asset_type_path);
								}
							});
							break;
					}
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.nav_right_btn_click_event');
				return;
			}
		};
		
		// private member
		var _type = win.type;
		var _selected_job_id = win.job_id;
		var _selected_job_reference_number = win.job_reference_number;
		var _action_for_job = win.action_for_job;
		var _selected_company_id = Ti.App.Properties.getString('current_company_id');
		var _asset_type_path = win.asset_type_path;
		var _asset_type_code = win.asset_type_code;
		var _file_folder = self.file_directory + _selected_company_id + '/' + _type + '/' + _selected_job_reference_number + '/' + _asset_type_path;
		var _upload_btn = null;
		var _cancel_button = null;
		var _selected_currency = self.get_selected_currency();
		var _is_task = (win.is_task == undefined) ? false : win.is_task;
		// private method
		
		function _init_bottom_tool_bar() {
			try {
				var flexSpace = Titanium.UI.createButton({
					systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
				});
				// add action button
				self.trash_button = Ti.UI.createButton({
					systemButton : Titanium.UI.iPhone.SystemButton.TRASH
				});
				
				self.bottom_tool_bar = Ti.UI.iOS.createToolbar({
					items : [ flexSpace, self.trash_button, flexSpace ],
					bottom : 0,
					borderColor : self.tool_bar_color_in_ios_7,
					borderWidth : 1,
					zIndex : 100
				});
				win.add(self.bottom_tool_bar);
				
				self.trash_button.addEventListener('click', function(e) {
					win.setRightNavButton(_cancel_button);
					self.table_view.editing = true;
					self.bottom_tool_bar.visible = false;
					self.table_view.bottom = 0;
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_bottom_tool_bar');
				return;
			}
		}
		/**
		 * display material item list
		 */
		function _display_material_item() {
			try {
				var db = Titanium.Database.open(self.get_db_name());
				var rows = db.execute('SELECT a.*,b.name as location_name,c.price as price,c.item_name as item_name FROM my_' + _type + '_assigned_item as a ' + 'left join my_materials_locations b on (b.id = a.materials_locations_id)' + 'left join my_job_library_item c on (a.job_library_item_id= c.id) ' + 'WHERE a.status_code=1 and a.' + _type + '_id=? ORDER BY a.id desc', _selected_job_id);
				var b = self.data.length;
				if (rows.getRowCount() > 0) {
					while (rows.isValidRow()) {
						var new_text = '';
						var price = (rows.fieldByName('price') == null) ? 0 : rows.fieldByName('price');
						new_text += 'Name : ' + ((rows.fieldByName('item_name') == null) ? 'Unknown' : rows.fieldByName('item_name')) + '\n';
						new_text += 'Units : ' + rows.fieldByName('units') + '\n';
						new_text += 'Price : ' + _selected_currency + self.currency_formatted(rows.fieldByName('units') * price) + '\n';
						new_text += 'Source : ' + (((rows.fieldByName('location_name') == '') || (rows.fieldByName('location_name') == null)) ? 'N/A' : rows.fieldByName('location_name')) + '\n';
						var new_row = null;
						if (b === 0) {
							new_row = Ti.UI.createTableViewRow({
								className : 'data_row_' + b,
								filter_class : 'job_material_item',
								height : 130,
								hasChild : true,
								job_id : rows.fieldByName(_type + '_id'),
								job_reference_number : _selected_job_reference_number,
								job_assigned_item_id : rows.fieldByName('id'),
								job_library_item_id : rows.fieldByName('job_library_item_id'),
								units : rows.fieldByName('units'),
								header : 'Materials Item'
							});
						} else {
							new_row = Ti.UI.createTableViewRow({
								className : 'data_row_' + b,
								filter_class : 'job_material_item',
								height : 130,
								hasChild : true,
								job_id : rows.fieldByName(_type + '_id'),
								job_reference_number : _selected_job_reference_number,
								job_assigned_item_id : rows.fieldByName('id'),
								job_library_item_id : rows.fieldByName('job_library_item_id'),
								units : rows.fieldByName('units')
							});
						}
						var thumb = Ti.UI.createImageView({
							image : self.get_file_path('image', 'media_type/material.jpg'),
							width : self.default_thumb_image_width,
							height : self.default_thumb_image_width,
							left : 10,
							top : (130 - self.default_thumb_image_width) / 2,
							bottom : (130 - self.default_thumb_image_width) / 2
						});
						new_row.add(thumb);
						new_row.add(Ti.UI.createLabel({
							text : new_text,
							textAlign : 'left',
							width : self.screen_width - self.default_thumb_image_width - 60,
							left : self.default_thumb_image_width + 15,
							top : 10,
							bottom : 10
						}));
						self.data.push(new_row);
						rows.next();
						b++;
					}
				}
				rows.close();
				db.close();
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _display_material_item');
				return;
			}
		}
		/**
		 * display material file list
		 */
		function _display_material_file() {
			try {
				var db = Titanium.Database.open(self.get_db_name());
				var i = 0;
				var b = self.data.length;
				var asset_row = db.execute('SELECT * FROM my_' + _type + '_asset_type_code WHERE code=?', self.materials_type_code);
				var rows = db.execute('SELECT * FROM my_' + _type + '_asset WHERE status_code=1 and ' + _type + '_asset_type_code=? and ' + _type + '_id=? ORDER BY id desc', self.materials_type_code, _selected_job_id);
				if (rows.getRowCount() > 0) {
					while (rows.isValidRow()) {
						var temp_upload_flag = -1;
						var temp_uploading_record_id = null;
						var new_text = '';
						new_text += 'Name : ' + rows.fieldByName('name') + '\n';
						var temp_row = db.execute('SELECT * FROM my_updating_records where type=? and updating_id=?', _type, rows.fieldByName('local_id'));
						if (temp_row.isValidRow()) {
							temp_upload_flag = temp_row.fieldByName('upload_status');
							temp_uploading_record_id = temp_row.fieldByName('id');
							switch (temp_row.fieldByName('upload_status')){
								case 0://
									new_text += 'Not Uploaded';
									break;
								case 1://
									new_text += 'Uploading';
									break;
								case 2://
									new_text += 'Completed';
									break;
								case 3://
									new_text += 'Failed';
									break;
								default:
									new_text += 'From Server';
							}
						} else {
							if (rows.fieldByName('id') > 1000000000) {
								new_text += 'Not Uploaded';
							} else {
								var temp_row2 = db.execute('SELECT * FROM my_updating_records_for_data where type=? and updating_id=?', _type, rows.fieldByName('local_id'));
								if (temp_row2.isValidRow()) {
									new_text += 'Not Uploaded';
								} else {
									new_text += 'From Server';
								}
								temp_row2.close();
							}
						}
						new_text += '\n';
						new_text += 'Description : ' + ((rows.fieldByName('description') === null) ? '' : rows.fieldByName('description')) + '\n';
						var new_row = Ti.UI.createTableViewRow({
							className : 'data_row_' + b,
							filter_class : 'job_material_file',
							hasChild : true,
							height : (temp_upload_flag === 3) ? 160 : 120,
							uploading_record_id : temp_uploading_record_id,
							job_id : rows.fieldByName(_type + '_id'),
							asset_id : rows.fieldByName('id'),
							asset_type_name : asset_row.fieldByName('name'),
							asset_type_path : asset_row.fieldByName('path'),
							asset_type_code : asset_row.fieldByName('code'),
							asset_mime_type : rows.fieldByName('mime_type'),
							path_original : rows.fieldByName('path_original')
						});
						if (i == 0) {
							new_row.header = 'Material Files';
						}
						var asset_file_obj = null;
						var asset_mime_type = rows.fieldByName('mime_type');
						var asset_mime_type_array = asset_mime_type.split('/');
						var temp_asset_mime_type_name = (asset_mime_type_array.length > 0) ? asset_mime_type_array[0] : '';
						var asset_thumb_width = self.default_thumb_image_width;
						var asset_thumb_height = self.default_thumb_image_width;
						switch (temp_asset_mime_type_name){
							case 'image':
								var file_name_array = rows.fieldByName('path_original').split('/');
								asset_file_obj = Ti.Filesystem.getFile(_file_folder, 'thumb_' + file_name_array[file_name_array.length - 1]);
								if (asset_file_obj.exists()) {
									var blob = asset_file_obj.toBlob();
									asset_thumb_width = blob.width;
									asset_thumb_height = blob.height;
								} else {
									asset_file_obj = self.get_file_path('image', 'media_type/photo.png');
								}
								break;
							case 'audio':
								asset_file_obj = self.get_file_path('image', 'media_type/audio.jpg');// '../../../images/flag/audio.png';
								break;
							case 'video':
								asset_file_obj = self.get_file_path('image', 'media_type/video.png');
								break;
							default:
								asset_file_obj = self.get_file_path('image', 'media_type/pdf.png');
						}
						var thumb = Ti.UI.createImageView({
							image : asset_file_obj,
							width : asset_thumb_width,
							height : asset_thumb_height,
							left : 10,
							top : (120 - asset_thumb_height) / 2,
							bottom : (temp_upload_flag === 3) ? 40 : (120 - asset_thumb_height) / 2
						});
						new_row.add(thumb);
						
						if (temp_upload_flag === 3) {
							_upload_btn = Ti.UI.createButton({
								name : 'upload_btn',
								backgroundImage : self.get_file_path('image', 'BUTT_grn_off.png'),
								color : '#fff',
								font : {
									fontSize : 12,
									fontWeight : 'bold'
								},
								title : 'Upload',
								textAlign : 'center',
								style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
								bottom : 5,
								left : 10,
								height : 30,
								width : asset_thumb_width
							});
							new_row.add(_upload_btn);
						}
						
						new_row.add(Ti.UI.createLabel({
							text : new_text,
							textAlign : 'left',
							height : 'auto',
							width : 'auto',
							left : self.default_thumb_image_width + 15,
							top : 10,
							bottom : 10
						}));
						self.data.push(new_row);
						rows.next();
						i++;
						b++;
					}
				}
				rows.close();
				db.close();
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _display_material_file');
				return;
			}
		}
		/**
		 * add material item
		 */
		function _event_add_material_item() {
			try {
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
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_add_material_item');
				return;
			}
		}
		/**
		 * add material file
		 */
		function _event_add_material_file() {
			try {
				var optionDialog2 = Ti.UI.createOptionDialog({
					options : (self.is_ipad()) ? [ 'From Camera', 'From Library', 'Add Audio', 'Cancel', '' ] : [ 'From Camera', 'From Library', 'Add Audio', 'Cancel' ],
					buttonNames : [ 'Cancel' ],
					destructive : 0,
					cancel : 3,
					title : L('message_select_option')
				});
				optionDialog2.show();
				optionDialog2.addEventListener('click', function(e) {
					if (e.index == 0) {
						self.show_camera('', _selected_job_id, _selected_job_reference_number, _selected_company_id, _type, _asset_type_path, _asset_type_code);
					}
					if (e.index == 1) {
						self.show_library('', _selected_job_id, _selected_job_reference_number, _selected_company_id, _type, _asset_type_path, _asset_type_code);
					}
					if (e.index === 2) {
						_show_audio();
					}
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_add_material_file');
				return;
			}
		}
		/**
		 * delete material item and file
		 */
		function _event_for_delete_btn(e) {
			try {
				var job_assigned_item_id = e.row.job_assigned_item_id;
				if (job_assigned_item_id != undefined) {
					var db = Titanium.Database.open(self.get_db_name());
					if (job_assigned_item_id > 1000000000) {
						db.execute('DELETE FROM my_' + _type + '_assigned_item WHERE id=?', job_assigned_item_id);
					} else {
						db.execute('UPDATE my_' + _type + '_assigned_item SET changed=?,status_code=?  WHERE id=' + job_assigned_item_id, 1, 2);
					}
					db.close();
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_delete_btn');
				return;
			}
		}
		/**
		 * display audio
		 */
		function _show_audio() {
			try {
				var new_win = Titanium.UI.createWindow({
					type : _type,
					url : self.get_file_path('url', 'job/base/job_create_audio.js'),
					job_id : _selected_job_id,
					job_reference_number : _selected_job_reference_number,
					asset_id : 0,
					asset_type_code : _asset_type_code,
					asset_type_path : _asset_type_path
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
		 * upload media file
		 */
		function _upload_media_file() {
			try {
				var db = Titanium.Database.open(self.get_db_name());
				db.execute('UPDATE my_updating_records SET upload_status=0,failure_times=0 WHERE relation_id=? and type=? and upload_status in (1,3)', _selected_job_id, _type);
				db.close();
				win.close();
				Ti.App.fireEvent('reset_upload_file_flag');
				Ti.App.fireEvent('async_save_data');
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _upload_media_file');
				return;
			}
		}
	}
	
	win.addEventListener('focus', function() {
		try {
			if (job_edit_job_material_page_obj === null) {
				var F = function() {
				};
				F.prototype = operate_camera_page.prototype;
				job_edit_job_material_page.prototype = new F();
				job_edit_job_material_page.prototype.constructor = job_edit_job_material_page;
				job_edit_job_material_page_obj = new job_edit_job_material_page();
				job_edit_job_material_page_obj.init();
			} else {
				job_edit_job_material_page_obj.display();
			}
		} catch (err) {
			alert(err);
			return;
		}
	});
	
	win.addEventListener('close', function() {
		try {
			job_edit_job_material_page_obj.close_window();
			job_edit_job_material_page_obj = null;
			win = null;
		} catch (err) {
			alert(err);
			return;
		}
	});
}());
