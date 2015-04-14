/**
 *  Function List:
 *  1. Display Client List
 *  2. More Client Button for display more clients
 *  3. Download More Client button for downloading more clients from server
 *  4. Add Client Button
 *  5. Click any client and enter client edit page
 *  6. Search bar
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'transaction.js');
        var win = Titanium.UI.currentWindow;
        var client_contact_list_page_obj = null;

        function client_contact_list_page(){
                var self = this;
                var window_source = 'client_contact_list_page';
                win.title = 'Client Contact List';

                //public member 
                self.pull_down_to_update = false;
                self.pull_down_to_download_more = true; 

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                      
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Add','Main,Back');
                                //self.init_controls();
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
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
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                      
                self.nav_right_btn_click_event = function(e){
                        try{
                                var add_client_contact_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','client_contact/edit_client_contact.js'),
                                        client_id:_client_id,
                                        client_contact_id:0,
                                        action_for_client_contact:'add_client_contact',
                                        parent_source:'client_contact_list',
                                        parent_win:win
                                });
                                Titanium.UI.currentTab.open(add_client_contact_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });         
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }                                
                };               
                /**
                 *  override table_view_click_event function of parent class: fieldteam.js
                 */                      
                self.table_view_click_event = function(e){
                        try{
                                var edit_client_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','client_contact/edit_client_contact.js'),
                                        client_id:e.row.client_id,
                                        client_contact_id:e.row.client_contact_id,
                                        action_for_client_contact:'edit_client_contact',
                                        parent_source:'client_contact_list',
                                        parent_win:win
                                });
                                Titanium.UI.currentTab.open(edit_client_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });                                
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
                                                                        error_source:window_source+' - self.begin_download_more_jobs_by_scroll_down - xhr.onload - 1',
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
                                                                error_source:window_source+' - self.begin_download_more_jobs_by_scroll_down - xhr.onload - 2',
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
                                                'client_id':_client_id,
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
                 *  display client contact list
                 */
                self.display = function(){
                        try{
                                self.data = [];
                                self.table_view.setData([]);
                                var basic_query = 'SELECT * FROM my_client_contact WHERE status_code=1 and client_id='+_client_id;
                                var order_query = ' ORDER BY display_name ASC ';
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute(basic_query+order_query);
                                var rowCount = rows.getRowCount();
                                if(rowCount > 0){
                                        self.no_result_label.visible = false;
                                }else{
                                        self.no_result_label.visible = true;
                                }
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var row = Ti.UI.createTableViewRow({
                                                        className:'client_contact_class_'+b,
                                                        filter_class:'client_contact_class',
                                                        title:rows.fieldByName('first_name')+' '+rows.fieldByName('last_name'),
                                                        client_contact_id:rows.fieldByName('id'),
                                                        client_id:rows.fieldByName('client_id'),
                                                        hasChild:true
                                                });
                                                self.data.push(row);
                                                self.table_view.appendRow(row);
                                                rows.next();
                                                b++;
                                        }
                                }
                                rows.close();
                                db.close();
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
                var _client_id = win.client_id;

        }

        win.addEventListener('focus',function(){
                try{
                        if(client_contact_list_page_obj === null){
                                var F = function(){};
                                F.prototype = transaction_page.prototype;
                                client_contact_list_page.prototype = new F();
                                client_contact_list_page.prototype.constructor = client_contact_list_page;
                                client_contact_list_page_obj = new client_contact_list_page();
                                client_contact_list_page_obj.init();
                        }
                        client_contact_list_page_obj.display();
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        client_contact_list_page_obj.close_window();
                        client_contact_list_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }                
        });
}());

