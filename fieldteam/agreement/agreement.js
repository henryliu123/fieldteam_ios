(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;    
        var agreement_page_obj = null;
        function agreement_page(){
                //set a object vars as temp object.
                //we have to use self in some events.
                var self = this;
                var window_source = 'agreement_page';
                win.title = 'Agreement';
                
                //public function
                /**
                 *  override init function of parent class: fieldteam.js
                 */                   
                self.init = function(){
                        try{        
                                self.init_auto_release_pool(win);
                                self.data = [];
                                _init_agreement_content_section();
                                _init_agreement_btn_section();       
                                /**
                                 *  call init_table_view function of parent class: fieldteam.js
                                 */    
                                self.init_table_view();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }
                };
                               
                //private function
                /**
                 *  init agreement content section
                 */
                function _init_agreement_content_section(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                var agreement_text = '';
                                var rows = db.execute('SELECT * FROM my_manager_user_agreement WHERE status_code=1 limit 1');
                                if(rows.getRowCount() > 0){
                                        if(rows.isValidRow()){
                                                agreement_text = rows.fieldByName('description');
                                        }
                                }
                                rows.close();
                                db.close();
                                var content_row = Ti.UI.createTableViewRow({
                                        height:'auto'
                                });
                                var content_label = Ti.UI.createLabel({
                                        width:(self.is_ipad())?self.screen_width-110:self.screen_width-40,
                                        height:'auto',
                                        text:agreement_text,
                                        top:10,
                                        bottom:10,
                                        textAlign:'left'
                                });
                                content_row.add(content_label);
                                self.data.push(content_row);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_agreement_content_section');
                                return;
                        }                                
                }
                /**
                 *  init agreeement button section
                 */
                function _init_agreement_btn_section(){
                        try{
                                var btn_row = Ti.UI.createTableViewRow({
                                        height:50
                                });
                                var no_btn = Ti.UI.createButton({
                                        title:'Do Not Agree',
                                        width:100,
                                        height:30,
                                        left:40,
                                        textAlign:'center'
                                });
                                btn_row.add(no_btn);
                                var yes_btn = Ti.UI.createButton({
                                        title:'Agree',
                                        width:100,
                                        height:30,
                                        right:40,
                                        textAlign:'center'
                                });
                                btn_row.add(yes_btn);
                                self.data.push(btn_row);
                                yes_btn.addEventListener('click',function(e){
                                        _yes_btn_click_event();
                                });
                                no_btn.addEventListener('click',function(){
                                        _no_btn_click_event();
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_agreement_btn_section');
                                return;
                        }
                }
                /**
                 *  yes button click event
                 */
                function _yes_btn_click_event(){
                        try{
                                win.close();
                                var _selected_login_user_id = Ti.App.Properties.getString('current_login_user_id');
                                if(Ti.Network.online){
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
                                                                if(this.responseText != '[]'){
                                                                        self.update_selected_tables(null,'ManagerUser',JSON.parse(this.responseText));
                                                                }
                                                        }else{
                                                                var params = {
                                                                        message:'Update agreement status failed.',
                                                                        show_message:true,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:'',
                                                                        error_source:window_source+' - _yes_btn_click_event - xhr.onload - 1',
                                                                        server_response_message:this.responseText
                                                                };
                                                                self.processXYZ(params);
                                                        }
                                                }catch(e){
                                                        params = {
                                                                message:'Update agreement status failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:e,
                                                                error_source:window_source+' - _yes_btn_click_event - xhr.onload - 2',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);
                                                        return;
                                                }
                                        };
                                        xhr.onerror = function(e){
                                                var params = {
                                                        message:'Update agreement status failed.',
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - _yes_btn_click_event - xhr.onerror',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params);
                                                return;
                                        };
                                        xhr.setTimeout(self.default_time_out);
                                        xhr.open('POST',self.get_host_url()+'update',false);                                        
                                        xhr.send({
                                                'type':'update_manager_user_agreement',
                                                'hash':_selected_login_user_id,
                                                'manager_user_id':_selected_login_user_id,
                                                'agreement':1,     
                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                'app_version_increment':self.version_increment,
                                                'app_version':self.version,
                                                'app_platform':self.get_platform_info()                                                
                                        });
                                }else{
                                        var db = Titanium.Database.open(self.get_db_name());
                                        db.execute('UPDATE my_manager_user SET agreement=1 WHERE id=?',_selected_login_user_id);
                                        db.close();
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _yes_btn_click_event');
                                return;
                        }                        
                }
                /**
                 *  no button click event
                 */
                function _no_btn_click_event(){
                        try{
                                self.show_message(L('message_click_no_button'));  
                                return;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _no_btn_click_event');
                                return;
                        }                        
                }
        }

        win.addEventListener('focus',function(){
                try{
                        if(agreement_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                agreement_page.prototype = new F();
                                agreement_page.prototype.constructor = agreement_page;
                                agreement_page_obj = new agreement_page();
                                agreement_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        agreement_page_obj.close_window();
                        agreement_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());
