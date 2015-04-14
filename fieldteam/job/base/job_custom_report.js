/**
 *  Description: custom_report editor
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_base_custom_report_page_obj = null;

        function job_base_custom_report_page(){
                var self = this;
                var window_source = 'job_base_custom_report_page';
                if(win.action_for_custom_report == 'edit_job_custom_report'){
                        win.title = 'Edit Report';
                }else{
                        win.title = 'Add Report';
                }                

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                      
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Done','Main,Back'); 
                                self.init_vars();
                                _init_custom_report_type_field();
                                _init_custom_report_field_field();
                                if(win.action_for_custom_report == 'edit_job_custom_report'){
                                        _init_delete_btn();
                                }     
                                //call int_table_view function of parent class: fieldteam.js
                                self.init_table_view(); 
                                self.table_view.addEventListener('scroll',function(e){
                                        if(_selected_field_object != null){
                                                _selected_field_object.blur();
                                        }
                                });
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
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = null;
                                var temp_var = null; 
                                //add a new custom report, load all fields from custom_report_field table
                                if(_selected_job_custom_report_data_id <=0){
                                        rows = db.execute('SELECT * FROM my_custom_report_field WHERE status_code=1 and custom_report_id=? ORDER BY field_position asc',_selected_custom_report_id);
                                        while(rows.isValidRow()){
                                                temp_var = {
                                                        field_id:rows.fieldByName('id'),
                                                        field_title:rows.fieldByName('field_title'),
                                                        field_type:rows.fieldByName('field_type'),
                                                        field_position:rows.fieldByName('field_position'),
                                                        is_break:rows.fieldByName('is_break'),
                                                        field_option:rows.fieldByName('field_option'),
                                                        value:'',
                                                        custom_report_id:_selected_custom_report_id
                                                };
                                                _custom_report_fields.push(temp_var);
                                                rows.next();
                                        }
                                        rows.close();
                                }else{//get result from custom_report_data field.
                                        if(_selected_job_custom_report_data_id > 1000000000){
                                                rows = db.execute('SELECT * FROM my_'+_type+'_custom_report_data WHERE id=?',_selected_job_custom_report_data_id);
                                                if(rows.isValidRow()){
                                                        var temp_data = rows.fieldByName('custom_report_data');
                                                        if((temp_data != undefined) && (temp_data != null)){
                                                                _custom_report_fields = JSON.parse(temp_data);                                                        
                                                        }
                                                }
                                                rows.close();
                                        }
                                }                                                                
                                db.close();                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }
                } ;               
                /**
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                      
                self.nav_right_btn_click_event = function(e){
                        try{
                                var data_array = [];
                                if(_check_if_exist_change()){
                                        var temp_count = (win.action_for_custom_report == 'edit_job_custom_report')?self.data.length-1:self.data.length;
                                        for(var i=1,j=temp_count;i<j;i++){                                               
                                                var temp_var ={
                                                        field_id:_field_object_array[i-1].field_id,
                                                        field_title:_field_object_array[i-1].field_title,
                                                        field_type:_field_object_array[i-1].field_type,
                                                        field_position:_field_object_array[i-1].field_position,
                                                        is_break:_field_object_array[i-1].is_break,
                                                        field_option:_field_object_array[i-1].field_option,
                                                        value:_field_object_array[i-1].children[0].value                                                  
                                                };
                                                data_array.push(temp_var);   
                                        }
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var d = new Date();
                                        if(_selected_job_custom_report_data_id > 0){//update
                                                db.execute('UPDATE my_'+_type+'_custom_report_data SET custom_report_id=?,manager_user_id=?,job_id=?,custom_report_data=?,changed=? '+
                                                        ' WHERE id='+_selected_job_custom_report_data_id,
                                                        _selected_custom_report_id,_selected_user_id,_selected_job_id,JSON.stringify(data_array),
                                                        1);
                                        }else{//add
                                                var new_time_value = _selected_job_custom_report_data_id =  parseInt(d.getTime(), 10);
                                                db.execute('INSERT INTO my_'+_type+'_custom_report_data (id,local_id,'+_type+'_id,custom_report_id,manager_user_id,custom_report_data,'+
                                                        'status_code,changed)'+
                                                        'VALUES(?,?,?,?,?,?,?,?)',
                                                        new_time_value,
                                                        _selected_company_id+'-'+_selected_user_id+'-'+new_time_value,
                                                        _selected_job_id,
                                                        _selected_custom_report_id,_selected_user_id,
                                                        JSON.stringify(data_array),
                                                        1,
                                                        1);
                                        } 
                                        db.close();
                                }
                                
                                if(Ti.Network.online){
                                        //upload data and generate report ,then client can download pdf file.
                                        self.display_indicator('Generating Report ...',false);                                  
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
                                                                        return;
                                                                }
                                                                var result = JSON.parse(this.responseText);                                                        
                                                                if((result.job_custom_report_error != undefined)&&(result.job_custom_report_error.length >0)){
                                                                        self.hide_indicator();
                                                                        var error_string = '';
                                                                        for(var i=0,j=result.job_custom_report_error.length;i<j;i++){
                                                                                if(i==j){
                                                                                        error_string+=result.job_custom_report_error[i];
                                                                                }else{
                                                                                        error_string+=result.job_custom_report_error[i]+'\n';
                                                                                }
                                                                        }
                                                                        self.show_message(error_string);  
                                                                        return;
                                                                } else{
                                                                        if(_type == 'job'){
                                                                                self.update_selected_tables(null,'JobCustomReportData',result);   
                                                                        }else{
                                                                                self.update_selected_tables(null,'QuoteCustomReportData',result);  
                                                                        } 
                                                                        var db = Titanium.Database.open(self.get_db_name());
                                                                        db.execute('delete from my_'+_type+'_custom_report_data where id=?',_selected_job_custom_report_data_id);
                                                                        db.close();
                                                                        self.hide_indicator();   
                                                                        win.close();
                                                                }
                                                        }else{
                                                                self.hide_indicator();
                                                                var params = {
                                                                        message:'Create report failed.',
                                                                        show_message:true,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:'',
                                                                        error_source:window_source+' - self.nav_right_btn_click_event - xhr.onload - 1',
                                                                        server_response_message:this.responseText
                                                                };
                                                                self.processXYZ(params);                                                                      
                                                                return;
                                                        }
                                                }catch(e){
                                                        self.hide_indicator();
                                                        params = {
                                                                message:'Create report failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:e,
                                                                error_source:window_source+' - self.nav_right_btn_click_event - xhr.onload - 2',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);                                                         
                                                        return;
                                                }
                                        };
                                        xhr.onerror = function(e){
                                                self.hide_indicator();                                          
                                                var params = {
                                                        message:'Create report failed.',
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - self.nav_right_btn_click_event - xhr.onerror',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params);
                                                return;
                                        };
                                        xhr.setTimeout(self.default_time_out);
                                        xhr.open('POST',self.get_host_url()+'update',false);
                                        xhr.send({
                                                'type':'generate_report',
                                                'hash':_selected_user_id,
                                                'user_id':_selected_user_id,
                                                'company_id':_selected_company_id,
                                                'job_id':_selected_job_id,
                                                'quote_id':_selected_job_id,
                                                'reference_number':_selected_job_reference_number,
                                                'job_type':_type,
                                                'custom_report_id':_selected_custom_report_id,
                                                'manager_user_id':_selected_user_id,
                                                'is_merge_signature':0,
                                                'custom_report_data':JSON.stringify(data_array),
                                                'path':'',
                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                'app_version_increment':self.version_increment,
                                                'app_version':self.version,
                                                'app_platform':self.get_platform_info()
                                        });                                 
                                }else{
                                        if(e.index == self.default_main_menu_button_index){//menu menu
                                                self.close_all_window_and_return_to_menu(); 
                                        }else{                                                                
                                                win.close();
                                        }                                         
                                }  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }  
                };  
                /**
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
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
                //private member
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_job_reference_number = win.job_reference_number;
                var _selected_custom_report_id = win.custom_report_id;
                var _selected_job_custom_report_data_id = win.job_custom_report_data_id;
                var _selected_custom_report_title = win.custom_report_title;
                var _is_make_changed = false;
                var _selected_field_object = null;
                var _custom_report_fields = [];
                var _header_view_height = 30;
                var _header_view_title_height = 26;
                var _header_view_font_size = 16;       
                var _section_no = 0;
                var _field_object_array = [];
                //private method
                function _init_custom_report_type_field(){
                        try{
                                var header_view = Ti.UI.createView({
                                        height:_header_view_height,
                                        width:self.screen_width
                                });                
                                if(self.is_ios_7_plus()){
                                        header_view.backgroundColor = self.set_table_view_header_backgroundcolor;
                                }                                    
                                var header_title_label = Ti.UI.createLabel({
                                        font:{
                                                fontSize:_header_view_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Report Type',
                                        textAlign:'left',
                                        top:0,
                                        left:(self.is_ipad())?50:10,
                                        width:200,
                                        height:_header_view_title_height,
                                        color:self.section_header_title_font_color,
                                        shadowColor:self.section_header_title_shadow_color,
                                        shadowOffset:self.section_header_title_shadow_offset
                                });
                                header_view.add(header_title_label);  
                                var section = Ti.UI.createTableViewSection({
                                        headerView:header_view
                                });
                                self.data[_section_no] = section; 
                                var row = Ti.UI.createTableViewRow({
                                        filter_class:'custom_report_type',
                                        className:'custom_report_type',
                                        height:'auto',
                                        hasChild:false,
                                        custom_report_id:_selected_custom_report_id
                                });
                                self.custom_report_type_field = Ti.UI.createLabel({
                                        text:_selected_custom_report_title,
                                        textAlign:'left',
                                        height:'auto',
                                        width:'auto'                                        
                                });
                                row.add(self.custom_report_type_field);
                                self.data[_section_no].add(row);                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_custom_report_type_field');
                                return;                                
                        }
                }
                function _init_custom_report_field_field(){
                        try{                                
                                if(_custom_report_fields.length > 0){
                                        for(var i=0,j=_custom_report_fields.length;i<j;i++){
                                                _section_no++;
                                                var header_view = Ti.UI.createView({
                                                        height:"auto",
                                                        width:self.screen_width
                                                });
                                                if(self.is_ios_7_plus()){
                                                        header_view.backgroundColor = self.set_table_view_header_backgroundcolor;
                                                }                                                    
                                                var header_title_label = Ti.UI.createLabel({
                                                        font:{
                                                                fontSize:_header_view_font_size,
                                                                fontWeight:'bold'
                                                        },
                                                        text:_custom_report_fields[i].field_title,
                                                        textAlign:'left',
                                                        top:0,
                                                        left:(self.is_ipad())?50:10,
                                                        width:"auto",
                                                        height:"auto",
                                                        color:self.section_header_title_font_color,
                                                        shadowColor:self.section_header_title_shadow_color,
                                                        shadowOffset:self.section_header_title_shadow_offset
                                                });
                                                header_view.add(header_title_label);  
                                                var section = Ti.UI.createTableViewSection({
                                                        headerView:header_view
                                                });
                                                self.data[_section_no] = section; 
                                                var row = Ti.UI.createTableViewRow({
                                                        filter_class:'custom_report_field',
                                                        className:'custom_report_field',
                                                        height:'auto',
                                                        hasChild:false,
                                                        field_id:_custom_report_fields[i].field_id,
                                                        field_title:_custom_report_fields[i].field_title,
                                                        field_type:_custom_report_fields[i].field_type,
                                                        field_position:_custom_report_fields[i].field_position,
                                                        is_break:_custom_report_fields[i].is_break,
                                                        field_option:_custom_report_fields[i].field_option,
                                                        custom_report_id:_selected_custom_report_id
                                                });
                                                var custom_report_text_field = Ti.UI.createTextField({
                                                        paddingLeft:10,
                                                        width:(self.is_ipad()?self.screen_width-80:self.screen_width-20),
                                                        height:self.default_table_view_row_height,
                                                        textAlign:'left',
                                                        value:_custom_report_fields[i].value,
                                                        enabled:true,
                                                        color:self.selected_value_font_color,
                                                        font:{
                                                                fontSize:self.normal_font_size
                                                        },
                                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS                                                        
                                                });
                                                self.set_text_field_for_ios_7(custom_report_text_field);
                                                row.add(custom_report_text_field);
                                                self.data[_section_no].add(row);
                                                _field_object_array.push(row);
                                                
                                                custom_report_text_field.addEventListener('change',function(e){
                                                        _is_make_changed = true;
                                                });
 
                                                custom_report_text_field.addEventListener('focus',function(e){                                        
                                                        _selected_field_object = e.source;
                                                });
                                                custom_report_text_field.addEventListener('blur',function(e){
                                                        _selected_field_object = null;
                                                }); 
                                        }
                                }                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_custom_report_field_field');
                                return;                                
                        }
                }                
                /**
                 *  init delete button field
                 */
                function _init_delete_btn(){
                        try{
                                var delete_button_field = Ti.UI.createTableViewRow({
                                        className:'set_delete_button',
                                        filter_class:'set_delete_button',
                                        header:''
                                });
                                var delete_button = Ti.UI.createButton({
                                        title:'Delete',
                                        backgroundImage:self.get_file_path('image','BUTT_red_off.png'),
                                        textAlign:'center',
                                        height:self.default_table_view_row_height,
                                        width:(self.is_ipad())?self.screen_width-self.ipad_button_reduce_length_in_tableview:self.screen_width-self.iphone_button_reduce_length_in_tableview
                                });
                                delete_button_field.add(delete_button);
                                self.data.push(delete_button_field);
                                
                                delete_button.addEventListener('click',function(e){
                                        _event_for_delete_btn();
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_delete_btn');
                                return;
                        }                                
                }
                /**
                 *  event for delete button
                 */
                function _event_for_delete_btn(){
                        try{
                                var optionDialog = Ti.UI.createOptionDialog({
                                        options:(self.is_ipad())?['YES','NO','']:['YES','NO'],
                                        buttonNames:['Cancel'],
                                        destructive:0,
                                        cancel:1,
                                        title:L('message_delete_custom_report_in_job_custom_report')
                                });
                                optionDialog.show();
                                optionDialog.addEventListener('click',function(e){
                                        if(e.index === 0){
                                                var db = Titanium.Database.open(self.get_db_name());
                                                if(_selected_job_custom_report_data_id > 1000000000){
                                                        db.execute('DELETE FROM my_'+_type+'_custom_report_data WHERE id=?',_selected_job_custom_report_data_id);
                                                }else{
                                                        db.execute('UPDATE my_'+_type+'_custom_report_data SET changed=?,status_code=?  WHERE id='+_selected_job_custom_report_data_id,
                                                                1,2
                                                                );
                                                }
                                                db.close();
                                                win.close();
                                        }
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_delete_btn');
                                return;
                        }                                
                }
                /**
                 *  check if exist any change
                 */
                function _check_if_exist_change(){
                        try{
                                if(win.action_for_custom_report == 'add_job_custom_report'){
                                        return true;
                                }
                                var is_make_changed = false;
                                if(_is_make_changed){
                                        is_make_changed = true;
                                }
                                return is_make_changed;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _check_if_exist_change');
                                return false; 
                        }   
                }                           
        }

        win.addEventListener('focus',function(){
                try{
                        if(job_base_custom_report_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_base_custom_report_page.prototype = new F();
                                job_base_custom_report_page.prototype.constructor = job_base_custom_report_page;
                                job_base_custom_report_page_obj = new job_base_custom_report_page();
                                job_base_custom_report_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_base_custom_report_page_obj.close_window();
                        job_base_custom_report_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());