/**
 * Description: quick watch photos, user can see all photos of selected job and
 * download large photo etc.
 * 
 */

(function() {
	Titanium.include(Ti.App.Properties.getString('base_folder_name') + 'fieldteam.js');
	var win = Titanium.UI.currentWindow;
	var job_base_photo_flow_page_obj = null;
	function job_base_photo_flow_page() {
		var self = this;
		var window_source = 'job_base_photo_flow_page';
		win.title = 'Media';
		
		// public method
		/**
		 * override init function of parent class: fieldteam.js
		 */
		self.init = function() {
			try {
				self.init_auto_release_pool(win);
				self.data = [];
				// call init_navigation_bar function of parent
				// class:
				// fieldteam.js
				self.init_navigation_bar('Edit', 'Main,Back');
				self.init_vars();
				_init_controls();
				_init_bottom_tool_bar();
				_check_file_if_exist();
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
				var rows = db.execute('SELECT * FROM my_' + _type + '_asset WHERE status_code=1 and ' + _type + '_asset_type_code=? and ' + _type + '_id=?', _asset_type_code, _selected_job_id);
				var b = 1;
				if (rows.getRowCount() > 0) {
					while (rows.isValidRow()) {
						var file_name_array = [];
						var temp_file_name = ((rows.fieldByName('path_original') === null) || (rows.fieldByName('path_original') === '')) ? rows.fieldByName('path') : rows.fieldByName('path_original');
						file_name_array = temp_file_name.split('/');
						var asset_file_obj = Ti.Filesystem.getFile(_file_folder, file_name_array[file_name_array.length - 1]);
						var baseHeight = asset_file_obj.toBlob().height;
						var baseWidth = asset_file_obj.toBlob().width;
						var temp_var = null;
						if (asset_file_obj.exists()) {
							temp_var = {
								'id' : rows.fieldByName('id'),
								'path_original' : rows.fieldByName('path_original'),
								'exist' : true
							};
						} else {
							_asset_type_path.push(file_name_array[file_name_array.length - 1]);
							temp_var = {
								'id' : rows.fieldByName('id'),
								'path_original' : rows.fieldByName('path_original'),
								'exist' : false
							};
						}
						// _image_data.push(_file_folder+'/resized_'+file_name_array[file_name_array.length-1]);
						_image_info_data.push(temp_var);
						var asset_view_container = Ti.UI.createView({
							width : self.screen_width,
							height : 'auto'
						});
						var asset_view = null;
						var thumbnail_asset_view = null;
						var playBtn = null;
						var bottomGap = 0;
						if (!asset_file_obj.exists()) {
							//display icons
							bottomGap = (self.screen_height-(self.screen_height*72/self.screen_width)-20-2*self.tool_bar_height)/2;
						}else{
							bottomGap = (self.screen_height-(self.screen_width * baseHeight / baseWidth)-20-2*self.tool_bar_height)/2;
						}			
						var mimeType = rows.fieldByName('mime_type');
						var mimeTypeArray = mimeType.split('/');
						var realMimeType = (mimeTypeArray==null || mimeTypeArray == undefined)?'default':mimeTypeArray[0];
						switch (realMimeType){
							case 'application':
								asset_view = Ti.UI.createWebView({
									mime_type_name : 'document',
									media_url : _file_folder + '/' + file_name_array[file_name_array.length - 1],
									backgroundColor : '#fff',
									top:0,
									bottom:0,
									scalespageToFilt : true,
									height : self.screen_height,
									width : self.screen_width,
									url : _file_folder + '/' + file_name_array[file_name_array.length - 1]
								});
								break;
							case 'image':							
								asset_view = Ti.UI.createImageView({
									asset_id : rows.fieldByName('id'),
									mime_type_name : 'image',
									media_url : _file_folder + '/' + file_name_array[file_name_array.length - 1],
									scaled : false,
									full_screen : false,
									backgroundColor : '#000',
									baseHeight : baseHeight,
									baseWidth : baseWidth,
									height : self.screen_width * baseHeight / baseWidth,
									width : self.screen_width,
									image : _file_folder + '/' + file_name_array[file_name_array.length - 1],
									bottom:bottomGap
								});

								break;
							case 'video':
								var videoNameArray = file_name_array[file_name_array.length - 1].split('.');
								var videoThumbFileName = 'thumb_';
								for(var i=0,j=videoNameArray.length-1;i<j;i++){
									videoThumbFileName += videoNameArray[i]+'.';
								}
								videoThumbFileName+= 'jpg';
								//var videoThumbFileName = 'thumb_' + self.replace(file_name_array[file_name_array.length - 1], '.mp4', '.jpg');// remove
								// '
								// symbol'
								asset_file_obj = Ti.Filesystem.getFile(_file_folder, videoThumbFileName);
								thumbnail_asset_view = Ti.UI.createImageView({
									mime_type_name : 'video',
									backgroundColor : '#000',
									baseHeight : baseHeight,
									baseWidth : baseWidth,
									height : self.screen_width * baseHeight / baseWidth,
									width : self.screen_width,
									scaled : false,
									full_screen : false,
									//image : (asset_file_obj.exists()) ? _file_folder + '/' + videoThumbFileName : self.get_file_path('image', 'media_type/video.png'),
									bottom:bottomGap
								});
								asset_view_container.add(thumbnail_asset_view);
								
								playBtn = Ti.UI.createImageView({
									mime_type_name : 'video',
									media_url : _file_folder + '/' + file_name_array[file_name_array.length - 1],
									height : 100,
									width : 100,
									left : (self.screen_width-100)/2,
									image : self.get_file_path('image', 'camera/play-circle-o.png'),
									bottom:(self.screen_width-100)/2+50,
								});
								
								asset_view = Ti.UI.createView({
									asset_id : rows.fieldByName('id'),
									mime_type_name : 'video',
									media_url : _file_folder + '/' + videoThumbFileName,
									width : self.screen_width,
									height : self.screen_height,
									backgroundColor : '#fff',
									opacity : 0.5
								});
								asset_view.add(playBtn);
								break;
							case 'audio':
								thumbnail_asset_view = Ti.UI.createImageView({
									mime_type_name : 'audio',
									backgroundColor : '#000',
									baseHeight : baseHeight,
									baseWidth : baseWidth,
									height : self.screen_width * baseHeight / baseWidth,
									width : self.screen_width,
									//image : self.get_file_path('image', 'media_type/audio.png'),
									bottom:bottomGap
								});
								asset_view_container.add(thumbnail_asset_view);
								
								playBtn = Ti.UI.createImageView({
									mime_type_name : 'audio',
									media_url : _file_folder + '/' + file_name_array[file_name_array.length - 1],
									height : 100,
									width : 100,
									left : (self.screen_width-100)/2,
									image : self.get_file_path('image', 'camera/volume-up.png'),
									bottom:(self.screen_width-100)/2+50,
								});
								
								asset_view = Ti.UI.createView({
									asset_id : rows.fieldByName('id'),
									mime_type_name : 'audio',
									media_url : _file_folder + '/' + file_name_array[file_name_array.length - 1],
									width : self.screen_width,
									height : self.screen_height,
									backgroundColor : '#fff',
									opacity : 0.5
								});
								asset_view.add(playBtn);
								break;
							default:
								asset_file_obj = Ti.Filesystem.getFile(_file_folder, file_name_array[file_name_array.length - 1]);
								thumbnail_asset_view = Ti.UI.createImageView({
									mime_type_name : 'document',
									backgroundColor : '#000',
									scaled : false,
									full_screen : false,
									baseHeight : baseHeight,
									baseWidth : baseWidth,
									height : self.screen_width * baseHeight / baseWidth,
									width : self.screen_width,
									image : self.get_file_path('image', 'media_type/pdf.png'),
									bottom: (self.screen_height-(self.screen_width * baseHeight / baseWidth)-20-2*self.tool_bar_height)/2
								});
								asset_view_container.add(thumbnail_asset_view);
								
								asset_view = Ti.UI.createView({
									asset_id : rows.fieldByName('id'),
									mime_type_name : 'document',
									media_url : _file_folder + '/' + file_name_array[file_name_array.length - 1],
									width : self.screen_width,
									height : self.screen_height,
									backgroundColor : '#fff',
									opacity : 0.5
								});
						}
						
						asset_view_container.add(asset_view);
						asset_view.addEventListener('click', function(e) {
							if (!e.source.full_screen) {
								self.display_indicator('Loading Data ...');
								var asset_file_obj = Titanium.Filesystem.getFile(e.source.media_url);
								if (!asset_file_obj.exists()) {
									self.hide_indicator();
									self.show_message(L('message_failure_open_file'));
									return;
								}
								var new_win = Titanium.UI.createWindow({
									backgroundColor : (e.source.mime_type_name == 'audio') ? '#fff' : '#000',
									type : _type,
									fullscreen : true,
									url : self.get_file_path('url', 'job/base/job_display_file_with_fullscreen.js'),// (e.row.asset_type_name.toLowerCase()
									// ===
									// 'photo')?self.get_file_path('url',
									// 'job/base/job_photo_flow.js'):self.get_file_path('url',
									// 'job/base/job_display_file.js'),
									job_id : _selected_job_id,
									job_reference_number : _selected_job_reference_number,
									asset_id : e.source.asset_id,
									asset_mime_type : e.source.mime_type_name,
									media_url : e.source.media_url
								});
								setTimeout(function() {
									self.hide_indicator();
									new_win.open();
								}, 500);
							}
						});
						_image_data.push(asset_view_container);
						b++;
						rows.next();
					}
				}
				win.title = 'Media (' + (_current_index + 1) + ' of ' + _image_info_data.length + ')';
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
				var new_win = Ti.UI.createWindow({
					url : self.get_file_path('url', 'job/base/job_asset_content.js'),
					type : _type,
					asset_id : _image_info_data[_current_index].id,
					asset_type_name : 'photo',
					parent_win : win
				});
				Titanium.UI.currentTab.open(new_win, {
					animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - self.nav_right_btn_click_event');
				return;
			}
		};
		
		// private member
		var _type = win.type;
		var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
		var _selected_company_id = Ti.App.Properties.getString('current_company_id');
		var _selected_job_id = win.job_id;
		var _selected_job_reference_number = win.job_reference_number;
		var _asset_type_code = win.asset_type_code;
		var _xhr = null;
		// var _asset_type_path = win.asset_type_path;
		
		var _image_data = [];
		var _image_info_data = [];
		var _current_index = win.current_index;
		
		var _asset_type_path = [];
		var _file_folder = self.file_directory + _selected_company_id + '/' + _type + '/' + _selected_job_reference_number + '/' + win.asset_type_path;
		var _file_folder_url = self.get_media_url() + '/' + _selected_company_id + '/' + _type + '/' + _selected_job_reference_number + '/' + win.asset_type_path + '/';
		var _failure_download_file_number = 0;
		// private method
		/**
		 * init createScrollableView control
		 */
		function _init_controls() {
			try {
				self.cover_flow_view = Titanium.UI.createScrollableView({
					bottom : self.default_table_view_row_height,
					left : -10,
					width : self.screen_width + 20,
					height : self.screen_height,
					backgroundColor : '#000',
					views : _image_data,
					showPagingControl : false,
					currentPage : _current_index
				});
				win.add(self.cover_flow_view);
				
				self.cover_flow_view.addEventListener('scroll', function(e) {
					_current_index = e.currentPage;
					win.title = 'Files (' + (_current_index + 1) + ' of ' + _image_info_data.length + ')';
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_controls');
				return;
			}
		}
		
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
					backgroundColor : '#fff',
					items : [ flexSpace, self.trash_button, flexSpace ],
					bottom : 0,
					zIndex : 100,
					opacity : 0.8
				});
				win.add(self.bottom_tool_bar);
				
				self.trash_button.addEventListener('click', function(e) {
					var optionDialog = Ti.UI.createOptionDialog({
						options : (self.is_ipad()) ? [ 'YES', 'NO', '' ] : [ 'YES', 'NO' ],
						buttonNames : [ 'Cancel' ],
						destructive : 0,
						cancel : 1,
						title : 'Are you sure delete this file?'
					});
					optionDialog.show();
					optionDialog.addEventListener('click', function(e) {
						if (e.index == 0) {
							_event_for_delete_btn();
						}
					});
				});
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _init_bottom_tool_bar');
				return;
			}
		}
		/**
		 * check file if exist or not
		 */
		function _check_file_if_exist() {
			try {
				if (_asset_type_path.length > 0) {
					var option_dialog = Ti.UI.createOptionDialog({
						options : (self.is_ipad()) ? [ 'YES', 'NO', '' ] : [ 'YES', 'NO' ],
						buttonNames : [ 'Cancel' ],
						destructive : 0,
						cancel : 1,
						title : L('message_not_exist_in_job_photo_flow')
					});
					option_dialog.show();
					option_dialog.addEventListener('click', function(e) {
						if (e.index == 0) {
							_download_file();
						} else {
							// self.cover_flow_view.views
							// = _image_data;
							// self.cover_flow_view.currentPage
							// =
							// _current_index;
						}
					});
				} else {
					// self.cover_flow_view.views =
					// _image_data;
					// self.cover_flow_view.currentPage =
					// _current_index;
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _check_file_if_exist');
				return;
			}
		}
		/**
		 * download file if this file isn't exist in local
		 */
		function _download_file() {
			try {
				if (!Ti.Network.online) {
					self.show_message(L('message_offline'), L('message_unable_to_connect'));
					return;
				} else {
					if (_asset_type_path.length > 0) {
						self.display_indicator('Downloading Files (1/' + _asset_type_path.length + ')...', true, true);
						_inline_download_function(0);
					}
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _download_file');
				return;
			}
		}
		/**
		 * prev pic button event
		 */
		function _event_for_left_btn() {
			try {
				if (_current_index == 0) {
					return;
				}
				_current_index--;
				self.cover_flow_view.scrollToView(_current_index);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_left_btn');
				return;
			}
		}
		/**
		 * next pic button event
		 */
		function _event_for_right_btn() {
			try {
				if (_current_index == (self.cover_flow_view.views.length - 1)) {
					return;
				}
				_current_index++;
				self.cover_flow_view.scrollToView(self.cover_flow_view.views[_current_index]);
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _event_for_right_btn');
				return;
			}
		}
		
		/**
		 * delete media files
		 */
		function _event_for_delete_btn() {
			try {
				self.display_indicator('Deleting ...', false);
				var asset_id = _image_info_data[_current_index].id;
				var db = Titanium.Database.open(self.get_db_name());
				var temp_local_id = 0;
				var temp_asset_path = '';
				var temp_asset_path_original = '';
				var temp_asset_mime_type = '';
				var temp_row = db.execute('SELECT * FROM my_' + _type + '_asset WHERE id=?', asset_id);
				if (temp_row.isValidRow()) {
					temp_local_id = temp_row.fieldByName('local_id');
					temp_asset_path = temp_row.fieldByName('path');
					temp_asset_path_original = temp_row.fieldByName('path_original');
					Ti.API.info('temp_asset_path_original:' + temp_asset_path_original);
					if (temp_asset_path_original == null || temp_asset_path_original == '') {
						temp_asset_path_original = temp_asset_path;
					}
					temp_asset_mime_type = temp_row.fieldByName('mime_type');
				}
				temp_row.close();
				if (asset_id > 1000000000) {
					db.execute('DELETE FROM my_' + _type + '_asset WHERE id=?', asset_id);
				} else {
					db.execute('UPDATE my_' + _type + '_asset SET changed=?,status_code=?  WHERE id=' + asset_id, 1, 2);
				}
				db.close();
				
				// remove file from phone
				if (temp_asset_path_original != '') {
					var temp_asset_path_array = temp_asset_path_original.split('/');
					var temp_file_name = temp_asset_path_array[temp_asset_path_array.length - 1];
					var temp_file_first_path = '';
					for ( var i = 0, j = temp_asset_path_array.length - 1; i < j; i++) {
						if (i === 0) {
							temp_file_first_path = temp_asset_path_array[0];
						} else {
							temp_file_first_path += '/' + temp_asset_path_array[i];
						}
					}
					if (temp_file_name != '') {
						// delete original file
						var file_obj = Titanium.Filesystem.getFile(self.file_directory + temp_file_first_path, temp_file_name);
						if (file_obj.exists()) {
							file_obj.deleteFile();
						}
						
						if (temp_asset_mime_type != '') {
							var temp_asset_mime_type_array = temp_asset_mime_type.split('/');
							if (temp_asset_mime_type_array[0].toLowerCase() === 'image') {
								// delete resize
								// file
//								file_obj = Titanium.Filesystem.getFile(self.file_directory + temp_file_first_path, '/resized_' + temp_file_name);
//								if (file_obj.exists()) {
//									file_obj.deleteFile();
//								}
								// delete thumb
								// file
								file_obj = Titanium.Filesystem.getFile(self.file_directory + temp_file_first_path, '/thumb_' + temp_file_name);
								if (file_obj.exists()) {
									file_obj.deleteFile();
								}
							}
						}
					}
					
				}
				if (temp_local_id != undefined && temp_local_id != null && temp_local_id != '') {
					db = Titanium.Database.open(self.get_db_name());
					// update my_updating_records table
					temp_row = db.execute('SELECT * FROM my_updating_records WHERE company_id=? and type=? and updating_id=?', _selected_company_id, _type, temp_local_id);
					if (temp_row.isValidRow()) {
						db.execute('DELETE FROM my_updating_records WHERE company_id=? and type=? and updating_id=?', _selected_company_id, _type, temp_local_id);
					}
					temp_row.close();
					
                                        temp_row = db.execute('SELECT * FROM my_updating_records_for_data WHERE upload_status !=1 and company_id=? and type=? and updating_id=?',_selected_company_id,_type,temp_local_id);
                                        if(temp_row.isValidRow()){
                                                db.execute('DELETE FROM my_updating_records_for_data WHERE upload_status !=1 and company_id=? and type=? and updating_id=?',_selected_company_id,_type,temp_local_id);
                                        }
                                        temp_row.close();                                         
                                        
                                        temp_row = db.execute('SELECT * FROM my_updating_errors_for_data WHERE company_id=? and type=? and updating_id=?',_selected_company_id,_type,temp_local_id);
                                        if(temp_row.isValidRow()){
                                                db.execute('DELETE FROM my_updating_errors_for_data WHERE company_id=? and type=? and updating_id=?',_selected_company_id,_type,temp_local_id);
                                        }
                                        temp_row.close();    					
					db.close();
				}
				
				// remove data from photo flows
				_image_data.splice(_current_index, 1);
				_image_info_data.splice(_current_index, 1);
				if (_image_data.length > 0) {
					// self.cover_flow_view.remove(_image_data[_current_index]);
					self.cover_flow_view.views = _image_data;
					win.title = 'Files (' + (_current_index + 1) + ' of ' + _image_data.length + ')';
					setTimeout(function() {
						self.hide_indicator();
					}, 1000);
				} else {
					_image_data = [];
					_image_info_data = [];
					self.cover_flow_view.views = [];
					self.hide_indicator();
					win.close();
				}
			} catch (err) {
				self.hide_indicator();
				self.process_simple_error_message(err, window_source + ' - _event_for_delete_btn');
				return;
			}
		}
		
		/*
		 * create a resized image, fit the device size image_type is
		 * thumb or resized , resized image only for cover flow
		 */
		function _get_resized_image(origin_file_name, image_type, media_type) {
			try {
				var origin_image = Ti.Filesystem.getFile(_file_folder, origin_file_name);
				if (!origin_image.exists()) {
					return;
				}
				var tempObject = origin_image.read();
				switch (media_type){
					case 'image':
						if (image_type == 'thumb') {
							if (tempObject.height == undefined || tempObject.height == null || tempObject.width == undefined || tempObject.width == null) {
								tempObject = tempObject.imageAsResized(self.default_thumb_image_width, (self.screen_height * self.default_thumb_image_width / self.screen_width));
							} else {
								tempObject = tempObject.imageAsResized(self.default_thumb_image_width, (tempObject.height * self.default_thumb_image_width / tempObject.width));
							}
						}
						break;
					case 'video':
						if (image_type == 'thumb') {
							var movie = Titanium.Media.createVideoPlayer({
								media : tempObject,
								scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FILL,
								width : self.default_thumb_image_width,
								height : self.default_thumb_image_width * self.screen_height / self.screen_width,
								visible : false,
								autoplay : false
							});
							tempObject = movie.thumbnailImageAtTime(1, Titanium.Media.VIDEO_TIME_OPTION_NEAREST_KEYFRAME);//Titanium.Media.VIDEO_TIME_OPTION_EXACT);
						}
						
						break;
					default:
						return;
				}
				if (tempObject != null) {
					var extensionName = image_type + '_' + origin_file_name;

					if(media_type == 'video'){
						var extensionNameArray = extensionName.split('.');
						var tempExtensionName = '';
						for(var i=0,j=extensionNameArray.length-1;i<j;i++){
							tempExtensionName += extensionNameArray[i]+'.';
						}
						tempExtensionName+= 'jpg';	
						extensionName = tempExtensionName;
						//extensionName = self.replace(extensionName, '.mp4', '.jpg');
					}					
					var resized_image = Ti.Filesystem.getFile(_file_folder, extensionName);				
					resized_image.write(tempObject);				
				}
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - _get_resized_image');
				return;
			}
		}
		
		function _inline_download_function(i) {
			try {
				if (i >= _asset_type_path.length) {
					if (_failure_download_file_number > 0) {
						self.hide_indicator();
						if (_failure_download_file_number == 1) {
							self.show_message('Download ' + _failure_download_file_number + ' file failed.');
						} else {
							self.show_message('Download ' + _failure_download_file_number + ' files failed.');
						}
					}
					self.cover_flow_view.views = [];
					Ti.API.info('_image_data length:' + _image_data.length);
					self.cover_flow_view.setViews(_image_data);
					Ti.API.info('_current_index:' + _current_index);
					self.cover_flow_view.setCurrentPage(_current_index);
					self.hide_indicator();
				} else {
					self.update_message('Downloading Files (' + (i + 1) + '/' + _asset_type_path.length + ')...');
					var file_name = _asset_type_path[i];
					if (self.set_enable_keep_alive) {
						_xhr = Ti.Network.createHTTPClient({
							enableKeepAlive : false
						});
					} else {
						_xhr = Ti.Network.createHTTPClient();
					}
					_xhr.onload = function() {
						try {
							if ((_xhr.readyState === 4)) {
								if (this.status === 200) {
									self.create_directory(_selected_company_id + '/' + _type + '/' + _selected_job_reference_number + '/' + win.asset_type_path);
									var media_obj = Ti.Filesystem.getFile(_file_folder, file_name);
									media_obj.write(this.responseData);
									Ti.API.info('_image_data[i].children[0].mime_type_name:' + _image_data[i].children[0].mime_type_name);
									if (_image_data[i].children[0].mime_type_name == 'image' || _image_data[i].children[0].mime_type_name == 'video') {
										_get_resized_image(file_name, 'thumb', _image_data[i].children[0].mime_type_name);// create
										//_get_resized_image(file_name, 'resized', _image_data[i].children[0].mime_type_name);// create
									}
								}
							} else {
								_failure_download_file_number++;
							}
							i++;
							_inline_download_function(i);
						} catch (e) {
							_failure_download_file_number++;
							i++;
							_inline_download_function(i);
						}
					};
					_xhr.ondatastream = function(e) {
						if (abortDownload()) {
							return;
						}
						self.update_progress(e.progress, true);
					};
					_xhr.onerror = function(e) {
						_failure_download_file_number++;
						i++;
						_inline_download_function(i);
					};
					_xhr.setTimeout(self.default_download_time_out);
					_xhr.open('GET', _file_folder_url + file_name);
					_xhr.send();
				}
			} catch (err) {
				setTimeout(function() {
					self.hide_indicator();
					if (_failure_download_file_number > 0) {
						if (_failure_download_file_number == 1) {
							self.show_message('Download ' + _failure_download_file_number + ' photo failed.');
						} else {
							self.show_message('Download ' + _failure_download_file_number + ' photos failed.');
						}
					}
					self.cover_flow_view.views = _image_data;
					self.cover_flow_view.currentPage = _current_index;
				}, 2000);
				return;
			}
		}
		
		function abortDownload() {
			try {
				if (Ti.App.Properties.getBool('is_hide_indicator')) {
					Ti.App.Properties.setBool('is_hide_indicator', false);
					if (_xhr != undefined && _xhr != null) {
						_xhr.abort();
					}
					self.hide_indicator();
					self.cover_flow_view.views = _image_data;
					self.cover_flow_view.currentPage = _current_index;
					for ( var i = 0, j = _image_data.length; i < j; i++) {
						self.cover_flow_view.views[i].image = _image_data[i].image;
					}
					return true;
				}
				return false;
			} catch (err) {
				self.process_simple_error_message(err, window_source + ' - abortDownload');
				return false;
			}
		}
	}

	win.addEventListener('open', function() {
		try {
			if (job_base_photo_flow_page_obj === null) {
				var F = function() {
				};
				F.prototype = FieldTeam.prototype;
				job_base_photo_flow_page.prototype = new F();
				job_base_photo_flow_page.prototype.constructor = job_base_photo_flow_page;
				job_base_photo_flow_page_obj = new job_base_photo_flow_page();
				job_base_photo_flow_page_obj.init();
			}
		} catch (err) {
			alert(err);
			return;
		}
	});
	
	win.addEventListener('close', function() {
		try {
			job_base_photo_flow_page_obj.close_window();
			job_base_photo_flow_page_obj = null;
			win = null;
		} catch (err) {
			alert(err);
			return;
		}
	});
}());
