(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_base_custom_report_signature_page_obj = null;

        function job_base_custom_report_signature_page(){
                var self = this;
                var window_source = 'job_base_custom_report_signature_page';
                if(win.action_for_signature == 'edit_job_custom_report_signature'){
                        win.title = 'Signature';
                }else{
                        win.title = 'Add Signature';
                }  
                win.backgroundColor = '#fff';

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                      
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win);
                                _paint = require('ti.paint'); 
                                //call init_navigation_bar function of parent class: fieldteam.js
                                if(win.action_for_signature == 'edit_job_custom_report_signature'){
                                        if(win.job_custom_report_signature_id > 1000000000){
                                                self.init_navigation_bar('Submit','Main,Back'); 
                                        }else{
                                                self.init_navigation_bar('','Main,Back'); 
                                        }
                                }else{
                                        self.init_navigation_bar('Submit','Main,Back'); 
                                }
                                self.init_vars();
                                if(win.job_custom_report_signature_id > 1000000000){
                                        self.show_message('The signature hasn\'t been uploaded, please click \'Submit\' button and upload signature to server.');
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }
                };
                /**
                 *  override init_vars function of parent class: fieldteam.js
                 */                    
                self.init_vars = function(){
                        try{
                                if(win.action_for_signature == 'edit_job_custom_report_signature'){
                                        var db = Titanium.Database.open(self.get_db_name());                                                                
                                        var rows = db.execute('SELECT * FROM my_'+_type+'_custom_report_signature WHERE id=? ',_selected_job_custom_report_signature_id);
                                        if(rows.isValidRow()){
                                                _client_name = rows.fieldByName('client_name');
                                                _path = rows.fieldByName('path');
                                        }
                                        rows.close();
                                        db.close();  
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }                        
                };
                /**
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                      
                self.nav_right_btn_click_event = function(e){
                        try{
                                if(_client_name == ''){
                                        self.show_message('Please enter name');
                                        return;
                                }
                                if(win.action_for_signature == 'edit_job_custom_report_signature'){
                                        if(win.job_custom_report_signature_id > 1000000000){
                                                //upload signature
                                                _upload_signature();
                                                return;
                                        }
                                }else{
//                                        if(_has_paint == false){
//                                                self.show_message('Please enter signature');
//                                                return;
//                                        }                 
                                }
                                if(_check_if_exist_change()){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var d = new Date();
                                        if(_selected_job_custom_report_signature_id > 0){//update
                                                db.execute('UPDATE my_'+_type+'_custom_report_signature SET client_name=?,changed=? '+
                                                        ' WHERE id='+_selected_job_custom_report_signature_id,
                                                        _client_name,
                                                        1);
                                        }else{//add
                                                var file_id = new Date().getTime();
                                                var create_date_string = self.get_date_string_by_milliseconds(file_id);
                                                file_id = _selected_job_reference_number+'_'+file_id;
                                                var file_folder = _selected_company_id+'/'+_type+'/'+_selected_job_reference_number+'/report_signature';
                                                if(!self.create_directory(file_folder)){
                                                        self.show_message(L('message_failure_create_folder'));
                                                        return;
                                                }
                                                var width = _paint_view.toImage().width;
                                                var height  = _paint_view.toImage().height;

                                                var newFile = Ti.Filesystem.getFile(self.file_directory+file_folder,file_id+'.png');                 
                                                newFile.write(_paint_view.toImage());
                                                var file_size = newFile.size;
                                                var new_time_value = _selected_job_custom_report_signature_id = parseInt(d.getTime(), 10);
                                                db.execute('INSERT INTO my_'+_type+'_custom_report_signature (id,local_id,'+_type+'_id,'+_type+'_custom_report_data_id,'+
                                                        'client_name,path,time,mime_type,width,height,file_size,is_local_record,status_code,changed)'+
                                                        'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                                                        new_time_value,
                                                        _selected_company_id+'-'+_selected_user_id+'-'+new_time_value,
                                                        _selected_job_id,
                                                        _selected_job_custom_report_data_id,
                                                        _client_name,
                                                        file_folder+'/'+file_id+'.png',
                                                        create_date_string,
                                                        'image/png',
                                                        width,height,file_size,
                                                        1,
                                                        1,
                                                        1);
                                        }
                                        db.close();
                                        if(Ti.Network.online){
                                                _upload_signature();                                                       
                                        }else{
                                                self.hide_indicator();
                                                var alertDialog = Titanium.UI.createAlertDialog({
                                                        title:L('message_warning'),
                                                        message:'You are offline. Signature will be saved in local database and You can upload it later. ',
                                                        buttonNames:['OK']
                                                });
                                                alertDialog.show(); 
                                                alertDialog.addEventListener('click',function(e){ 
                                                        win.close();
                                                });                                                
                                                return;                                                
                                        }
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }  
                };        
                /**
                 *  override nav_left_btn_click_event function of parent class: fieldteam.js
                 */                        
                self.nav_left_btn_click_event = function(e){
                        try{
                                if(_check_if_exist_change()){
                                        var option_dialog = Ti.UI.createOptionDialog({
                                                options:(self.is_ipad())?['YES','NO','Cancel','']:['YES','NO','Cancel'],
                                                buttonNames:['Cancel'],
                                                destructive:0,
                                                cancel:2,
                                                title:L('message_save_changes')
                                        });
                                        option_dialog.show();
                                        option_dialog.addEventListener('click',function(evt){
                                                switch(evt.index){
                                                        case 0:
                                                                self.nav_right_btn_click_event(e);
                                                                break;
                                                        case 1:
                                                                if(e.index == self.default_main_menu_button_index){//menu menu
                                                                        self.close_all_window_and_return_to_menu(); 
                                                                }else{                                                                
                                                                        win.close();
                                                                }
                                                                break;
                                                        case 2://cancel
                                                                self.nav_left_btn.index = -1;
                                                                break;                                                                     
                                                }
                                        });                                                                                
                                }else{
                                        if(e.index == self.default_main_menu_button_index){//menu menu
                                                self.close_all_window_and_return_to_menu(); 
                                        }else{                                                                
                                                win.close();
                                        }
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_left_btn_click_event');
                                return;
                        }
                };                
                self.display = function(){
                        try{
                                self.init_vars();
                                _init_signature_client_name_field();
                                _init_separate_line();
                                _init_signature_area_field(); 
                                _init_draw_a_separate_line();     
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.display');
                                return;
                        }                        
                };
                //private member
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_job_reference_number = win.job_reference_number;
                var _selected_job_custom_report_data_id = win.job_custom_report_data_id;
                var _selected_job_custom_report_signature_id = win.job_custom_report_signature_id;
                var _client_name = '';
                var _path = '';
                var _paint_view = null;
                var _paint = null;
                var _has_paint = false;
                var _is_make_changed = false;      
                
                //private method
                /**
                 *  init signature client name field
                 */
                function _init_signature_client_name_field(){
                        try{
                                if(win.action_for_signature == 'edit_job_custom_report_signature'){
                                        var signature_client_name_label_field = Ti.UI.createLabel({
                                                width:(self.is_ipad())?self.screen_width-100:self.screen_width-20,
                                                height:self.default_table_view_row_height,
                                                left:(self.is_ipad())?50:10,
                                                right:(self.is_ipad())?50:10,
                                                textAlign:'center',
                                                top:10,                                        
                                                text:'Name: '+_client_name,
                                                border:1,
                                                color:self.section_header_title_font_color,
                                                font:{
                                                        fontSize:self.normal_font_size
                                                }
                                        });   
                                        win.add(signature_client_name_label_field);
                                }else{
                                        self.signature_client_name_content_field = Ti.UI.createTextField({
                                                width:(self.is_ipad())?self.screen_width-100:self.screen_width-20,
                                                height:self.default_table_view_row_height,
                                                left:(self.is_ipad())?50:10,
                                                right:(self.is_ipad())?50:10,
                                                textAlign:'center',
                                                top:5,                                        
                                                value:_client_name,
                                                border:1,
                                                color:self.selected_value_font_color,
                                                font:{
                                                        fontSize:self.normal_font_size
                                                },                                                
                                                hintText:'  Please enter name',
                                                returnKeyType: Ti.UI.RETURNKEY_DONE,
                                                backgroundImage:self.get_file_path('image','inputfield.png')
                                        });
                                        self.set_text_field_for_ios_7(self.signature_client_name_content_field);    
                                        win.add(self.signature_client_name_content_field);
                                        self.signature_client_name_content_field.addEventListener('change',function(e){
                                                _client_name = e.value;
                                                _is_make_changed = true;
                                        });                                        
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_signature_client_name_field');
                                return;
                        }
                }
                /**
                 *  init signature paint area field
                 */                
                function _init_signature_area_field(){
                        try{                             
                                if(win.action_for_signature == 'edit_job_custom_report_signature'){
                                        var _file_name_array = _path.split('/');
                                        var _file_name = _file_name_array[_file_name_array.length-1];
                                        var _file_folder = self.file_directory+_selected_company_id+'/'+_type+'/'+_selected_job_reference_number+'/report_signature';                                        
                                        var file_obj = Titanium.Filesystem.getFile(_file_folder,_file_name);
                                        if(!file_obj.exists()){
                                                var option_dialog = Ti.UI.createOptionDialog({
                                                        options:(self.is_ipad())?['YES','NO','']:['YES','NO'],
                                                        buttonNames:['No'],
                                                        destructive:0,
                                                        cancel:1,
                                                        title:L('message_not_exist_in_job_display_file')
                                                });
                                                option_dialog.show();
                                                option_dialog.addEventListener('click',function(e){
                                                        if(e.index === 0){
                                                                if(!Ti.Network.online){
                                                                        self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                                                        return;
                                                                }else{
                                                                        //_is_ever_download_file = true;
                                                                        self.display_indicator('Downloading File...',true);
                                                                        var xhr = null;
                                                                        if(self.set_enable_keep_alive){
                                                                                xhr = Ti.Network.createHTTPClient({
                                                                                        enableKeepAlive:false
                                                                                });
                                                                        }else{
                                                                                xhr = Ti.Network.createHTTPClient();
                                                                        }
                                                                        xhr.onload = function(){
                                                                                try{
                                                                                        if((xhr.readyState === 4)&&(this.status === 200)){                                                                                     
                                                                                                if(!self.create_directory(_selected_company_id+'/'+_type+'/'+_selected_job_reference_number+'/report_signature')){
                                                                                                        self.hide_indicator();
                                                                                                        self.show_message(L('message_failure_create_folder'));               
                                                                                                        return;
                                                                                                }
                                                                                                var signature_obj = Ti.Filesystem.getFile(_file_folder,_file_name);
                                                                                                signature_obj.write(this.responseData);
                                                                                                _display_signature();
                                                                                                self.hide_indicator();
                                                                                        }else{
                                                                                                self.hide_indicator();
                                                                                                var params = {
                                                                                                        message:L('message_failure_download_file'),
                                                                                                        show_message:true,
                                                                                                        message_title:'',
                                                                                                        send_error_email:true,
                                                                                                        error_message:'',
                                                                                                        error_source:window_source+' - _init_signature_area_field - xhr.onload -1',
                                                                                                        server_response_message:this.responseText
                                                                                                };
                                                                                                self.processXYZ(params);                                                                                               
                                                                                                return;
                                                                                        }
                                                                                }catch(e){
                                                                                        self.hide_indicator();
                                                                                        params = {
                                                                                                message:L('message_failure_download_file'),
                                                                                                show_message:true,
                                                                                                message_title:'',
                                                                                                send_error_email:true,
                                                                                                error_message:e,
                                                                                                error_source:window_source+' - _init_signature_area_field - xhr.onload -2',
                                                                                                server_response_message:this.responseText
                                                                                        };
                                                                                        self.processXYZ(params);                                                                                            
                                                                                }
                                                                        };
                                                                        xhr.ondatastream = function(e){
                                                                                self.update_progress(e.progress,true);
                                                                        };
                                                                        xhr.onerror = function(e){
                                                                                self.hide_indicator();
                                                                                var params = {
                                                                                        message:L('message_failure_download_file'),
                                                                                        show_message:true,
                                                                                        message_title:'',
                                                                                        send_error_email:true,
                                                                                        error_message:e,
                                                                                        error_source:window_source+' - _init_signature_area_field - xhr.onerror',
                                                                                        server_response_message:this.responseText
                                                                                };
                                                                                self.processXYZ(params);   
                                                                        };
                                                                        xhr.setTimeout(self.default_download_time_out);
                                                                        xhr.open('GET',self.get_media+'/'+_path);
                                                                        xhr.send();
                                                                }
                                                        }
                                                });
                                        }else{
                                                _display_signature();
                                        }                                                                                
                                }else{
                                        //can Display Signature
                                        _paint_view  = _paint.createPaintView({
                                                top:self.default_table_view_row_height+12,
                                                bottom:10,
                                                right:10,
                                                left:10,
                                                width:self.screen_width,
                                                height:self.screen_height-2*self.default_table_view_row_height,
                                                strokeColor:'#2a81df',
                                                strokeWidth:5,
                                                image:self.get_file_path('image','signature_blank.png')
                                        });     
                                        win.add(_paint_view);
                                        _paint_view.addEventListener('touchstart', function(){
                                                _has_paint = true;
                                                if((self.signature_client_name_content_field != undefined) && (self.signature_client_name_content_field != null)){
                                                        self.signature_client_name_content_field.blur();
                                                }
                                        });
                                }
                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_signature_area_field');
                                return;
                        }                        
                }
                function _init_separate_line(){
                        try{
                                var line_view = Ti.UI.createView({
                                        top:self.default_table_view_row_height+10,
                                        left:(self.is_ipad())?50:10,
                                        right:(self.is_ipad())?50:10,
                                        height:2,
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-20       
                                });                                                                                
                                var line = Ti.UI.createLabel({                                        
                                        width:self.screen_width,
                                        backgroundColor:self.section_header_title_font_color
                                });
                                line_view.add(line);
                                win.add(line_view);                                                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_separate_line');
                                return;
                        }                             
                }
                function _init_draw_a_separate_line(){
                        try{
                                var cross_line = Ti.UI.createLabel({
                                        text:'X',
                                        bottom:10,
                                        left:(self.is_ipad())?50:10,
                                        right:(self.is_ipad())?50:10,
                                        height:20,
                                        width:20,
                                        color:self.section_header_title_font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        }                                
                                
                                });
                                win.add(cross_line);                        
                                var line = Ti.UI.createLabel({
                                        bottom:10,
                                        left:(self.is_ipad())?50:10,
                                        right:(self.is_ipad())?50:10,
                                        height:2,
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-20,
                                        backgroundColor:self.section_header_title_font_color
                                });
                                win.add(line);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_draw_a_separate_line');
                                return;
                        }                               
                }
                function _display_signature(){
                        try{
                                //display signature, cant edit it
                                _paint_view = Ti.UI.createImageView({
                                        top:self.default_table_view_row_height+12,
                                        bottom:15,
                                        right:0,
                                        left:0,
                                        width:self.screen_width,
                                        height:'auto',
                                        image:self.file_directory+_path
                                });
                                win.add(_paint_view); 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_signature');
                                return;
                        }                                                    
                }
                /**
                 *  init delete button field
                 */
                function _init_delete_btn(){
                        try{
                                var delete_button = Ti.UI.createButton({
                                        top:self.default_table_view_row_height*2+100,
                                        left:0,
                                        right:0,
                                        width:self.screen_width,
                                        title:'Delete',
                                        backgroundImage:self.get_file_path('image','BUTT_red_off.png'),
                                        textAlign:'center',
                                        height:self.default_table_view_row_height
                                });
                                win.add(delete_button);
                                
                                delete_button.addEventListener('click',function(){
                                        var optionDialog = Ti.UI.createOptionDialog({
                                                options:(self.is_ipad())?['YES','NO','']:['YES','NO'],
                                                buttonNames:['Cancel'],
                                                destructive:0,
                                                cancel:1,
                                                title:L('message_delete_signature_in_job_signature')
                                        });
                                        optionDialog.show();
                                        optionDialog.addEventListener('click',function(e){
                                                if(e.index === 0){
                                                        var db = Titanium.Database.open(self.get_db_name());
                                                        if(_selected_job_custom_report_signature_id > 1000000000){
                                                                db.execute('DELETE FROM my_'+_type+'_custom_report_signature WHERE id=?',_selected_job_custom_report_signature_id);
                                                        }else{
                                                                db.execute('UPDATE my_'+_type+'_custom_report_signature SET changed=?,status_code=?  WHERE id='+_selected_job_custom_report_signature_id,
                                                                        1,2
                                                                        );
                                                        }
                                                        db.close();
                                                        win.close();
                                                }
                                        });                                        
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_delete_btn');
                                return;
                        }                                
                }
                /**
                 *  check if exist any change
                 */
                function _check_if_exist_change(){
                        try{
                                var is_make_changed = false;
                                if(_is_make_changed){
                                        is_make_changed = true;
                                }else{
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT * FROM my_'+_type+'_custom_report_signature WHERE id=?',_selected_job_custom_report_signature_id);
                                        if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                                if(_client_name != rows.fieldByName('client_name')){
                                                        is_make_changed = true;
                                                }                                            
                                        }
                                        rows.close();
                                        db.close(); 
                                }
                                return is_make_changed;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _check_if_exist_change');
                                return false; 
                        }   
                } 
                
                /**
                 *  upload signature to server
                 */
                function _upload_signature(){
                        try{
                                //get signature object
                                self.display_indicator('Uploading Signature ...');
                                var local_id = 0;
                                var client_name = '';
                                var path = '';
                                var time = 0;
                                var mime_type = '';
                                var width = null;
                                var height = null;
                                var file_size = null;
                                var status_code =0;                                
                                var db = Titanium.Database.open(self.get_db_name());
                                var sql = 'select * from my_'+_type+'_custom_report_signature where id=?';
                                var rows = db.execute(sql,_selected_job_custom_report_signature_id);                                
                                if(rows.isValidRow()){
                                        local_id = rows.fieldByName('local_id');
                                        client_name = rows.fieldByName('client_name');
                                        path = rows.fieldByName('path');
                                        time = rows.fieldByName('time');
                                        mime_type = rows.fieldByName('mime_type');
                                        width = rows.fieldByName('width');
                                        height = rows.fieldByName('height');
                                        file_size = rows.fieldByName('file_size');
                                        status_code =rows.fieldByName('status_code');
                                }
                                rows.close();
                                db.close();
                                                                                                
                                var xhr = null;
                                if(self.set_enable_keep_alive){
                                        xhr = Ti.Network.createHTTPClient({
                                                enableKeepAlive:false
                                        });
                                }else{
                                        xhr = Ti.Network.createHTTPClient();
                                }
                                xhr.onload = function(){
                                        try{
                                                if((xhr.readyState === 4)&&(this.status === 200)){
                                                        if(self.return_to_login_page_if_user_security_session_changed(this.responseText)){
                                                                return;
                                                        }                                                          
                                                        if(self.display_app_version_incompatiable(this.responseText)){
                                                                self.hide_indicator();
                                                                self.show_message('Upload signature failed.');
                                                                return;
                                                        }
                                                        var result = JSON.parse(this.responseText);   
                                                        if(_type == 'job'){
                                                                self.update_selected_tables(null,'JobCustomReportSignature',result); 
                                                        }else{
                                                                self.update_selected_tables(null,'QuoteCustomReportSignature',result); 
                                                        }
                                                        
                                                        //update relatived tables for upload signature image
                                                        var db = Titanium.Database.open(self.get_db_name());
                                                        db.execute('UPDATE my_'+_type+' SET exist_any_changed=1 WHERE id=?',_selected_job_id); 
                                                        db.execute('DELETE FROM my_'+_type+'_custom_report_signature where id=?',_selected_job_custom_report_signature_id);
                                                        db.close();
                                                        _upload_signature_image_file(local_id);    
                                                }else{
                                                        self.hide_indicator();
                                                        var params = {
                                                                message:'Upload signature failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:'',
                                                                error_source:window_source+' - _upload_signature - xhr.onload -1',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);                                                       
                                                }                                                
                                        }catch(e){
                                                self.hide_indicator();
                                                params = {
                                                        message:'Upload signature failed.',
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - _upload_signature - xhr.onload -2',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params);                                                  
                                        }
                                };
                                xhr.onerror = function(e){                                        
                                        self.hide_indicator();
                                        var params = {
                                                message:'Upload signature failed.',
                                                show_message:true,
                                                message_title:'',
                                                send_error_email:true,
                                                error_message:e,
                                                error_source:window_source+' - _upload_signature - xhr.onerror',
                                                server_response_message:this.responseText
                                        };
                                        self.processXYZ(params);  
                                };
                                xhr.setTimeout(self.default_time_out);
                                xhr.open('POST',self.get_host_url()+'update',false);
                                xhr.send({
                                        'type':'upload_report_signature',
                                        'hash':_selected_user_id,                                        
                                        'company_id':_selected_company_id,
                                        'job_type':_type,
                                        'user_id':_selected_user_id,
                                        'local_id':local_id,
                                        'job_id':_selected_job_id,
                                        'quote_id':_selected_job_id,
                                        'job_custom_report_data_id':_selected_job_custom_report_data_id,
                                        'quote_custom_report_data_id':_selected_job_custom_report_data_id,
                                        'client_name':client_name,                                                        
                                        'path':path,
                                        'time':time,
                                        'mime_type':mime_type,
                                        'width':width,
                                        'height':height,
                                        'file_size':file_size,                                                        
                                        'status_code':status_code,
                                        'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                        'app_version_increment':self.version_increment,
                                        'app_version':self.version,
                                        'app_platform':self.get_platform_info()
                                });                                  
                        }catch(err){
                                self.hide_indicator();
                                self.process_simple_error_message(err,window_source+' - _upload_signature');
                        }                
                }
                /**
                 *  upload signature image file
                 */
                function _upload_signature_image_file(local_id){
                        try{
                                self.update_message('Uploading Signature File ...');
                                var temp_flag = false;
                                var db = Titanium.Database.open(self.get_db_name());
                                //get record which need to upload server
                                var temp_row = db.execute('SELECT * FROM my_'+_type+'_custom_report_signature '+' WHERE local_id=?',local_id);
                                if((temp_row.getRowCount() > 0) && (temp_row.isValidRow())){
                                        temp_flag = true;    
                                        var temp_mime_type = temp_row.fieldByName('mime_type');
                                        var temp_width= temp_row.fieldByName('width');
                                        var temp_height = temp_row.fieldByName('height');
                                        var temp_file_size = temp_row.fieldByName('file_size');
                                        var temp_status_code = temp_row.fieldByName('status_code');
                                        var temp_path_original = ((temp_row.fieldByName('path') === null)||(temp_row.fieldByName('path') === ''))?temp_row.fieldByName('path_original'):temp_row.fieldByName('path');
                                }
                                temp_row.close();
                                db.close();
                                if(temp_flag){
                                        var is_exist_media_file = false;
                                        var temp_arr = temp_path_original.split('/');
                                        var folder_name = '';
                                        for(var i=0,j=temp_arr.length-1;i<j;i++){
                                                if(i=== 0){
                                                        folder_name+=temp_arr[i];
                                                }else{
                                                        folder_name+='/'+temp_arr[i];
                                                }
                                        }
                                        var file_name = temp_arr[temp_arr.length-1];
                                        var mediafile = Ti.Filesystem.getFile(self.file_directory+folder_name,file_name);
                                        if(mediafile.exists()){
                                                is_exist_media_file = true;
                                        }            
                                        var xhr = null;
                                        if(self.set_enable_keep_alive){
                                                xhr = Ti.Network.createHTTPClient({
                                                        enableKeepAlive:false
                                                });
                                        }else{
                                                xhr = Ti.Network.createHTTPClient();
                                        }
                                        xhr.onload = function(){
                                                try{                                        
                                                        if((xhr.readyState === 4)&&(this.status === 200)){                                                                 
                                                                var temp_result = JSON.parse(this.responseText);                                                                  
                                                                if((temp_result.error != undefined)&&(temp_result.error.length >0)){                                                                        
                                                                        var error_string = '';
                                                                        for(var i=0,j=temp_result.error.length;i<j;i++){
                                                                                if(i==j){
                                                                                        error_string+=temp_result.error[i];
                                                                                }else{
                                                                                        error_string+=temp_result.error[i]+'\n';
                                                                                }
                                                                        }
                                                                        self.hide_indicator();
                                                                        self.show_message(error_string);
                                                                }else{
                                                                        _download_report_file();                                                                        
                                                                }                                                                
                                                        }else{
                                                                self.hide_indicator();
                                                                var params = {
                                                                        message:'Upload signature file failed.',
                                                                        show_message:true,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:'',
                                                                        error_source:window_source+' - _upload_signature_image_file - xhr.onload -1',
                                                                        server_response_message:this.responseText
                                                                };
                                                                self.processXYZ(params);                                                                  
                                                        }
                                                }catch(e){
                                                        self.hide_indicator();
                                                        params = {
                                                                message:'Upload signature file failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:e,
                                                                error_source:window_source+' - _upload_signature_image_file - xhr.onload -2',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);                                                            
                                                }
                                        };                        
                                        xhr.onerror = function(e){
                                                self.hide_indicator();
                                                var params = {
                                                        message:'Upload signature file failed.',
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:'',
                                                        error_source:window_source+' - _upload_signature_image_file - xhr.onerror',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params);    
                                        };
                                        xhr.setTimeout(self.default_download_time_out);
                                        xhr.open('POST',self.get_host_url()+'update',true);                        
                                        xhr.send({
                                                'type':'upload_asset_file',
                                                'media':(is_exist_media_file)?mediafile.read():'',
                                                'host':self.get_host(),
                                                'hash':_selected_user_id,
                                                'company_id':_selected_company_id,
                                                'path':temp_path_original,
                                                'mime_type':temp_mime_type,
                                                'table_name':'my_'+_type+'_custom_report_signature',
                                                'width':temp_width,
                                                'height':temp_height,
                                                'file_size':temp_file_size,
                                                'status_code':temp_status_code,
                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                'app_version_increment':self.version_increment,
                                                'app_version':self.version,
                                                'app_platform':self.get_platform_info()
                                        });
                                }else{
                                        self.hide_indicator();
                                        win.close();
                                }
                        }catch(err){
                                self.hide_indicator();
                                self.process_simple_error_message(err,window_source+' - _upload_signature_image_file');
                        }                         
                }
                /*
                 * download custom_report pdf
                 */
                function _download_report_file(){
                        try{
                                self.update_message('Downloading Report...',true);
                                var xhr = null;
                                if(self.set_enable_keep_alive){
                                        xhr = Ti.Network.createHTTPClient({
                                                enableKeepAlive:false
                                        });
                                }else{
                                        xhr = Ti.Network.createHTTPClient();
                                }
                                xhr.onload = function(){
                                        try{                                                                             
                                                if((xhr.readyState === 4)&&(this.status === 200)){                                                                
                                                        if(!self.create_directory(_selected_company_id+'/'+_type+'/'+_selected_job_reference_number+'/report')){
                                                                self.hide_indicator();
                                                                self.show_message(L('message_failure_create_folder'));               
                                                                return;
                                                        }
                                                        var db = Titanium.Database.open(self.get_db_name());
                                                        var rows = db.execute('SELECT * FROM my_'+_type+'_custom_report_data where id=?',_selected_job_custom_report_data_id);
                                                        var custom_report_file_path = '';
                                                        if(rows.isValidRow()){
                                                                custom_report_file_path = rows.fieldByName('path');
                                                        }
                                                        rows.close();                                                        
                                                        db.close();
                                                        if(custom_report_file_path != ''){
                                                                var _file_name_array = custom_report_file_path.split('/');
                                                                var _file_name = _file_name_array[_file_name_array.length-1];
                                                                var _file_folder = self.file_directory+_selected_company_id+'/'+_type+'/'+_selected_job_reference_number+'/report';
                                                                var media_obj = Ti.Filesystem.getFile(_file_folder,_file_name);
                                                                media_obj.write(this.responseData);
                                                                Ti.App.fireEvent('refresh_custom_report_file'); 
                                                        }
                                                        self.hide_indicator();
                                                        win.close();
                                                }else{
                                                        self.hide_indicator();
                                                        var params = {
                                                                message:L('message_failure_download_file'),
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:'',
                                                                error_source:window_source+' - _download_report_file - xhr.onload -1',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);                                                         
                                                }
                                        }catch(e){                                                                                
                                                self.hide_indicator();         
                                                params = {
                                                        message:L('message_failure_download_file'),
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - _download_report_file - xhr.onload -2',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params);                                                  
                                        }
                                };
                                xhr.ondatastream = function(e){
                                        self.update_progress(e.progress,true);
                                };
                                xhr.onerror = function(e){                                                                        
                                        self.hide_indicator();
                                        var params = {
                                                message:L('message_failure_download_file'),
                                                show_message:true,
                                                message_title:'',
                                                send_error_email:true,
                                                error_message:e,
                                                error_source:window_source+' - _download_report_file - xhr.onerror',
                                                server_response_message:this.responseText
                                        };
                                        self.processXYZ(params);                                           
                                };
                                xhr.setTimeout(self.default_download_time_out);   
                                xhr.open('POST',self.get_host_url()+'update',false);
                                xhr.send({
                                        'type':'download_custom_report',   
                                        'job_type':_type,
                                        'hash':_selected_user_id,
                                        'user_id':_selected_user_id,
                                        'company_id':_selected_company_id,
                                        'job_reference_number':_selected_job_reference_number,                                        
                                        'job_custom_report_data_id':_selected_job_custom_report_data_id,
                                        'quote_custom_report_data_id':_selected_job_custom_report_data_id,
                                        'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                        'app_version_increment':self.version_increment,
                                        'app_version':self.version,
                                        'app_platform':self.get_platform_info()
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _download_report_file');
                        }
                }                
        }

        win.addEventListener('open',function(){
                try{
                        if(job_base_custom_report_signature_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_base_custom_report_signature_page.prototype = new F();
                                job_base_custom_report_signature_page.prototype.constructor = job_base_custom_report_signature_page;
                                job_base_custom_report_signature_page_obj = new job_base_custom_report_signature_page();
                                job_base_custom_report_signature_page_obj.init();
                        }
                        job_base_custom_report_signature_page_obj.display();
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_base_custom_report_signature_page_obj.close_window();
                        job_base_custom_report_signature_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());