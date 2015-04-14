(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_base_signature_page_obj = null;

        function job_base_signature_page(){
                var self = this;
                var window_source = 'job_base_signature_page';
                if(win.action_for_signature == 'edit_job_signature'){
                        win.title = 'Display Signature';
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
                                if(win.action_for_signature == 'edit_job_signature'){
                                        self.init_navigation_bar('','Main,Back'); 
                                }else{
                                        self.init_navigation_bar('Done','Main,Back'); 
                                }
                                self.init_vars();                                  
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
                                if(win.action_for_signature == 'edit_job_signature'){
                                        var db = Titanium.Database.open(self.get_db_name());                                                                
                                        var rows = db.execute('SELECT * FROM my_'+_type+'_signature WHERE id=? ',_selected_job_signature_id);
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
//                                if(_has_paint == false){
//                                        self.show_message('Please enter signature');
//                                        return;
//                                }                                
                                if(_check_if_exist_change()){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var d = new Date();
                                        if(_selected_job_signature_id > 0){//update
                                                db.execute('UPDATE my_'+_type+'_signature SET client_name=?,changed=? '+
                                                        ' WHERE id='+_selected_job_signature_id,
                                                        _client_name,
                                                        1);
                                        }else{//add
                                                var file_id = new Date().getTime();
                                                var create_date_string = self.get_date_string_by_milliseconds(file_id);
                                                file_id = _selected_job_reference_number+'_'+file_id;
                                                var file_folder = _selected_company_id+'/'+_type+'/'+_selected_job_reference_number+'/signature';
                                                if(!self.create_directory(file_folder)){
                                                        self.show_message(L('message_failure_create_folder'));
                                                        return;
                                                }
                                                var width = _paint_view.toImage().width;
                                                var height  = _paint_view.toImage().height;

                                                var newFile = Ti.Filesystem.getFile(self.file_directory+file_folder,file_id+'.jpg');                 
                                                newFile.write(_paint_view.toImage());
                                                var file_size = newFile.size;
                                                var new_time_value = parseInt(d.getTime(), 10);
                                                db.execute('INSERT INTO my_'+_type+'_signature (id,local_id,'+_type+'_id,'+
                                                        'client_name,path,time,mime_type,width,height,file_size,is_local_record,status_code,changed)'+
                                                        'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
                                                        new_time_value,
                                                        _selected_company_id+'-'+_selected_user_id+'-'+new_time_value,
                                                        _selected_job_id,
                                                        _client_name,
                                                        file_folder+'/'+file_id+'.jpg',
                                                        create_date_string,
                                                        'image/jpeg',
                                                        width,height,file_size,
                                                        1,
                                                        1,
                                                        1);
                                        }
                                        db.close();
                                }
                                if(e.index == self.default_main_menu_button_index){//menu menu
                                        self.close_all_window_and_return_to_menu(); 
                                }else{                                                                
                                        win.close();
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
                var _selected_job_signature_id = win.job_signature_id;
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
                                if(win.action_for_signature == 'edit_job_signature'){
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
                                if(win.action_for_signature == 'edit_job_signature'){
                                        var _file_name_array = _path.split('/');
                                        var _file_name = _file_name_array[_file_name_array.length-1];
                                        var _file_folder = self.file_directory+_selected_company_id+'/'+_type+'/'+_selected_job_reference_number+'/signature';                                        
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
                                                                                                if(!self.create_directory(_selected_company_id+'/'+_type+'/'+_selected_job_reference_number+'/signature')){
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
                                                                                                        error_source:window_source+' - _init_signature_area_field - xhr.onload - 1',
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
                                                                                                error_source:window_source+' - _init_signature_area_field - xhr.onload - 2',
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
                                                                        xhr.open('GET',self.get_media_url()+'/'+_path);
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
                                var line = Ti.UI.createLabel({
                                        top:self.default_table_view_row_height+10,
                                        left:(self.is_ipad())?50:10,
                                        right:(self.is_ipad())?50:10,
                                        height:2,
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-20,
                                        backgroundColor:self.section_header_title_font_color
                                });
                                win.add(line);   
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
                                                        if(_selected_job_signature_id > 1000000000){
                                                                db.execute('DELETE FROM my_'+_type+'_signature WHERE id=?',_selected_job_signature_id);
                                                        }else{
                                                                db.execute('UPDATE my_'+_type+'_signature SET changed=?,status_code=?  WHERE id='+_selected_job_signature_id,
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
                                        var rows = db.execute('SELECT * FROM my_'+_type+'_signature WHERE id=?',_selected_job_signature_id);
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
        }

        win.addEventListener('open',function(){
                try{
                        if(job_base_signature_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_base_signature_page.prototype = new F();
                                job_base_signature_page.prototype.constructor = job_base_signature_page;
                                job_base_signature_page_obj = new job_base_signature_page();
                                job_base_signature_page_obj.init();
                        }
                        job_base_signature_page_obj.display();
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_base_signature_page_obj.close_window();
                        job_base_signature_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());