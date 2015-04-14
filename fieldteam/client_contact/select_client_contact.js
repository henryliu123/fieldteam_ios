/**
 *  Function List:
 *  1. Display Contact List
 *  2. More Contacts Button for display more contacts
 *  3. Download More Contacts button for downloading more contacts from server
 *  4. Click any contact and set hasChild is true
 *  6. Click "Done" Button and return selected contact id
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'transaction.js');
        var win = Titanium.UI.currentWindow;    
        var client_contact_select_client_contact_page_obj = null;

        function client_contact_select_client_contact_page(){
                var self = this;
                var window_source = 'client_contact_select_client_contact_page';
                win.title = 'Select Client Contact';
                
                //public member 
                self.pull_down_to_update = false;
                self.pull_down_to_download_more = true;                      

                //public method
                /**
                 *  override init function of parent class: transaction.js
                 */                     
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Done','Main,Back');
                                //self.init_controls();
                                _init_bottom_bar();
                                //call int_table_view function of parent class: fieldteam.js
                                self.init_table_view();
                                self.table_view.bottom = self.tool_bar_height;
                                if(self.pull_down_to_update || self.pull_down_to_download_more){
                                        self.init_pull_down_view();
                                }                                
                                //call init_no_result_label function of parent class: fieldteam.js
                                self.init_no_result_label();      
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }
                };
                /**
                 * init some controls
                 */
                self.init_controls = function(){
                        try{
                                var help_label = Ti.UI.createLabel({
                                        text:'Drag Screen For More Contacts From The Server ',
                                        bottom:3,
                                        height:14,
                                        font:{
                                                fontSize:12
                                        },
                                        color:'#fff',
                                        textAlign:'center',
                                        width:300                   
                                });

                                var bottom_tool_bar = Titanium.UI.createView({
                                        borderWidth:0,
                                        bottom:0,
                                        width:self.screen_width,
                                        height:20,
                                        backgroundColor:self.default_tool_bar_background_color,   
                                        zIndex:100
                                });
                                bottom_tool_bar.add(help_label);
                                win.add(bottom_tool_bar);                                    
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_controls');
                                return;
                        }
                };                    
                /**
                 *  override nav_right_btn_click_event function of parent class: transaction.js
                 */                     
                self.nav_right_btn_click_event = function(e){
                        try{
                                if(_selected_client_contact_id <=0){
                                        self.show_message('Please select client contact.');
                                        return;
                                }
                                if(e.index == self.default_main_menu_button_index){//menu menu
                                        self.close_all_window_and_return_to_menu(); 
                                }else{    
                                        var selected_client_contact_name = '';
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT * FROM my_client_contact WHERE id=?',_selected_client_contact_id);
                                        if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                                selected_client_contact_name = rows.fieldByName('first_name')+' '+rows.fieldByName('last_name');
                                        }
                                        rows.close();
                                        db.close();
                                        Ti.App.Properties.setBool('select_client_contact_'+win.source+'_view_flag',true); 
                                        Ti.App.Properties.setString('select_client_contact_'+win.source+'_view_id',_selected_client_contact_id); 
                                        Ti.App.Properties.setString('select_client_contact_'+win.source+'_view_content',selected_client_contact_name);                                         
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
                                if(_selected_client_contact_id != win.client_contact_id){
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
                /**
                 *  override table_view_click_event function of parent class: transaction.js
                 */                     
                self.table_view_click_event = function(e){
                        try{
                                var index = e.index;
                                var section = e.section;
                                section.rows[index].hasCheck = true;
                                for(var i=0,j=self.data.length;i<j;i++){
                                        if(i != index){
                                                section.rows[i].hasCheck = false;
                                        }
                                }
                                _selected_client_contact_id = self.data[index].client_contact_id;                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }
                };       
                /**
                 *  override begin_download_more_jobs_by_scroll_down function of parent class: transaction.js
                 *  but in fact , just download more client
                 */    
                self.begin_download_more_jobs_by_scroll_down = function(){
                        try{                
                                if(Ti.Network.online){
                                        self.display_indicator('Loading Data ...');
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
                                                                        self.end_download_more_jobs_by_scroll_down(true);
                                                                        return;
                                                                }                                                                 
                                                                if(this.responseText != '[]'){
                                                                        self.update_selected_tables(null,'ClientContact',JSON.parse(this.responseText));                                                                            
                                                                }
                                                                self.end_download_more_jobs_by_scroll_down(false);
                                                                self.display();
                                                        }else{
                                                                self.end_download_more_jobs_by_scroll_down(true);
                                                                var params = {
                                                                        message:'Download client contact list failed.',
                                                                        show_message:true,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:'',
                                                                        error_source:window_source+' - self.begin_download_more_jobs_by_scroll_down - xhr.onload -1',
                                                                        server_response_message:this.responseText
                                                                };
                                                                self.processXYZ(params);                                                                 
                                                                return;                                                                
                                                        }                                                      
                                                }catch(e){
                                                        self.end_download_more_jobs_by_scroll_down(true);
                                                        params = {
                                                                message:'Download client contact list failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:e,
                                                                error_source:window_source+' - self.begin_download_more_jobs_by_scroll_down - xhr.onload -2',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);                                                         
                                                        return;                                                        
                                                }
                                        };
                                        xhr.onerror = function(e){
                                                self.end_download_more_jobs_by_scroll_down(true);
                                                var params = {
                                                        message:'Download client contact list failed.',
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - self.begin_download_more_jobs_by_scroll_down - xhr.onerror',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params);                                                  
                                                return;                                                          
                                        };
                                        xhr.setTimeout(self.default_time_out);
                                        xhr.open('POST',self.get_host_url()+'update',false);
                                        xhr.send({
                                                'type':'get_client_contact_list_from_server_with_id_array',
                                                'hash':_selected_user_id,
                                                'company_id':_selected_company_id,
                                                'client_id':_selected_client_id,
                                                'limit':self.count_for_job_query,
                                                'client_contact_id_string':'',
                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                'app_version_increment':self.version_increment,
                                                'app_version':self.version,
                                                'app_platform':self.get_platform_info()
                                        });
                                }else{
                                        self.end_download_more_jobs_by_scroll_down(true);
                                        self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                        return;
                                }
                        }catch(err){
                                self.end_download_more_jobs_by_scroll_down(true);
                                self.process_simple_error_message(err,window_source+' - self.begin_download_more_jobs_by_scroll_down');
                                return;
                        }        
                };                   
                /**
                 *  display client contacts list
                 */
                self.display = function(){
                        try{
                                self.table_view.setData([]);
                                self.data = [];
                                var basic_query = 'SELECT * FROM my_client_contact WHERE status_code=1 and client_id='+_selected_client_id+' and id not in ('+_exist_client_contact_id_string+')';
                                var order_query = ' ORDER BY display_name ASC ';
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute(basic_query+order_query);
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var row = Ti.UI.createTableViewRow({
                                                        className:'client_contact_class_'+b,
                                                        filter_class:'client_contact_class',
                                                        title:rows.fieldByName('first_name')+' '+rows.fieldByName('last_name'),
                                                        client_contact_id:rows.fieldByName('id'),
                                                        client_id:rows.fieldByName('client_id'),
                                                        hasCheck:(rows.fieldByName('id') === _selected_client_contact_id)?true:false
                                                });
                                                self.data.push(row);
                                                rows.next();
                                                b++;
                                        }
                                }
                                rows.close();
                                db.close();
                                self.table_view.setData(self.data);                                
                                if(self.data.length > 0){
                                        self.no_result_label.visible = false;
                                }else{
                                        self.no_result_label.visible = true;
                                }
                                setTimeout(function(){
                                        self.hide_indicator();
                                },500);                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.display');
                                return;
                        }                                
                };
        
                //private member
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');                
                var _selected_client_contact_id = win.client_contact_id;
                var _selected_client_id = win.client_id;
                var _exist_client_contact_id_string = win.exist_client_contact_id_string;
        
                //private method
                function _init_bottom_bar(){
                        try{
                                var flexSpace = Titanium.UI.createButton({
                                        systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
                                });

                                self.add_client_btn_bar = Titanium.UI.createButtonBar({
                                        labels:['Add New Client Contact'],
                                        backgroundColor:'#336699'
                                });

                                var bottomToolBar = Ti.UI.iOS.createToolbar({
                                        items:[flexSpace,self.add_client_btn_bar],
                                        bottom:0,
                                        borderColor:self.tool_bar_color_in_ios_7,
                                        borderWidth:1,
                                        zIndex:100                                            
                                });
                                win.add(bottomToolBar);    
                                                  
                                self.add_client_btn_bar.addEventListener('click',function(e){
                                        var add_client_contact_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url','client_contact/edit_client_contact.js'),
                                                client_contact_id:0,
                                                client_id:_selected_client_id,
                                                action_for_client_contact:'add_client_contact',
                                                parent_source:'select_client_contact',
                                                parent_win:win
                                        });
                                        Titanium.UI.currentTab.open(add_client_contact_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_bottom_bar');
                                return;
                        }
                }
        }

        win.addEventListener('focus',function(e){
                try{                        
                        if(client_contact_select_client_contact_page_obj === null){
                                Ti.App.Properties.setBool('select_client_contact_'+win.source+'_view_flag',false); 
                                var F = function(){};
                                F.prototype = transaction_page.prototype;
                                client_contact_select_client_contact_page.prototype = new F();
                                client_contact_select_client_contact_page.prototype.constructor = client_contact_select_client_contact_page;
                                client_contact_select_client_contact_page_obj = new client_contact_select_client_contact_page();
                                client_contact_select_client_contact_page_obj.init();
                        }
                        client_contact_select_client_contact_page_obj.display();
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(e){
                try{
                        client_contact_select_client_contact_page_obj.close_window();
                        client_contact_select_client_contact_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }                        
        });
}());

