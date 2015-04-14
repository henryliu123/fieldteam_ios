/*jslint maxerr:10000 */
//display all menu of job

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'operate_camera.js');
        var win = Titanium.UI.currentWindow;
        var edit_task_page_obj = null;
        function edit_task_page(){
                var self = this;
                var window_source = 'base_job_address_page';
                //public member
                self.temp_number = 0;

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                   
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win); 
                                var db = Titanium.Database.open(self.get_db_name());
                                
                                _init_window_title();                           
                                _init_detail_section(db);
                                _init_description_section(db);
                                _init_booking_note_section(db);
                                _init_client_contact_section(db);
                                _init_site_contact_section(db);
                                _init_user_section(db);
                                _init_note_section(db);
                                if(!self.is_ios_7_plus()){
                                        _init_a_separate_line();
                                }
                                _init_media_section(db);    
                                if(!self.is_ios_7_plus()){
                                        _init_a_separate_line();
                                }
                                _init_create_unrelated_job_section(db);
                                db.close();
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
                                self.table_view.rowBackgroundColor = 'white';

                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Accept','Main,Back');
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }
                };
                /**
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                   
                self.nav_right_btn_click_event = function(e){
                        try{
                                _accept_task_event();                        
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
                                win.close();                         
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_left_btn_click_event');
                                return;
                        }
                };
                /**
                 *  override table_view_click_event function of parent class: fieldteam.js
                 */   
                self.table_view_click_event = function(e){
                        try{
                                _event_for_table_view(e);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }
                };

                /**
                 * display all fields
                 */
                self.display = function(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                _section_no = 0;
                                _display_detail_section(db);
                                _display_description_section(db);
                                _display_booking_note_section(db);
                                _display_client_contact_section(db);
                                _display_site_contact_section(db);
                                _display_user_section(db);
                                _display_note_section(db);
                                if(!self.is_ios_7_plus()){
                                        _section_no++;//separate line
                                } 
                                _display_media_section(db);
                                if(!self.is_ios_7_plus()){
                                        _section_no++;//separate line
                                }                                                     
                                self.table_view.setData(self.data);
                                db.close();                    
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.display');
                                return;
                        }
                };

                //private member
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
                var _can_view_materials = Titanium.App.Properties.getBool('can_view_materials');
                var _parent_win = win.parent_win;

                function _event_for_table_view(e){
                        try{
                                switch(e.row.filter_class){
                                        case 'detail_client':
                                                _event_for_table_view_click_detail_client(e);
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
                                        case 'media':
                                                _event_for_table_view_click_media(e);
                                                break;                                              
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_table_view');
                                return;
                        }
                }
                function _event_for_table_view_click_detail_client(e){
                        try{
                                if(e.source.name === 'view_btn'){
                                        var view_client_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url', 'job/edit/job_client_view.js'),
                                                type:_type,
                                                job_id:_selected_job_id,
                                                job_reference_number:_selected_job_reference_number,
                                                client_id:e.row.client_id,
                                                client_reference_number:e.row.client_reference_number,
                                                client_type_code:e.row.client_type_code,
                                                action_for_client:'view_client',
                                                parent_win:win
                                        });
                                        Titanium.UI.currentTab.open(view_client_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });                                        
                                }else{                                   
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_table_view_click_detail_client');
                                return;
                        }
                }                
                function _event_for_table_view_click_client_contact(e){
                        try{
                                if(e.source.name === 'view_btn'){
                                        var new_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url','job/edit/job_client_contact_view.js'),
                                                type:_type,
                                                job_client_contact_id:e.row.job_client_contact_id,
                                                client_contact_id:e.row.object_id,
                                                client_id:_client_id,
                                                job_id:_selected_job_id,
                                                job_reference_number:_selected_job_reference_number,
                                                action_for_client_contact:'view_job_client_contact',
                                                source:'job_index_view'
                                        });
                                        Ti.UI.currentTab.open(new_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });
                                }else{
                                        if((e.row.title != undefined)&& (e.row.title === 'Client Contacts')){
                                                new_win = Ti.UI.createWindow({
                                                        url:self.get_file_path('url','job/base/job_client_contact_list.js'),
                                                        type:_type,
                                                        job_id:_selected_job_id,
                                                        client_id:_client_id,
                                                        is_task:true,
                                                        job_reference_number:_selected_job_reference_number
                                                });       
                                                Titanium.UI.currentTab.open(new_win,{
                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                });   
                                        }else{
                                        }
                                     
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_table_view_click_client_contact');
                                return;
                        }
                }
                function _event_for_table_view_click_site_contact(e){
                        try{
                                if(e.source.name === 'view_btn'){
                                        var new_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url', 'job/edit/job_site_contact_view.js'),
                                                type:_type,
                                                job_id:_selected_job_id,
                                                job_reference_number:_selected_job_reference_number,
                                                action_for_site_contact:'view_job_site_contact',
                                                site_contact_id:e.row.object_id
                                        });
                                        Ti.UI.currentTab.open(new_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });
                                }else{
                                        if((e.row.title != undefined)&& (e.row.title === 'Site Contacts')){
                                                new_win = Ti.UI.createWindow({
                                                        url:self.get_file_path('url','job/base/job_site_contact_list.js'),
                                                        type:_type,
                                                        job_id:_selected_job_id,
                                                        is_task:true,
                                                        job_reference_number:_selected_job_reference_number
                                                });                     
                                                Ti.UI.currentTab.open(new_win,{
                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                });   
                                        }else{                                        
                                        }
                                     
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_table_view_click_site_contact');
                                return;
                        }
                }
                function _event_for_table_view_click_user(e){
                        try{
                                if(e.source.name === 'view_btn'){
                                        var new_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url','job/edit/job_user_view.js',''),
                                                type:_type,
                                                job_id:_selected_job_id,
                                                job_reference_number:_selected_job_reference_number,
                                                action_for_user:'view_job_user',
                                                manager_user_id:e.row.manager_user_id,
                                                job_assigned_user_id:e.row.object_id,
                                                job_assigned_user_code:e.row.job_assigned_user_code,
                                                assigned_from:e.row.assigned_from,
                                                assigned_to:e.row.assigned_to
                                        });
                                        Ti.UI.currentTab.open(new_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });
                                }else{   
                                        if((e.row.title != undefined)&& (e.row.title === 'Assigned Users')){
                                                new_win = Ti.UI.createWindow({
                                                        url:self.get_file_path('url','job/base/job_assigned_user_list.js'),
                                                        type:_type,
                                                        job_id:_selected_job_id,
                                                        is_task:true,
                                                        job_reference_number:_selected_job_reference_number
                                                });          
                                                Ti.UI.currentTab.open(new_win,{
                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                });
                                        }else{                                        
                                        }
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_table_view_click_user');
                                return;
                        }
                }
                function _event_for_table_view_click_note(e){
                        try{
                                var new_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url',e.row.view_url),
                                        type:_type,
                                        is_task:true,
                                        job_id:_selected_job_id
                                });
                                Ti.UI.currentTab.open(new_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_table_view_click_note');
                                return;
                        }                        
                }
                function _event_for_table_view_click_media(e){
                        try{
                                var new_win = Ti.UI.createWindow({
                                        title:((e.row.asset_type_name).toLowerCase() ==='document')?'Other Media':self.ucfirst_for_each(e.row.asset_type_name),
                                        url:self.get_file_path('url',e.row.view_url) ,
                                        type:_type,
                                        job_id:_selected_job_id,
                                        job_reference_number:_selected_job_reference_number,
                                        is_task:true,
                                        asset_type_code:e.row.asset_type_code,
                                        asset_type_path:e.row.asset_type_path,
                                        asset_type_name:e.row.asset_type_name
                                });
                                Ti.UI.currentTab.open(new_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_table_view_click_media');
                                return;
                        }                        
                }
                  
                /**
                 *  init window title
                 */
                function _init_window_title(){
                        try{             
                                self.data = [];
                                win.title = 'Edit Task';                               
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_window_title');
                                return;
                        }
                }                
                                             
                /**
                 *  init header view of row and set events for click button
                 */
                function _init_row_header_view(type_class,title,is_show_edit_btn,header_title_btn_url){
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
                                        text:title,
                                        textAlign:'left',
                                        top:0,
                                        left:(self.is_ipad())?50:10,
                                        width:200,
                                        height:_header_view_title_height,
                                        color:self.section_header_title_font_color,
                                        shadowColor:self.section_header_title_shadow_color,
                                        shadowOffset:self.section_header_title_shadow_offset
                                });
                                if(self.is_ios_7_plus()){
                                        header_title_label.left = 10;
                                }                                
                                header_view.add(header_title_label);                                
                                var section = Ti.UI.createTableViewSection({
                                        headerView:header_view
                                });
                                self.data[_section_no] = section;  
                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_row_header_view');
                                return;
                        }
                }   
                /**
                 *  init detail section,e.g title,status and client
                 */                
                function _init_detail_section(db){
                        try{
                                
                                var is_exist_valid_job_detail = false;
                                var rows = db.execute('SELECT * from my_'+_type+' WHERE id=?',_selected_job_id);
                                if((rows.getRowCount() > 0)&& (rows.fieldByName('title') != null) && (self.trim(rows.fieldByName('title')) != '')){
                                        is_exist_valid_job_detail = true;
                                        var client_id = rows.fieldByName('client_id');
                                        var title_text = rows.fieldByName('title');
                                        var job_id = rows.fieldByName('id');
                                        var job_status_code = rows.fieldByName(_type+'_status_code');
                                        var params = {
                                                sub_number:rows.fieldByName('sub_number'),
                                                unit_number:rows.fieldByName('unit_number'),
                                                street_number:rows.fieldByName('street_number'),
                                                street:rows.fieldByName('street'),
                                                street_type:rows.fieldByName('street_type'),
                                                street_type_id:rows.fieldByName('locality_street_type_id'),
                                                state_id:rows.fieldByName('locality_state_id'),
                                                suburb:rows.fieldByName('suburb'),
                                                postcode:rows.fieldByName('postcode'),
                                                suburb_id:rows.fieldByName('locality_suburb_id')
                                        };
                                }
                                rows.close();
                                _init_row_header_view('job_detail',self.ucfirst(_type)+' Detail',is_exist_valid_job_detail,self.get_file_path('url', 'job/edit/job_detail.js'));
                                if(is_exist_valid_job_detail){
                                        //add client row                                        
                                        _setup_client_row_for_detail_section(db,client_id);
                                        
                                        //add title row
                                        _setup_title_row_for_detail_section(db,title_text);

                                        //add status row
                                        _setup_status_row_for_detail_section(db,job_status_code);
                                        
                                        //add status reason row
                                        _setup_status_reason_row_for_detail_section(db,job_id,job_status_code);                                        

                                        //add address row
                                        _setup_address_row_for_detail_section(db,params);
                                }
                                _section_no++;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_detail_section');
                                return;
                        }
                }
                function _init_description_section(db){
                        try{
                                var is_exist_valid_job_description = false;
                                var rows = db.execute('SELECT * from my_'+_type+' WHERE id=?',_selected_job_id);
                                if((rows.getRowCount() > 0)&&(self.trim(rows.fieldByName('description')).length > 0)){
                                        is_exist_valid_job_description = true;
                                }      
                                rows.close();
                                _init_row_header_view('job_description','Description',is_exist_valid_job_description,self.get_file_path('url', 'job/base/job_description.js'));
                                _setup_row_for_detail_description_section(db);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_description_section');
                                return;
                        }
                }
                function _init_booking_note_section(db){
                        try{
                                var is_exist_valid_job_booking_note = false;
                                var rows = db.execute('SELECT * from my_'+_type+' WHERE id=?',_selected_job_id);
                                if((rows.getRowCount() > 0)&&(self.trim(rows.fieldByName('booking_note')).length > 0)){
                                        is_exist_valid_job_booking_note = true;
                                }
                                rows.close();
                                _init_row_header_view('job_booking_note','Booking Note',is_exist_valid_job_booking_note,self.get_file_path('url', 'job/base/job_booking_note.js'));
                                _setup_row_for_detail_booking_note_section(db);
                        }
                        catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_booking_note_section');
                                return;
                        }
                }
                function _init_client_contact_section(db){
                        try{
                                _init_row_header_view('client_contact','Client Contacts',false,self.get_file_path('url', 'job/base/job_client_contact.js'));
                                _setup_row_for_client_contact_section(db);                               
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_contact_section');
                                return;
                        }
                }
                function _init_site_contact_section(db){
                        try{
                                _init_row_header_view('site_contact','Site Contacts',false,self.get_file_path('url', 'job/base/job_site_contact.js'));
                                _setup_row_for_site_contact_section(db);
                        }
                        catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_site_contact_section');
                                return;
                        }
                }
                function _init_user_section(db){
                        try{
                                _init_row_header_view('assigned_user','Assigned Users',false,self.get_file_path('url', 'job/base/job_assigned_user.js'));
                                _setup_row_for_user_section(db);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_user_section');
                                return;
                        }
                }
                function _init_note_section(db){
                        try{
                                _init_row_header_view('notes','Notes',false,self.get_file_path('url', 'job/base/job_note.js'));
                                _setup_row_for_note_section(db);                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_note_section');
                                return;
                        }
                }
                function _init_media_section(db){
                        try{
                                var rows = null;
                                rows = db.execute('SELECT * FROM my_'+_type+'_asset_type_code WHERE code>0 order by code asc');
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                if(rows.fieldByName('code') != 6){
                                                        _setup_row_controls_for_media_section(rows);
                                                        _setup_row_for_media_section(rows,db);                                                
                                                        _section_no++;  
                                                }else{
                                                        if(_can_view_materials){
                                                                _setup_row_controls_for_media_section(rows);
                                                                _setup_row_for_media_section(rows,db);                                                
                                                                _section_no++;                                                                  
                                                        }
                                                }
                                                rows.next();
                                        }
                                }
                                rows.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_media_section');
                                return;
                        }
                }
                function _init_create_unrelated_job_section(db){
                        try{
                                _init_row_header_view('accept_task','Accept Task',false,'');
                                _setup_row_for_accept_job_btn_section(db);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_create_unrelated_job_section');
                                return;
                        }
                }                
                function _init_a_separate_line(){
                        try{
                                var header_view = Ti.UI.createView({
                                        left:10,
                                        right:10,
                                        height:2,
                                        width:self.screen_width                
                                });
                                var header_line = Ti.UI.createLabel({
                                        left:(self.is_ipad())?50:10,
                                        right:(self.is_ipad())?50:10,
                                        height:2,
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-20,
                                        backgroundColor:self.section_header_title_font_color
                                });
                                if(self.is_ios_7_plus()){
                                        header_line.left = 10;
                                        header_line.right = 10;
                                        header_line.width = self.screen_width-20;
                                }                                       
                                header_view.add(header_line);

                                var section = Ti.UI.createTableViewSection({
                                        headerView:header_view
                                });
                                self.data[_section_no] = section;
                                _section_no++;
                        }
                        catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_a_separate_line');
                                return;
                        }
                }
                /**
                 *  display some sections (e.g detail, description ...)
                 */
                function _display_detail_section(db){
                        try{
                                if((self.data[_section_no].rows != null)&&(self.data[_section_no].rows.length >0)){
                                        for(var i=0,j=self.data[_section_no].rows.length;i<j;i++){
                                                self.data[_section_no].remove(self.data[_section_no].rows[0]);
                                        }
                                }
                                var is_exist_valid_job_detail = false;
                                //job detail section
                                var rows = db.execute('SELECT * from my_'+_type+' WHERE id=?',_selected_job_id);
                                var row_count = rows.getRowCount();
                                if((row_count > 0)&& (rows.fieldByName('title') != null) && (self.trim(rows.fieldByName('title')) != '')){
                                        is_exist_valid_job_detail = true;
                                        var client_id = rows.fieldByName('client_id');
                                        var title_text = rows.fieldByName('title');
                                        var job_id = rows.fieldByName('id');
                                        var job_status_code = rows.fieldByName(_type+'_status_code');
                                        var params = {
                                                sub_number:rows.fieldByName('sub_number'),
                                                unit_number:rows.fieldByName('unit_number'),
                                                street_number:rows.fieldByName('street_number'),
                                                street:rows.fieldByName('street'),
                                                street_type:rows.fieldByName('street_type'),
                                                street_type_id:rows.fieldByName('locality_street_type_id'),
                                                state_id:rows.fieldByName('locality_state_id'),
                                                suburb:rows.fieldByName('suburb'),
                                                postcode:rows.fieldByName('postcode'),
                                                suburb_id:rows.fieldByName('locality_suburb_id')
                                        };
                                }
                                rows.close();                               
                                
                                if(is_exist_valid_job_detail){
                                        //add client row
                                        _setup_client_row_for_detail_section(db,client_id);
                                        //add title row                                        
                                        _setup_title_row_for_detail_section(db,title_text);

                                        //add status row
                                        _selected_job_status_code = job_status_code;
                                        _setup_status_row_for_detail_section(db,job_status_code);

                                        //add status reason row
                                        _setup_status_reason_row_for_detail_section(db,job_id,job_status_code);
                                        //add address row
                                        _setup_address_row_for_detail_section(db,params);
                                }
                                _section_no++;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_detail_section');
                                return;
                        }
                }
                function _display_description_section(db){
                        try{
                                if((self.data[_section_no].rows != null)&&(self.data[_section_no].rows.length >0)){
                                        for(var i=0,j=self.data[_section_no].rows.length;i<j;i++){
                                                self.data[_section_no].remove(self.data[_section_no].rows[0]);
                                        }
                                }
                                _setup_row_for_detail_description_section(db);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_description_section');
                                return;
                        }
                }
                function _display_booking_note_section(db){
                        try{
                                if((self.data[_section_no].rows != null)&&(self.data[_section_no].rows.length >0)){
                                        for(var i=0,j=self.data[_section_no].rows.length;i<j;i++){
                                                self.data[_section_no].remove(self.data[_section_no].rows[0]);
                                        }
                                }
                                _setup_row_for_detail_booking_note_section(db);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_booking_note_section');
                                return;
                        }
                }
                function _display_client_contact_section(db){
                        try{
                                //client contact section           
                                if((self.data[_section_no].rows != null)&&(self.data[_section_no].rows.length >0)){
                                        for(var i=0,j=self.data[_section_no].rows.length;i<j;i++){
                                                self.data[_section_no].remove(self.data[_section_no].rows[0]);
                                        }
                                }
                                _setup_row_for_client_contact_section(db);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_client_contact_section');
                                return;
                        }
                }
                function _display_site_contact_section(db){
                        try{
                                //client contact section
                                if((self.data[_section_no].rows != null)&&(self.data[_section_no].rows.length >0)){
                                        for(var i=0,j=self.data[_section_no].rows.length;i<j;i++){
                                                self.data[_section_no].remove(self.data[_section_no].rows[0]);
                                        }
                                }
                                _setup_row_for_site_contact_section(db);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_site_contact_section');
                                return;
                        }
                }
                function _display_user_section(db){
                        try{
                                //client contact section
                                if((self.data[_section_no].rows != null)&&(self.data[_section_no].rows.length >0)){
                                        for(var i=0,j=self.data[_section_no].rows.length;i<j;i++){
                                                self.data[_section_no].remove(self.data[_section_no].rows[0]);
                                        }
                                }
                                _setup_row_for_user_section(db);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_user_section');
                                return;
                        }                                                        
                }
                function _display_note_section(db){
                        try{
                                if((self.data[_section_no].rows != null)&&(self.data[_section_no].rows.length >0)){
                                        for(var i=0,j=self.data[_section_no].rows.length;i<j;i++){
                                                self.data[_section_no].remove(self.data[_section_no].rows[0]);
                                        }
                                }
                                _setup_row_for_note_section(db);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_note_section');
                                return;
                        }                        
                }    
                function _display_media_section(db){
                        try{                                
                                var rows = null;
                                rows = db.execute('SELECT * FROM my_'+_type+'_asset_type_code WHERE code>0 order by code asc');
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                if(rows.fieldByName('code') != 6){
                                                        if((self.data[_section_no].rows != null)&&(self.data[_section_no].rows.length >0)){
                                                                for(var i=0,j=self.data[_section_no].rows.length;i<j;i++){
                                                                        self.data[_section_no].remove(self.data[_section_no].rows[0]);
                                                                }
                                                        }
                                                        _setup_row_for_media_section(rows,db);                                               
                                                        _section_no++;    
                                                }else{
                                                        if(_can_view_materials){
                                                                if((self.data[_section_no].rows != null)&&(self.data[_section_no].rows.length >0)){
                                                                        for(i=0,j=self.data[_section_no].rows.length;i<j;i++){
                                                                                self.data[_section_no].remove(self.data[_section_no].rows[0]);
                                                                        }
                                                                }
                                                                _setup_row_for_media_section(rows,db);                                               
                                                                _section_no++;                                                                    
                                                        }
                                                }
                                                rows.next();
                                        }
                                }
                                rows.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_media_section');
                                return;
                        }
                }
                /**
                 * setup row for _init_detail_section and _display_detail_section
                 */
                function _setup_client_row_for_detail_section(db,client_id){
                        try{
                                var client_name = 'N/A';
                                var client_reference_number = 0;
                                var client_type_code = 1;
                                if((client_id != undefined) && (client_id != null)){
                                        var client_rows = db.execute('SELECT * FROM my_client WHERE id=?',client_id);
                                        if((client_rows.getRowCount()>0) && (client_rows.isValidRow())){
                                                client_name = client_rows.fieldByName('client_name');
                                                client_reference_number = client_rows.fieldByName('reference_number');
                                                client_type_code = client_rows.fieldByName('client_type_code');
                                        }   
                                        client_rows.close();
                                }
                                var row = Ti.UI.createTableViewRow({
                                        filter_class:'detail_client',
                                        className:'detail_client',
                                        header:'Detail',
                                        height:'auto',
                                        hasChild:false,
                                        client_id:client_id,
                                        client_reference_number:client_reference_number,
                                        client_type_code:client_type_code
                                });
                                if(client_name !='N/A'){
                                        var view_btn = Ti.UI.createButton({
                                                name:'view_btn',
                                                backgroundImage:self.get_file_path('image', 'BUTT_grn_off.png'),
                                                color:'#fff',
                                                font:{
                                                        fontSize:_header_view_font_size-2,
                                                        fontWeight:'bold'
                                                },
                                                title:'View',
                                                textAlign:'center',
                                                style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
                                                left:10,
                                                top:5,
                                                width:_header_view_button_width-5,
                                                height:_header_view_button_height
                                        });
                                        row.add(view_btn);                                        
                                }
                                var title_label = Ti.UI.createLabel({
                                        top:5,
                                        left:(client_name !='N/A')?10+_header_view_button_width:10,
                                        width:self.screen_width-50,
                                        text:client_name,
                                        height:20,
                                        font:{
                                                fontSize:self.normal_font_size,
                                                fontWeight:self.font_weight
                                        }
                                });
                                row.add(title_label);
                                var description_label = Ti.UI.createLabel({
                                        bottom:3,
                                        left:(client_name !='N/A')?10+_header_view_button_width:10,
                                        width:self.screen_width-50,
                                        text:'[client]',
                                        height:20,
                                        font:{
                                                fontSize:self.small_font_size
                                        }
                                });
                                row.add(description_label);
                                self.data[_section_no].add(row);                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_client_row_for_detail_section');
                                return;
                        }
                }
                function _setup_title_row_for_detail_section(db,title_text){
                        try{
                                if((title_text === undefined) || (title_text === null)){
                                        title_text = '';
                                }
                                var row = Ti.UI.createTableViewRow({
                                        filter_class:'detail_title',
                                        className:'detail_title',
                                        height:'auto',
                                        hasChild:false
                                });
                                var title_label = Ti.UI.createLabel({
                                        top:5,
                                        left:10,
                                        width:self.screen_width-50,
                                        text:title_text,
                                        height:20,
                                        font:{
                                                fontSize:self.normal_font_size,
                                                fontWeight:self.font_weight
                                        }
                                });
                                row.add(title_label);
                                var description_label = Ti.UI.createLabel({
                                        bottom:3,
                                        left:10,
                                        width:self.screen_width-50,
                                        text:'[title]',
                                        height:20,
                                        font:{
                                                fontSize:self.small_font_size
                                        }
                                });
                                row.add(description_label);
                                self.data[_section_no].add(row);                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_title_row_for_detail_section');
                                return;
                        }
                }
                function _setup_status_row_for_detail_section(db,status_code){
                        try{
                                var status_text = '';
                                if((status_code != undefined) && (status_code != null)){
                              
                                        var status_rows = db.execute('SELECT * FROM my_'+_type+'_status_code WHERE code=?',status_code);
                                        if((status_rows.getRowCount()>0) && (status_rows.isValidRow())){
                                                status_text = status_rows.fieldByName('name');
                                        }
                                        status_rows.close();
                                }
                                var row = Ti.UI.createTableViewRow({
                                        filter_class:'detail_status',
                                        className:'detail_status',
                                        height:'auto',
                                        hasChild:false,
                                        object_id:status_code
                                });
                                var status_title_label = Ti.UI.createLabel({
                                        top:5,
                                        left:10,
                                        width:self.screen_width-50,
                                        text:status_text,
                                        height:20,
                                        font:{
                                                fontSize:self.normal_font_size,
                                                fontWeight:self.font_weight
                                        }
                                });
                                row.add(status_title_label);
                                var status_description_label = Ti.UI.createLabel({
                                        bottom:3,
                                        left:10,
                                        width:self.screen_width-50,
                                        text:'[status]',
                                        height:20,
                                        font:{
                                                fontSize:self.small_font_size
                                        }
                                });
                                row.add(status_description_label);
                                self.data[_section_no].add(row);                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_status_row_for_detail_section');
                                return;
                        }
                }
                function _setup_status_reason_row_for_detail_section(db,job_id,job_status_code){
                        try{
                                var status_reason_text = '';
                                var status_log_id = 0;
                                if((job_id != undefined) && (job_id != null)){                               
                                        var status_reason_rows = db.execute('SELECT * FROM my_'+_type+'_status_log WHERE '+_type+'_id=? and '+_type+'_status_code=? order by id desc limit 1',job_id,job_status_code);
                                        if((status_reason_rows.getRowCount() > 0) &&(status_reason_rows.isValidRow())){
                                                status_reason_text = status_reason_rows.fieldByName('reason');
                                                status_log_id = status_reason_rows.fieldByName('id');
                                        }
                                        status_reason_rows.close();                                
                                }
                                if((status_reason_text != '')&&(self.trim(status_reason_text) != '')){
                                        var row = Ti.UI.createTableViewRow({
                                                filter_class:'detail_status_reason',
                                                className:'detail_status_reason',
                                                height:'auto',
                                                hasChild:false,
                                                job_status_log_id:status_log_id
                                        });
                                        var status_reason_title_label = Ti.UI.createLabel({
                                                top:5,
                                                left:10,
                                                width:self.screen_width-50,
                                                text:status_reason_text,
                                                height:20,
                                                font:{
                                                        fontSize:self.normal_font_size,
                                                        fontWeight:self.font_weight
                                                }
                                        });
                                        row.add(status_reason_title_label);
                                        var status_reason_description_label = Ti.UI.createLabel({
                                                bottom:3,
                                                left:10,
                                                width:self.screen_width-50,
                                                text:'[status reason]',
                                                height:20,
                                                font:{
                                                        fontSize:self.small_font_size
                                                }
                                        });
                                        row.add(status_reason_description_label);
                                        self.data[_section_no].add(row);  
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_status_reason_row_for_detail_section');
                                return;
                        }
                }
                function _setup_address_row_for_detail_section(db,params){
                        try{
                                var state = '';
                                if((params != undefined) && (params != null)){
                                        var state_rows = db.execute('SELECT * FROM my_locality_state WHERE id=?',params.state_id);
                                        if((state_rows.getRowCount() > 0) && (state_rows.isValidRow())){
                                                state = state_rows.fieldByName('state');
                                        }
                                        state_rows.close();
                                }
                                var suburb = ((params != undefined) && (params != null))?params.suburb:'';
                                suburb = (suburb === null)?'':suburb;
                                
                                var postcode = ((params != undefined) && (params != null))?params.postcode:'';
                                postcode = (postcode === null)?'':postcode;                                
                                
                                var sub_number = ((params != undefined) && (params != null))?params.sub_number:'';
                                var unit = ((params != undefined) && (params != null))?params.unit_number:'';
                                if(unit === null){
                                        unit = '';
                                }
                                var street_no = ((params != undefined) && (params != null))?params.street_number:'';
                                street_no = (street_no === null)?'':street_no;
                                var street_type_id = ((params != undefined) && (params != null))?params.street_type_id:'';
                                var street_type = ((params != undefined) && (params != null))?params.street_type:'';
                                street_type = (street_type === null)?'':street_type;
                                var street = ((params != undefined) && (params != null))?params.street:'';
                                street = (street=== null)?'':self.trim(street);
                                street = self.display_correct_street(street,street_type);
                                var address = '';
                                if(street === ''){
                                        address = '(Blank)';
                                }else{
                                        if((sub_number === '') || (sub_number === null)){
                                                if((unit === '') || (unit === null)){
                                                        address = street_no+' '+street+', '+suburb+(postcode === ''?'':' '+postcode);
                                                }else{
                                                        address = unit+'/'+street_no+' '+street+', '+suburb+(postcode === ''?'':' '+postcode);
                                                }
                                        }else{
                                                if((unit === '') || (unit === null)){
                                                        address = street_no+' '+street+', '+suburb+(postcode === ''?'':' '+postcode);
                                                }else{
                                                        address = unit+'-'+sub_number+'/'+street_no+' '+street+', '+suburb+(postcode === ''?'':' '+postcode);
                                                }
                                        }                                                                                
                                }
                                if(address != ''){
                                        address = address.toUpperCase();
                                }
                                var state_id = ((params != undefined) && (params != null))?params.state_id:0;
                                var suburb_id = ((params != undefined) && (params != null))?params.suburb_id:0;
                                var row = Ti.UI.createTableViewRow({
                                        filter_class:'detail_address',
                                        className:'detail_address',
                                        height:'auto',
                                        hasChild:false,
                                        sub_number:sub_number,
                                        unit_number:unit,
                                        street_number:street_no,
                                        street:street,
                                        suburb:suburb,
                                        postcode:postcode,
                                        state:state,
                                        stateID:((state_id === null)||(state_id === ''))?0:state_id,
                                        street_type:street_type,
                                        street_type_id:street_type_id,
                                        suburb_id:((suburb_id === null)||(suburb_id === ''))?0:suburb_id
                                });
                                var address_title_label = Ti.UI.createLabel({
                                        top:5,
                                        left:10,
                                        width:self.screen_width-50,
                                        text:address,
                                        height:20,
                                        font:{
                                                fontSize:self.normal_font_size,
                                                fontWeight:self.font_weight
                                        }
                                });
                                row.add(address_title_label);
                                var address_description_label = Ti.UI.createLabel({
                                        bottom:3,
                                        left:10,
                                        width:self.screen_width-50,
                                        text:'[address]',
                                        height:20,
                                        font:{
                                                fontSize:self.small_font_size
                                        }
                                });
                                row.add(address_description_label);
                                self.data[_section_no].add(row);                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_address_row_for_detail_section');
                                return;
                        }
                }
                /**
                 * setup row for _init_description_section and _display_description_section
                 */                
                function _setup_row_for_detail_description_section(db){
                        try{
                                var description_text = '';
                                //job detail section
                                var rows = db.execute('SELECT * from my_'+_type+' WHERE id=?',_selected_job_id);
                                description_text = rows.fieldByName('description');
                                rows.close();                             
                                if((description_text != null) && (self.trim(description_text).length > 0)){
                                        //self.data[_section_no].headerView.children[1].title = 'Edit';                
                                        var row = Ti.UI.createTableViewRow({
                                                filter_class:'detail_description',
                                                className:'detail_description',
                                                header:'Description',
                                                height:'auto',
                                                hasChild:false
                                        });
                                        var description_label = Ti.UI.createLabel({
                                                left:10,
                                                top:5,
                                                bottom:5,
                                                width:(self.is_ipad())?self.screen_width-100:self.screen_width-40,
                                                height:'auto',
                                                text:description_text,
                                                font:{
                                                        fontSize:_header_view_font_size,
                                                        fontWeight:'bold'
                                                }
                                        });
                                        row.add(description_label);
                                        self.data[_section_no].add(row);
                                }
                                _section_no++;                                
                                                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_row_for_detail_description_section');
                                return;
                        }
                }
                /**
                 * setup row for _init_booking_note_section and _display_booking_note_section
                 */
                function _setup_row_for_detail_booking_note_section(db){
                        try{
                                //job detail section
                                var rows = db.execute('SELECT * from my_'+_type+' WHERE id=?',_selected_job_id);
                                var booking_note_text = rows.fieldByName('booking_note');
                                rows.close();                            
                                if((booking_note_text != null) && (self.trim(booking_note_text).length > 0)){
                                        //self.data[_section_no].headerView.children[1].title = 'Edit';
                                        var row = Ti.UI.createTableViewRow({
                                                filter_class:'detail_booking_note',
                                                className:'detail_booking_note',
                                                header:'Booking Note',
                                                height:'auto',
                                                hasChild:false
                                        });
                                        var booking_note_label = Ti.UI.createLabel({
                                                left:10,
                                                top:5,
                                                bottom:5,
                                                width:(self.is_ipad())?self.screen_width-100:self.screen_width-40,
                                                height:'auto',
                                                text:booking_note_text,
                                                font:{
                                                        fontSize:_header_view_font_size,
                                                        fontWeight:'bold'
                                                }
                                        });
                                        row.add(booking_note_label);
                                        self.data[_section_no].add(row);                                                                               
                                }
                                _section_no++;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_row_for_detail_booking_note_section');
                                return;
                        }
                }
                /**
                 * setup row for _init_client_contact_section and _display_client_contact_section
                 */ 
                function _setup_row_for_client_contact_section(db){
                        try{
                                var rows = db.execute('SELECT * from my_'+_type+' WHERE id=?',_selected_job_id);
                                if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                        if((rows.fieldByName('client_id') != undefined)&&(rows.fieldByName('client_id') != null)){
                                                _client_id = rows.fieldByName('client_id');
                                        }
                                }
                                rows = db.execute('SELECT a.*,my_client_contact.position,my_client_contact.first_name,my_client_contact.last_name FROM my_'+_type+'_client_contact as a'+ 
                                        ' left join my_client_contact  on (my_client_contact.id = a.client_contact_id)'+
                                        ' WHERE a.'+_type+'_id=? and a.status_code=1 and my_client_contact.status_code=1',_selected_job_id);
                                var client_contact_count = rows.getRowCount();                                
                                var i=0;
                                if(client_contact_count <= 1){
                                        if(rows.getRowCount() > 0){
                                                while(rows.isValidRow()){
                                                        var row = Ti.UI.createTableViewRow({
                                                                filter_class:'client_contact',
                                                                className:'client_contact_'+i,
                                                                height:'auto',
                                                                hasChild:false,
                                                                object_id:rows.fieldByName('client_contact_id'),
                                                                job_client_contact_id:rows.fieldByName('id')
                                                        });
                                                        var edit_btn = Ti.UI.createButton({
                                                                name:'view_btn',
                                                                backgroundImage:self.get_file_path('image', 'BUTT_grn_off.png'),
                                                                color:'#fff',
                                                                font:{
                                                                        fontSize:_header_view_font_size-2,
                                                                        fontWeight:'bold'
                                                                },
                                                                title:'View',
                                                                textAlign:'center',
                                                                style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
                                                                left:10,
                                                                width:_header_view_button_width-5,
                                                                height:_header_view_button_height
                                                        });
                                                        if((rows.fieldByName('position') != null) && (self.trim(rows.fieldByName('position')) != '')){
                                                                edit_btn.top = 5;
                                                        }                                                              
                                                        row.add(edit_btn);                                                

                                                        if((rows.fieldByName('position') != null) && (self.trim(rows.fieldByName('position')) != '')){
                                                                var title_label = Ti.UI.createLabel({
                                                                        top:5,
                                                                        left:10+_header_view_button_width,
                                                                        width:self.screen_width-100,
                                                                        text:rows.fieldByName('first_name')+' '+rows.fieldByName('last_name'),
                                                                        height:20,
                                                                        font:{
                                                                                fontSize:self.normal_font_size,
                                                                                fontWeight:self.font_weight
                                                                        }
                                                                });
                                                                row.add(title_label);
                                                                var position_label = Ti.UI.createLabel({
                                                                        top:25+5,
                                                                        left:10,
                                                                        width:self.screen_width-100,
                                                                        text:'['+rows.fieldByName('position')+']',
                                                                        height:20,
                                                                        font:{
                                                                                fontSize:self.small_font_size
                                                                        }
                                                                });
                                                                row.add(position_label);
                                                        }else{
                                                                title_label = Ti.UI.createLabel({
                                                                        left:10+_header_view_button_width,
                                                                        width:self.screen_width-100,
                                                                        text:rows.fieldByName('first_name')+' '+rows.fieldByName('last_name'),
                                                                        height:20,
                                                                        font:{
                                                                                fontSize:self.normal_font_size,
                                                                                fontWeight:self.font_weight
                                                                        }
                                                                });
                                                                row.add(title_label);
                                                        }
                                                        self.data[_section_no].add(row);
                                                        i++;
                                                        rows.next();
                                                }  
                                        }
                                }else{
                                        row = Ti.UI.createTableViewRow({                                                                                   
                                                filter_class:'client_contact',
                                                className:'client_contact_'+100,
                                                height:'auto',
                                                hasChild:true,
                                                width:180,
                                                left:10,
                                                title:'Client Contacts'
                                        });
                                        var client_contact_label = Ti.UI.createLabel({
                                                right:5,
                                                backgroundColor:self.table_view_row_number_label_background_color,
                                                color:'#fff',
                                                width:30,
                                                height:20,
                                                textAlign:'center',
                                                text:client_contact_count,
                                                borderRadius:8
                                        });
                                        row.add(client_contact_label);
                                        self.data[_section_no].add(row);                                          
                                }
                                rows.close();
                                _section_no++;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_row_for_client_contact_section');
                                return;
                        }
                }
                /**
                 * setup row for _init_site_contact_section and _display_site_contact_section
                 */            
                function _setup_row_for_site_contact_section(db){
                        try{
                                var rows = db.execute('SELECT * FROM my_'+_type+'_site_contact WHERE '+_type+'_id=? and status_code=1',_selected_job_id);
                                var i=0;
                                var site_contact_count = rows.getRowCount();
                                if(site_contact_count <=1){
                                        if(rows.getRowCount() > 0){
                                                while(rows.isValidRow()){
                                                        var row = Ti.UI.createTableViewRow({
                                                                filter_class:'site_contact',
                                                                className:'site_contact_'+i,
                                                                height:'auto',
                                                                hasChild:false,
                                                                object_id:rows.fieldByName('id')
                                                        });                                       
                                                        if(rows.fieldByName('is_primary_contact')){
                                                                var edit_btn = Ti.UI.createButton({
                                                                        name:'view_btn',
                                                                        backgroundImage:self.get_file_path('image', 'BUTT_grn_off.png'),
                                                                        color:'#fff',
                                                                        font:{
                                                                                fontSize:_header_view_font_size-2,
                                                                                fontWeight:'bold'
                                                                        },
                                                                        title:'View',
                                                                        textAlign:'center',
                                                                        style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
                                                                        left:10,
                                                                        top:5,
                                                                        width:_header_view_button_width-5,
                                                                        height:_header_view_button_height
                                                                });
                                                                row.add(edit_btn);                                                 
                                                                var title_label = Ti.UI.createLabel({
                                                                        top:5,
                                                                        left:10+_header_view_button_width,
                                                                        width:self.screen_width-100,
                                                                        text:rows.fieldByName('first_name')+' '+rows.fieldByName('last_name'),
                                                                        height:20,
                                                                        font:{
                                                                                fontSize:self.normal_font_size,
                                                                                fontWeight:self.font_weight
                                                                        }
                                                                });
                                                                row.add(title_label);
                                                                var position_label = Ti.UI.createLabel({
                                                                        top:25+5,
                                                                        left:10,
                                                                        width:self.screen_width-100,
                                                                        text:'[Primary Contact]',
                                                                        height:20,
                                                                        font:{
                                                                                fontSize:self.small_font_size
                                                                        }
                                                                });
                                                                row.add(position_label);
                                                        }else{
                                                                edit_btn = Ti.UI.createButton({
                                                                        name:'view_btn',
                                                                        backgroundImage:self.get_file_path('image', 'BUTT_grn_off.png'),
                                                                        color:'#fff',
                                                                        font:{
                                                                                fontSize:_header_view_font_size-2,
                                                                                fontWeight:'bold'
                                                                        },
                                                                        title:'View',
                                                                        textAlign:'center',
                                                                        style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
                                                                        left:10,
                                                                        width:_header_view_button_width-5,
                                                                        height:_header_view_button_height
                                                                });
                                                                row.add(edit_btn);                                                 
                                                                title_label = Ti.UI.createLabel({
                                                                        left:10+_header_view_button_width,
                                                                        width:self.screen_width-100,
                                                                        text:rows.fieldByName('first_name')+' '+rows.fieldByName('last_name'),
                                                                        height:20,
                                                                        font:{
                                                                                fontSize:self.normal_font_size,
                                                                                fontWeight:self.font_weight
                                                                        }
                                                                });
                                                                row.add(title_label);
                                                        }

                                                        self.data[_section_no].add(row);
                                                        i++;
                                                        rows.next();
                                                }
                                        }
                                }
                                else{
                                        row = Ti.UI.createTableViewRow({
                                                filter_class:'site_contact',
                                                className:'site_contact'+100,
                                                height:'auto',
                                                hasChild:true,
                                                width:180,
                                                left:10,
                                                title:'Site Contacts'
                                        });
                                        var site_contact_label = Ti.UI.createLabel({
                                                right:5,
                                                backgroundColor:self.table_view_row_number_label_background_color,
                                                color:'#fff',
                                                width:30,
                                                height:20,
                                                textAlign:'center',
                                                text:site_contact_count,
                                                borderRadius:8
                                        });
                                        row.add(site_contact_label);
                                        self.data[_section_no].add(row);                                        
                                }
                                rows.close();
                                _section_no++;                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_row_for_site_contact_section');
                                return;
                        }
                }
                /**
                 * setup row for _init_assigned_user_section and _display_assigned_user_section
                 */                    
                function _setup_row_for_user_section(db){
                        try{
                                var rows = db.execute('SELECT a.*,my_manager_user.display_name,my_job_assigned_user_code.name FROM my_'+_type+'_assigned_user as a'+
                                        ' left join my_manager_user on (my_manager_user.id = a.manager_user_id) '+
                                        ' left join my_job_assigned_user_code on (my_job_assigned_user_code.code = a.job_assigned_user_code)'+
                                        ' WHERE a.'+_type+'_id=? and a.status_code=1',_selected_job_id);
                                var i=0;
                                var user_count = rows.getRowCount();
                                if(user_count <= 1){
                                        if(rows.getRowCount() > 0){
                                                while(rows.isValidRow()){
                                                        var row = Ti.UI.createTableViewRow({
                                                                filter_class:'manager_user',
                                                                className:'manager_user_'+i,
                                                                height:'auto',
                                                                hasChild:false,
                                                                object_id:rows.fieldByName('id'),
                                                                manager_user_id:rows.fieldByName('manager_user_id'),
                                                                job_assigned_user_code:rows.fieldByName('job_assigned_user_code'),
                                                                assigned_from:rows.fieldByName('assigned_from'),
                                                                assigned_to:rows.fieldByName('assigned_to')
                                                        });
                                                        var edit_btn = Ti.UI.createButton({
                                                                name:'view_btn',
                                                                backgroundImage:self.get_file_path('image','BUTT_grn_off.png'),
                                                                color:'#fff',
                                                                font:{
                                                                        fontSize:_header_view_font_size-2,
                                                                        fontWeight:'bold'
                                                                },
                                                                title:'View',
                                                                textAlign:'center',
                                                                style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
                                                                left:10,
                                                                top:5,
                                                                width:_header_view_button_width-5,
                                                                height:_header_view_button_height
                                                        });
                                                        row.add(edit_btn);                                        
                                                        var title_label = Ti.UI.createLabel({
                                                                top:5,
                                                                left:10+_header_view_button_width,
                                                                width:self.screen_width-100-_header_view_button_width,
                                                                text:rows.fieldByName('display_name'),
                                                                height:20,
                                                                font:{
                                                                        fontSize:self.normal_font_size,
                                                                        fontWeight:self.font_weight
                                                                }
                                                        });
                                                        row.add(title_label);
                                                        var position_label = Ti.UI.createLabel({
                                                                top:25+5,
                                                                left:10,
                                                                width:self.screen_width-100,
                                                                text:'['+rows.fieldByName('name')+']',
                                                                height:20,
                                                                font:{
                                                                        fontSize:self.small_font_size
                                                                }
                                                        });
                                                        row.add(position_label);
                                                        var assigned_from_label = Ti.UI.createLabel({
                                                                top:45+5,
                                                                left:10,
                                                                width:self.screen_width-100,
                                                                text:'From : '+(((rows.fieldByName('assigned_from') === null)||(rows.fieldByName('assigned_from') === ''))?'N/A':self.display_time_and_date(self.get_seconds_value_by_time_string(rows.fieldByName('assigned_from')))),
                                                                height:20,
                                                                font:{
                                                                        fontSize:self.small_font_size
                                                                }
                                                        });
                                                        row.add(assigned_from_label);
                                                        var assigned_to_label = Ti.UI.createLabel({
                                                                top:65+5,
                                                                left:10,
                                                                width:self.screen_width-100,
                                                                text:'To     : '+(((rows.fieldByName('assigned_to') === null) || (rows.fieldByName('assigned_to') === ''))?'N/A':self.display_time_and_date(self.get_seconds_value_by_time_string(rows.fieldByName('assigned_to')))),
                                                                height:20,
                                                                font:{
                                                                        fontSize:self.small_font_size
                                                                }
                                                        });
                                                        row.add(assigned_to_label);

                                                        self.data[_section_no].add(row);
                                                        i++;
                                                        rows.next();
                                                }
                                        }
                                }else{
                                        row = Ti.UI.createTableViewRow({
                                                filter_class:'manager_user',
                                                className:'manager_user_'+100,
                                                height:'auto',
                                                hasChild:true,
                                                width:150,                                                
                                                title:'Assigned Users',
                                                left:10
                                        });
                                        var user_label = Ti.UI.createLabel({
                                                right:5,
                                                backgroundColor:self.table_view_row_number_label_background_color,
                                                color:'#fff',
                                                width:30,
                                                height:20,
                                                textAlign:'center',
                                                text:user_count,
                                                borderRadius:8
                                        });
                                        row.add(user_label);
                                        self.data[_section_no].add(row);                                          
                                }
                                rows.close();
                                _section_no++;                                
                        }
                        catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_row_for_user_section');
                                return;
                        }
                }
                /**
                 * setup row for _init_note_section and _display_note_section
                 */                  
                function _setup_row_for_note_section(db){
                        try{
                                var rows = db.execute('SELECT * FROM my_'+_type+'_note WHERE '+_type+'_id=? and status_code=1 and '+_type+'_note_type_code!=2',_selected_job_id);
                                var notes_count = rows.getRowCount();
                                rows.close();
                                if(notes_count > 0){
                                        var row = Ti.UI.createTableViewRow({
                                                filter_class:'note',
                                                title:'Notes',
                                                className:'note',
                                                height:'auto',
                                                hasChild:true,
                                                view_url:'job/edit/job_notes.js'
                                        });
                                        var notes_label = Ti.UI.createLabel({
                                                right:5,
                                                backgroundColor:self.table_view_row_number_label_background_color,
                                                color:'#fff',
                                                width:30,
                                                height:20,
                                                textAlign:'center',
                                                text:notes_count,
                                                borderRadius:8
                                        });
                                        row.add(notes_label);
                                        self.data[_section_no].add(row);
                                }
                                _section_no++;                            
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_row_for_note_section');
                                return;
                        }
                }
                /**
                 * setup row for _init_media_section and _display_media_section
                 */
                function _setup_row_controls_for_media_section(rows){
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
                                        text:(rows.fieldByName('name').toLowerCase() === 'document')?'Other Media':rows.fieldByName('name'),
                                        textAlign:'left',
                                        top:0,
                                        left:(self.is_ipad())?50:10,
                                        width:200,
                                        height:_header_view_title_height,
                                        color:self.section_header_title_font_color,
                                        shadowColor:self.section_header_title_shadow_color,
                                        shadowOffset:self.section_header_title_shadow_offset
                                });
                                if(self.is_ios_7_plus()){
                                        header_title_label.left = 10;
                                }                                     
                                header_view.add(header_title_label);
                                                        
                                
                                var section = Ti.UI.createTableViewSection({
                                        headerView:header_view
                                });
                                self.data[_section_no] = section;                                       
                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_row_controls_for_media_section');
                                return;
                        }
                }
                function _setup_row_for_media_section(rows,db){
                        try{ 
                                if(rows.fieldByName('code') != 6){
                                        var asset_rows = db.execute('SELECT * FROM my_'+_type+'_asset WHERE '+_type+'_asset_type_code=? and status_code=1 and '+_type+'_id=?',rows.fieldByName('code'),_selected_job_id);
                                        if(asset_rows.getRowCount() > 0){
                                                var row = Ti.UI.createTableViewRow({
                                                        filter_class:'media',
                                                        className:(rows.fieldByName('name')).toLowerCase(),
                                                        title:'Files',
                                                        height:'auto',
                                                        hasChild:true,
                                                        asset_type_code:rows.fieldByName('code'),
                                                        asset_type_path:rows.fieldByName('path'),
                                                        asset_type_name:rows.fieldByName('name'),
                                                        view_url:'job/edit/job_media.js'
                                                });

                                                var asset_number_label = Ti.UI.createLabel({
                                                        right:5,
                                                        backgroundColor:self.table_view_row_number_label_background_color,
                                                        color:'#fff',
                                                        width:30,
                                                        height:20,
                                                        textAlign:'center',
                                                        text:asset_rows.getRowCount(),
                                                        borderRadius:8
                                                });
                                                row.add(asset_number_label);
                                                self.data[_section_no].add(row);
                                        }
                                        asset_rows.close();
                                }else{
                                        asset_rows = db.execute('SELECT * FROM my_'+_type+'_assigned_item WHERE status_code=1 and '+_type+'_id=?',_selected_job_id);
                                        var material_files = db.execute('SELECT * FROM my_'+_type+'_asset WHERE '+_type+'_asset_type_code=? and status_code=1 and '+_type+'_id=?',rows.fieldByName('code'),_selected_job_id);
                                        if((asset_rows.getRowCount() > 0)||(material_files.getRowCount() > 0)){
                                                row = Ti.UI.createTableViewRow({
                                                        filter_class:'media',
                                                        className:(rows.fieldByName('name')).toLowerCase(),
                                                        title:'Items/Files',
                                                        height:self.default_table_view_row_height,
                                                        hasChild:true,
                                                        asset_type_code:rows.fieldByName('code'),
                                                        asset_type_path:rows.fieldByName('path'),
                                                        asset_type_name:rows.fieldByName('name'),
                                                        view_url:'job/edit/job_materials.js'
                                                });

                                                asset_number_label = Ti.UI.createLabel({
                                                        right:45,
                                                        backgroundColor:self.table_view_row_number_label_background_color,
                                                        color:'#fff',
                                                        width:30,
                                                        height:20,
                                                        textAlign:'center',
                                                        text:asset_rows.getRowCount(),
                                                        borderRadius:8
                                                });
                                                row.add(asset_number_label);
                                                var line_label = Ti.UI.createLabel({
                                                        right:25,
                                                        width:30,
                                                        height:20,
                                                        textAlign:'center',
                                                        text:'/',
                                                        borderRadius:8
                                                });
                                                row.add(line_label);
                                                var material_files_number_label = Ti.UI.createLabel({
                                                        right:5,
                                                        backgroundColor:self.table_view_row_number_label_background_color,
                                                        color:'#fff',
                                                        width:30,
                                                        height:20,
                                                        textAlign:'center',
                                                        text:material_files.getRowCount(),
                                                        borderRadius:8
                                                });
                                                row.add(material_files_number_label);
                                                self.data[_section_no].add(row);
                                        }
                                        asset_rows.close();
                                        material_files.close();                                        
                                }                               
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_row_for_media_section');
                                return;
                        }
                }
                
                /**
                 * setup row for accept job or quote
                 */                 
                function _setup_row_for_accept_job_btn_section(db){
                        try{
                                var row = Ti.UI.createTableViewRow({
                                        filter_class:'accept_job',
                                        className:'accept_job',
                                        height:'auto'
                                });

                                self.accept_job_btn = Ti.UI.createButton({
                                        title:'Accept Task',
                                        backgroundImage:self.get_file_path('image', 'BUTT_grn_off.png'),
                                        textAlign:'center',
                                        height:60,
                                        width:self.screen_width-50,
                                        top:10,
                                        bottom:10
                                });
                                row.add(self.accept_job_btn);
                                self.data[_section_no].add(row);
                                _section_no++;
                                self.accept_job_btn.addEventListener('click',function(){
                                        _accept_task_event();
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_row_for_accept_job_btn_section');
                                return;
                        }                        
                }         
                    
                function _accept_task_event(){
                        try{
                                self.display_indicator('Processing Task ...',true);                                                
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
                                                Ti.API.info(this.responseText);
                                                if((xhr.readyState === 4)&&(this.status === 200)){
                                                        if(self.return_to_login_page_if_user_security_session_changed(this.responseText)){
                                                                return;
                                                        }                                                          
                                                        if(self.display_app_version_incompatiable(this.responseText)){
                                                                return;
                                                        }        
                                                        self.refresh_job_and_relative_tables(this.responseText,'job');   
                                                        var temp_result = JSON.parse(this.responseText);                                                         
                                                        self.hide_indicator();                                                           
                                                        if((temp_result.error != undefined)&&(temp_result.error.length >0)){
                                                                var error_string = '';
                                                                for(var i=0,j=temp_result.error.length;i<j;i++){
                                                                        if(i==j){
                                                                                error_string+=temp_result.error[i];
                                                                        }else{
                                                                                error_string+=temp_result.error[i]+'\n';
                                                                        }
                                                                }
                                                                var alertDialog = Titanium.UI.createAlertDialog({
                                                                        title:L('message_warning'),
                                                                        message:error_string,
                                                                        buttonNames:['Close']
                                                                });
                                                                alertDialog.show();  
                                                                alertDialog.addEventListener('click',function(e){
                                                                        switch(e.index){
                                                                                case 0:
                                                                                        if(_parent_win != undefined && _parent_win != null){
                                                                                                 Ti.App.fireEvent('refresh_task_list');
                                                                                        }
                                                                                        win.close();
                                                                                        break;                                                                                        
                                                                        }                                                                        
                                                                });                                                       
                                                        }
                                                        if((temp_result.success != undefined)&&(temp_result.success.length >0)){
                                                                var success_string = '';
                                                                for(i=0,j=temp_result.success.length;i<j;i++){
                                                                        if(i==j){
                                                                                success_string+=temp_result.success[i];
                                                                        }else{
                                                                                success_string+=temp_result.success[i]+'\n';
                                                                        }
                                                                }
                                                                alertDialog = Titanium.UI.createAlertDialog({
                                                                        title:L('message_warning'),
                                                                        message:success_string,
                                                                        buttonNames:['Close']
                                                                });
                                                                alertDialog.show(); 
                                                                alertDialog.addEventListener('click',function(e){
                                                                        switch(e.index){
                                                                                case 0:   
                                                                                        if(_parent_win != undefined && _parent_win != null){
                                                                                                 Ti.App.fireEvent('refresh_task_list');
                                                                                        }                                                                                        
                                                                                        win.close();
                                                                                        break;                                                                                        
                                                                        }                                                                        
                                                                });
                                                        }                                                                                                                                                                                                                                                                                                                                               
                                                }else{
                                                        self.hide_indicator();
                                                        var params = {
                                                                message:'Task process failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:'',
                                                                error_source:window_source+' - _accept_task_event - xhr.onload -1',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);                                                           
                                                        return;
                                                }
                                        }catch(e){
                                                self.hide_indicator();
                                                params = {
                                                        message:'Task process failed.',
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - _accept_task_event - xhr.onload -2',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params); 
                                                return;
                                        }
                                };
                                xhr.onerror = function(e){
                                        self.hide_indicator();
                                        var params = {
                                                message:'Task process failed.',
                                                show_message:true,
                                                message_title:'',
                                                send_error_email:true,
                                                error_message:e,
                                                error_source:window_source+' - _accept_task_event - xhr.onerror',
                                                server_response_message:this.responseText
                                        };
                                        self.processXYZ(params); 
                                        return;
                                };
                                xhr.onsendstream = function(e){
                                        self.update_progress(e.progress,true);
                                };
                                xhr.setTimeout(self.default_time_out);
                                xhr.open('POST',self.get_host_url()+'update',false);
                                xhr.send({
                                        'type':'accept_task',
                                        'hash':_selected_user_id,
                                        'user_id':_selected_user_id,
                                        'company_id':_selected_company_id,
                                        'task_id':_selected_job_id,
                                        'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                        'app_version_increment':self.version_increment,
                                        'app_version':self.version,
                                        'app_platform':self.get_platform_info()
                                });                                                                                                                
                        } catch(err){
                                self.hide_indicator();
                                self.process_simple_error_message(err,window_source+' - _accept_task_event');
                                return;
                        }                        
                }                
        }

        win.addEventListener('focus',function(){
                try{
                        if(edit_task_page_obj === null){                                
                                var F = function(){};
                                F.prototype = operate_camera_page.prototype;
                                edit_task_page.prototype = new F();
                                edit_task_page.prototype.constructor = edit_task_page;
                                edit_task_page_obj = new edit_task_page();
                                edit_task_page_obj.init();
                        }else{
                                edit_task_page_obj.display();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{                        
                        edit_task_page_obj.close_window();
                        edit_task_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });        
}());


