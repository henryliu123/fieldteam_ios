//display job detail
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'operate_camera.js');
        var win = Titanium.UI.currentWindow;
        var job_edit_job_media_page_obj = null;

        function job_edit_job_media_page(){
                var self = this;
                var window_source = 'job_edit_job_media_page';

                //public method
                /**
                 *  override init  function of parent class: fieldteam.js
                 */                    
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                if(!_is_task){
                                        self.init_navigation_bar('Add','Main,Back'); 
                                        _init_bottom_tool_bar();
                                }else{
                                        self.init_navigation_bar('','Main,Back');     
                                } 
                                
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
                                if(!_is_task){
                                        self.table_view.bottom = self.default_table_view_row_height;
                                }
                                //call init_no_result_label function of parent class: fieldteam.js
                                self.init_no_result_label();
                                _cancel_button = Titanium.UI.createButton({
                                        systemButton:Titanium.UI.iPhone.SystemButton.CANCEL
                                });
                                _cancel_button.addEventListener('click', function(){
                                        win.setRightNavButton(self.nav_right_btn);
                                        self.table_view.editing = false;
                                        self.bottom_tool_bar.visible = true;
                                }); 
                                self.table_view.addEventListener('delete',function(e){
                                        _event_for_delete_btn(e);
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }                                
                };                
                /**
                 *  override init_vars  function of parent class: fieldteam.js
                 */                  
                self.init_vars = function(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());                                
                                //get list from _asset_type_code                                
                                var rows = db.execute('SELECT * FROM my_'+_type+'_asset WHERE '+_type+'_id=? and status_code=1 and '+_type+'_asset_type_code=? ORDER BY id desc',_selected_job_id,_asset_type_code);
                                var b=0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var temp_upload_is_over_limit = false;
                                                var temp_file_size = 0;                                                
                                                var temp_upload_flag = -1;
                                                var temp_uploading_record_id = null;
                                                var new_text = '';
                                                //new_text+='ID : '+rows.fieldByName('id');
                                                //new_text+='Changed : '+rows.fieldByName('changed');
                                                new_text+='Name : '+((rows.fieldByName('name') === null)?'':rows.fieldByName('name'))+'\n';
                                                new_text+='Status : ';
                                                var temp_row = db.execute('SELECT * FROM my_updating_records where type=? and updating_id=?',_type,rows.fieldByName('local_id'));
                                                if(temp_row.isValidRow()){
                                                        temp_upload_flag = temp_row.fieldByName('upload_status');
                                                        temp_uploading_record_id = temp_row.fieldByName('id');                                                        
                                                        switch(temp_row.fieldByName('upload_status')){
                                                                case 0://
                                                                        new_text+='Not Uploaded';
                                                                        break;
                                                                case 1://
                                                                        new_text+='Uploading';
                                                                        break;
                                                                case 2://
                                                                        new_text+='Completed';
                                                                        break;
                                                                case 3://
                                                                        new_text+='Failed';
                                                                        break;    
                                                                default:
                                                                        new_text+='From Server';        
                                                        }
                                                }else{
                                                        if(rows.fieldByName('id') > 1000000000){
                                                                temp_file_size = ((rows.fieldByName('file_size') === undefined)||(rows.fieldByName('file_size') === null))?0:rows.fieldByName('file_size') ;
                                                                switch(rows.fieldByName('mime_type')){
                                                                        case 'image/jpeg':
                                                                        case 'image/png':
                                                                                if(temp_file_size > parseInt(Titanium.App.Properties.getString('app_media_upload_limit_image'),10)){
                                                                                        temp_upload_is_over_limit = true;
                                                                                }
                                                                                break;
                                                                        case 'video/mp4':
                                                                                if(temp_file_size > parseInt(Titanium.App.Properties.getString('app_media_upload_limit_video'),10)){
                                                                                        temp_upload_is_over_limit = true;
                                                                                }                                                                                 
                                                                                break;
                                                                        case 'audio/wav':
                                                                                if(temp_file_size > parseInt(Titanium.App.Properties.getString('app_media_upload_limit_audio'),10)){
                                                                                        temp_upload_is_over_limit = true;
                                                                                }                                                                                  
                                                                                break;
                                                                        default:
                                                                                if(temp_file_size > parseInt(Titanium.App.Properties.getString('app_media_upload_limit_document'),10)){
                                                                                        temp_upload_is_over_limit = true;
                                                                                }                                                                                                                                                                    
                                                                }
                                                                if(temp_upload_is_over_limit){
                                                                        new_text+='Over Size';
                                                                }else{
                                                                        new_text+='Not Uploaded';
                                                                }
                                                        }else{
                                                                var temp_row2 = db.execute('SELECT * FROM my_updating_records_for_data where type=? and updating_id=?',_type,rows.fieldByName('local_id'));
                                                                if(temp_row2.isValidRow()){
                                                                        new_text+='Not Uploaded';
                                                                }else{
                                                                        new_text+='From Server';    
                                                                }
                                                                temp_row2.close();
                                                        }
                                                }             
                                                new_text+='\n';
                                                new_text+='Description : '+((rows.fieldByName('description') === null)?'':rows.fieldByName('description'))+'\n';
                                                var new_row = Ti.UI.createTableViewRow({
                                                        className:'data_row_'+b,
                                                        filter_class:'asset_class',
                                                        hasChild:true,
                                                        height:(temp_upload_flag === 3)?160:120,
                                                        header:'',
                                                        uploading_record_id:temp_uploading_record_id,
                                                        job_id:rows.fieldByName(_type+'_id'),
                                                        job_reference_number:_selected_job_reference_number,
                                                        asset_id:rows.fieldByName('id'),
                                                        asset_type_code:rows.fieldByName(_type+'_asset_type_code'),
                                                        asset_type_path:_asset_type_path,
                                                        asset_type_name:_asset_type_name,
                                                        asset_mime_type:rows.fieldByName('mime_type'),
                                                        path_original:((rows.fieldByName('path') === null)||(rows.fieldByName('path') === ''))?rows.fieldByName('path_original'):rows.fieldByName('path')
                                                });
                                                var asset_file_obj = null;
                                                var asset_mime_type = rows.fieldByName('mime_type');
                                                var asset_mime_type_array = asset_mime_type.split('/');
                                                var temp_asset_mime_type_name = (asset_mime_type_array.length>0)?asset_mime_type_array[0]:'';
                                                var asset_thumb_width = self.default_thumb_image_width;
                                                var asset_thumb_height = self.default_thumb_image_width;
                                                switch(temp_asset_mime_type_name){
                                                        case 'image':
                                                                var file_name_array = rows.fieldByName('path_original').split('/');
                                                                asset_file_obj = Ti.Filesystem.getFile(_file_folder,'thumb_'+file_name_array[file_name_array.length-1]);
                                                                if(asset_file_obj.exists()){
                                                                        var blob = asset_file_obj.toBlob();
                                                                        asset_thumb_width = (blob.width >self.default_thumb_image_width)?self.default_thumb_image_width:blob.width;
                                                                        asset_thumb_height = (blob.height >100)?100:blob.height;
                                                                }else{
                                                                        asset_file_obj = self.get_file_path('image','media_type/photo.png');
                                                                }
                                                                break;
                                                        case 'audio':
                                                                asset_file_obj = self.get_file_path('image','media_type/audio.jpg');
                                                                break;
                                                        case 'video':
                                                                file_name_array = rows.fieldByName('path_original').split('/');                                                                
                                                                var videoThumbFileName  = 'thumb_'+self.replace(file_name_array[file_name_array.length-1],'.mp4','.jpg');//remove ' symbol'     
                                                                videoThumbFileName  = self.replace(videoThumbFileName,'.mov','.jpg');//remove ' symbol'    
                                                                Ti.API.info('videoThumbFileName:'+videoThumbFileName);
                                                                asset_file_obj = Ti.Filesystem.getFile(_file_folder,videoThumbFileName);
                                                                if(asset_file_obj.exists()){
                                                                        blob = asset_file_obj.toBlob();
                                                                        asset_thumb_width = (blob.width >self.default_thumb_image_width)?self.default_thumb_image_width:blob.width;
                                                                        asset_thumb_height = (blob.height >100)?100:blob.height;
                                                                }else{
                                                                        asset_file_obj = self.get_file_path('image','media_type/video.png');
                                                                }                                                                                                                                
                                                                break;
                                                        default:
                                                                asset_file_obj = self.get_file_path('image','media_type/pdf.png');
                                                }
                                                var thumb_view = Ti.UI.createView({
                                                        width:asset_thumb_width,
                                                        height:asset_thumb_height,  
                                                        left:10,
                                                        top:(120-asset_thumb_height)/2,
                                                        bottom:(temp_upload_flag === 3)?40:(120-asset_thumb_height)/2
                                                });
                                                var thumb = Ti.UI.createImageView({
                                                        image:asset_file_obj,
                                                        width:asset_thumb_width,
                                                        height:asset_thumb_height
                                                });
                                                thumb_view.add(thumb);
                                                
                                                var mask_label_text = 'Document';
                                                switch(temp_asset_mime_type_name){
                                                       case 'image':
                                                              mask_label_text = 'Photo';
                                                              break;
                                                       case 'audio':
                                                               mask_label_text = 'Audio';
                                                               break;
                                                       case 'video':
                                                               mask_label_text = 'Video';
                                                               break;
                                                       default:
                                                               
                                                }
                                                                                                
                                                var thumb_mask = Ti.UI.createLabel({
                                                        backgroundColor:'#000',
                                                        width:asset_thumb_width,
                                                        height:20,
                                                        text:mask_label_text,
                                                        bottom:0,
                                                        opacity:0.5,
                                                        color:'#fff',
                                                        textAlign:'center'
                                                });
                                                thumb_view.add(thumb_mask);
                                                
                                                new_row.add(thumb_view);   
                                                
                                                if(temp_upload_flag === 3){
                                                        _upload_btn = Ti.UI.createButton({
                                                                name:'upload_btn',
                                                                backgroundImage:self.get_file_path('image','BUTT_grn_off.png'),
                                                                color:'#fff',
                                                                font:{
                                                                        fontSize:12,
                                                                        fontWeight:'bold'
                                                                },
                                                                title:'Upload',
                                                                textAlign:'center',
                                                                style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
                                                                bottom:5,
                                                                left:10,
                                                                height:30,
                                                                width:asset_thumb_width
                                                        });       
                                                        new_row.add(_upload_btn);                                             
                                                }                                                    
                                                
                                                new_row.add(
                                                Ti.UI.createLabel({
                                                        text:new_text,
                                                        textAlign:'left',
                                                        height:'auto',
                                                        width:'auto',
                                                        color:(temp_upload_is_over_limit)?'red':'black',
                                                        left:self.default_thumb_image_width+15,
                                                        top:10,
                                                        bottom:10
                                                }));                                                                                                             
                                                        
                                                        
                                                self.data.push(new_row);
                                                rows.next();
                                                b++;
                                        }
                                }
                                rows.close();
                                db.close();   
                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }
                };
                /**
                 *  override event_for_table_view_click  function of parent class: fieldteam.js
                 */                  
                self.table_view_click_event = function(e){
                        try{
                                if(e.source.name === 'upload_btn'){
                                        _upload_media_file();                                                  
                                }else{
                                        var new_win = Titanium.UI.createWindow({
                                                type:_type,
                                                url:self.get_file_path('url', 'job/base/job_photo_flow.js'),//(e.row.asset_type_name.toLowerCase() === 'photo')?self.get_file_path('url', 'job/base/job_photo_flow.js'):self.get_file_path('url', 'job/base/job_display_file.js'),
                                                job_id:e.row.job_id,
                                                job_reference_number:_selected_job_reference_number,
                                                asset_id:e.row.asset_id,
                                                asset_type_name:e.row.asset_type_name,
                                                asset_type_code:e.row.asset_type_code,
                                                asset_type_path:e.row.asset_type_path,
                                                asset_mime_type:e.row.asset_mime_type,
                                                file_name:e.row.path_original,
                                                current_index:e.index
                                        });
                                        Titanium.UI.currentTab.open(new_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });   
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }                                 
                }; 
                /**
                 *  override nav_right_btn_click_event  function of parent class: fieldteam.js
                 */                  
                self.nav_right_btn_click_event = function(e){
                        try{
                                if(_asset_type_code === 3){//audio
                                        _show_audio();
                                }else{
                                        if((_asset_type_code === 2)||(_asset_type_code === 4)){//photo and video
                                                var option_dialog = Ti.UI.createOptionDialog({
                                                        options:(self.is_ipad())?['From Camera','From Library','Cancel','']:['From Camera','From Library','Cancel'],
                                                        buttonNames:['Cancel'],
                                                        destructive:0,
                                                        cancel:2,
                                                        title:L('message_select_type')
                                                });
                                        }else{
                                                option_dialog = Ti.UI.createOptionDialog({
                                                        options:(self.is_ipad())?['From Camera','From Library','Add Audio','Cancel','']:['From Camera','From Library','Add Audio','Cancel'],
                                                        buttonNames:['Cancel'],
                                                        destructive:0,
                                                        cancel:3,
                                                        title:L('message_select_type')
                                                });
                                        }

                                        option_dialog.show();
                                        option_dialog.addEventListener('click',function(e){
                                                if(e.index == 0){
                                                        if(_asset_type_code === 2){//photo
                                                                self.show_camera('photo',_selected_job_id,_selected_job_reference_number,_selected_company_id,_type,_asset_type_path,_asset_type_code);
                                                        }else if(_asset_type_code === 4){//video
                                                                self.show_camera('video',_selected_job_id,_selected_job_reference_number,_selected_company_id,_type,_asset_type_path,_asset_type_code);
                                                        }else{
                                                                self.show_camera('',_selected_job_id,_selected_job_reference_number,_selected_company_id,_type,_asset_type_path,_asset_type_code);
                                                        }
                                                }
                                                if(e.index == 1){
                                                        if(_asset_type_code === 2){//photo
                                                                self.show_library('photo',_selected_job_id,_selected_job_reference_number,_selected_company_id,_type,_asset_type_path,_asset_type_code);
                                                        }else if(_asset_type_code === 4){//video
                                                                self.show_library('video',_selected_job_id,_selected_job_reference_number,_selected_company_id,_type,_asset_type_path,_asset_type_code);
                                                        }else{
                                                                self.show_library('',_selected_job_id,_selected_job_reference_number,_selected_company_id,_type,_asset_type_path,_asset_type_code);
                                                        }
                                                }

                                                if(e.index === 2){
                                                        if((_asset_type_code === 2)||(_asset_type_code === 4)){

                                                        }else{
                                                                _show_audio();
                                                        }
                                                }
                                        });
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }                            
                };                                                
                /**
                 *  display result list
                 */
                self.display = function(){
                        try{
                                self.data = [];
                                self.table_view.setData([]);
                                self.init_vars();
                                if(self.data.length > 0){
                                        self.no_result_label.visible = false;
                                }else{
                                        self.no_result_label.visible = true;
                                }
                                self.table_view.setData(self.data,{
                                        animationStyle:Titanium.UI.iPhone.RowAnimationStyle.DOWN
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.display');
                                return;
                        }                                
                };

                //private member
                var _type = win.type;
                var _asset_type_name = win.asset_type_name;
                var _asset_type_code = win.asset_type_code;
                var _asset_type_path = win.asset_type_path;
                var _selected_job_id = win.job_id;
                var _selected_job_reference_number = win.job_reference_number;
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _file_folder = self.file_directory+_selected_company_id+'/'+_type+'/'+_selected_job_reference_number+'/'+_asset_type_path;
                var _upload_btn = null;
                var _cancel_button = null;
                var _is_task = (win.is_task == undefined)?false:win.is_task;
                //private method
                /**
                 *  display audio
                 */
                function _show_audio(){
                        try{
                                var new_win = Titanium.UI.createWindow({
                                        type:_type,
                                        url:self.get_file_path('url', 'job/base/job_create_audio.js'),
                                        job_id:_selected_job_id,
                                        job_reference_number:_selected_job_reference_number,
                                        asset_id:0,
                                        asset_type_code:_asset_type_code,
                                        asset_type_path:_asset_type_path
                                });
                                Titanium.UI.currentTab.open(new_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _show_audio');
                                return;
                        }                                
                }
                function _upload_media_file(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                db.execute('UPDATE my_updating_records SET upload_status=0,failure_times=0 WHERE relation_id=? and type=? and upload_status in (1,3)',_selected_job_id,_type);
                                db.close();
                                win.close();
                                Ti.App.fireEvent('reset_upload_file_flag'); 
                                Ti.App.fireEvent('async_save_data');                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _upload_media_file');
                                return;
                        }                         
                }
                               
                function _init_bottom_tool_bar(){
                        try{
                                var flexSpace = Titanium.UI.createButton({
                                        systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
                                });                                
                                //add action button
                                self.trash_button = Ti.UI.createButton({
                                        systemButton:Titanium.UI.iPhone.SystemButton.TRASH                             
                                });
                                                                
                                self.bottom_tool_bar = Ti.UI.iOS.createToolbar({
                                        items:[flexSpace,self.trash_button,flexSpace],
                                        bottom:0,
                                        borderColor:self.tool_bar_color_in_ios_7,
                                        borderWidth:1,
                                        zIndex:100,
                                        opacity:0.8
                                });
                                win.add(self.bottom_tool_bar);                               

                                self.trash_button.addEventListener('click',function(e){
                                        win.setRightNavButton(_cancel_button);
                                        self.table_view.editing = true;
                                        self.bottom_tool_bar.visible = false;
                                        self.table_view.bottom = 0;
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_bottom_tool_bar');
                                return;
                        }
                }        
                /**
                 *  delete media files                 
                 */                   
                function _event_for_delete_btn(e){
                        try{
                                var asset_id = e.row.asset_id;                             
                                var db = Titanium.Database.open(self.get_db_name());
                                var temp_local_id = 0;
                                var temp_asset_path = '';
                                var temp_asset_path_original = '';
                                var temp_asset_mime_type = '';
                                var temp_row = db.execute('SELECT * FROM my_'+_type+'_asset WHERE id=?',asset_id);
                                if(temp_row.isValidRow()){
                                        temp_local_id = temp_row.fieldByName('local_id');
                                        Ti.API.info('job media-_event_for_delete_btn- local_id: '+temp_local_id);
                                        temp_asset_path = temp_row.fieldByName('path');
                                        temp_asset_path_original = temp_row.fieldByName('path_original');
                                        Ti.API.info('temp_asset_path_original:'+temp_asset_path_original);
                                        if(temp_asset_path_original == null || temp_asset_path_original == ''){
                                                temp_asset_path_original = temp_asset_path;
                                        }
                                        temp_asset_mime_type = temp_row.fieldByName('mime_type');
                                }
                                temp_row.close();
                                if(asset_id > 1000000000){
                                        db.execute('DELETE FROM my_'+_type+'_asset WHERE id=?',asset_id);
                                }else{
                                        db.execute('UPDATE my_'+_type+'_asset SET changed=?,status_code=?  WHERE id='+asset_id,1,2);
                                }
                                db.close();
                                                        
                                //remove file from phone
                                if(temp_asset_path_original != ''){
                                        var temp_asset_path_array = temp_asset_path_original.split('/');
                                        var temp_file_name =  temp_asset_path_array[temp_asset_path_array.length-1];
                                        var temp_file_first_path = '';
                                        for(var i=0,j=temp_asset_path_array.length-1;i<j;i++){
                                                if(i === 0){
                                                        temp_file_first_path = temp_asset_path_array[0];
                                                }else{
                                                        temp_file_first_path += '/'+temp_asset_path_array[i];
                                                }
                                        }
                                        if(temp_file_name != ''){                                                                        
                                                //delete original file
                                                var file_obj = Titanium.Filesystem.getFile(self.file_directory+temp_file_first_path,temp_file_name);
                                                if(file_obj.exists()){
                                                        file_obj.deleteFile();
                                                }        
                                                                        
                                                if(temp_asset_mime_type != ''){
                                                        var temp_asset_mime_type_array = temp_asset_mime_type.split('/');
                                                        if(temp_asset_mime_type_array[0].toLowerCase() === 'image'){
                                                                //delete resize file
                                                                file_obj = Titanium.Filesystem.getFile(self.file_directory+temp_file_first_path,'/resized_'+temp_file_name);
                                                                if(file_obj.exists()){
                                                                        file_obj.deleteFile();
                                                                }    
                                                                //delete thumb file
                                                                file_obj = Titanium.Filesystem.getFile(self.file_directory+temp_file_first_path,'/thumb_'+temp_file_name);
                                                                if(file_obj.exists()){
                                                                        file_obj.deleteFile();
                                                                }
                                                        }
                                                }
                                        }
                                }
                                Ti.API.info('job media-_event_for_delete_btn- local_id2: '+temp_local_id);
                                if(temp_local_id != undefined && temp_local_id != null && temp_local_id != ''){
                                        db = Titanium.Database.open(self.get_db_name());
                                        //update my_updating_records table                                                       
                                        temp_row = db.execute('SELECT * FROM my_updating_records WHERE company_id=? and type=? and updating_id=?',_selected_company_id,_type,temp_local_id);
                                        if(temp_row.isValidRow()){
                                        		Ti.API.info('job media-_event_for_delete_btn- local_id3: '+temp_local_id);
                                                db.execute('DELETE FROM my_updating_records WHERE company_id=? and type=? and updating_id=?',_selected_company_id,_type,temp_local_id);
                                        }
                                        temp_row.close();
                                        var tt = db.execute('select * from my_updating_records');
                                        Ti.API.info('tt count:'+tt.getRowCount());
                                        temp_row = db.execute('SELECT * FROM my_updating_records WHERE company_id=? and type=? and updating_id=?',_selected_company_id,_type,temp_local_id);
                                        if(temp_row.isValidRow()){
                                        		Ti.API.info('job media-_event_for_delete_btn- local_id31: '+temp_row.fieldByName('id'));
                                                db.execute('DELETE FROM my_updating_records WHERE id=?',temp_row.fieldByName('id'));
                                        }
                                        temp_row.close();                                        
                                        
                                        temp_row = db.execute('SELECT * FROM my_updating_records_for_data WHERE company_id=? and type=? and updating_id=?',_selected_company_id,_type,temp_local_id);
                                        if(temp_row.isValidRow()){
                                        	Ti.API.info('job media-_event_for_delete_btn- local_id4: '+temp_local_id);
                                                db.execute('DELETE FROM my_updating_records_for_data WHERE company_id=? and type=? and updating_id=?',_selected_company_id,_type,temp_local_id);
                                        }
                                        temp_row.close();                                         
                                        
                                        temp_row = db.execute('SELECT * FROM my_updating_errors_for_data WHERE company_id=? and type=? and updating_id=?',_selected_company_id,_type,temp_local_id);
                                        if(temp_row.isValidRow()){
                                        	Ti.API.info('job media-_event_for_delete_btn- local_id5: '+temp_local_id);
                                                db.execute('DELETE FROM my_updating_errors_for_data WHERE company_id=? and type=? and updating_id=?',_selected_company_id,_type,temp_local_id);
                                        }
                                        temp_row.close();                                        
                                        db.close();
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_delete_btn');
                                return;
                        }                        
                }       
        }

        win.addEventListener('focus',function(){
                try{
                        if(job_edit_job_media_page_obj === null){
                                var F = function(){};
                                F.prototype = operate_camera_page.prototype;
                                job_edit_job_media_page.prototype = new F();
                                job_edit_job_media_page.prototype.constructor = job_edit_job_media_page;
                                job_edit_job_media_page_obj = new job_edit_job_media_page();
                                job_edit_job_media_page_obj.init();                                
                        } 
                        job_edit_job_media_page_obj.display();
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_edit_job_media_page_obj.close_window();
                        job_edit_job_media_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());


