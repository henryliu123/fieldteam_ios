(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var action_push_notification_page_obj = null;

        function action_push_notification_page(){
                var self = this;
                var window_source = 'action_push_notification_page';

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                   
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Send','Main,Back');
                                _init_recipient_field();
                                _init_message_body_field();
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view('plain');
                                self.table_view.addEventListener('scroll',function(e){
                                        self.message_body_field.blur();
                                });                                 
                                _init_contacts();
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
                                var error_info = [];
                                var error_flag = false;
                                //check if fill push_notification
                                if((_push_notification_recipients.length===0)){
                                        error_info.push(L('message_select_staff'));
                                }else{
                                        for(var i=0,j=_push_notification_recipients.length;i<j;i++){
                                                if(_push_notification_recipients[i].source_id === 0){
                                                        error_flag = true;
                                                }      
                                        }
                                        if(error_flag){
                                                error_info.push(L('message_invalid_user_and_select_staff_push_notification'));
                                        }
                                }

                                //check subject
                                if(self.trim(_push_notification_body_message) === ''){
                                        error_info.push('Please enter message.');
                                }
                                if(error_info.length > 0){
                                        self.show_message(error_info.join('\n'));
                                        return;
                                }else{
                                        //save push_notification to database
                                        if(!Ti.Network.online){
                                                self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                                return;
                                        }else{
                                                var sender = 'N/A';
                                                var db = Titanium.Database.open(self.get_db_name());
                                                var rows = db.execute('SELECT * FROM my_manager_user WHERE id=?',_selected_user_id);
                                                if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                                        sender = rows.fieldByName('display_name');
                                                }
                                                rows.close();
                                                db.close();

                                                self.display_indicator('Sending Message ...',true);
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
                                                                                var temp_result = JSON.parse(this.responseText);
                                                                                self.update_selected_tables(null,self.ucfirst(_type)+'ContactHistory',temp_result);
                                                                                self.update_selected_tables(null,self.ucfirst(_type)+'ContactHistoryRecipient',temp_result);
                                                                                self.hide_indicator();
                                                                                win.close();
                                                                        }
                                                                }else{
                                                                        self.hide_indicator();
                                                                        var params = {
                                                                                message:'Send push notification failed.',
                                                                                show_message:true,
                                                                                message_title:'',
                                                                                send_error_email:true,
                                                                                error_message:'',
                                                                                error_source:window_source+' - self.nav_right_btn_click_event -xhr.onload - 1',
                                                                                server_response_message:this.responseText
                                                                        };
                                                                        self.processXYZ(params);
                                                                        return;
                                                                }
                                                        }catch(e){
                                                                self.hide_indicator();
                                                                params = {
                                                                        message:'Send push notification failed.',
                                                                        show_message:true,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:e,
                                                                        error_source:window_source+' - self.nav_right_btn_click_event -xhr.onload - 2',
                                                                        server_response_message:this.responseText
                                                                };
                                                                self.processXYZ(params);
                                                                return;
                                                        }
                                                };
                                                xhr.onerror = function(e){
                                                        self.hide_indicator();
                                                        var params = {
                                                                message:'Send push notification failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:e,
                                                                error_source:window_source+' - self.nav_right_btn_click_event -xhr.onerror',
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
                                                        'type':'action_send_push_notification',
                                                        'hash':_selected_user_id,
                                                        'company_id':_selected_company_id,
                                                        'manager_user_id':_selected_user_id,
                                                        'job_id':_selected_job_id,
                                                        'quote_id':_selected_job_id,
                                                        'contact_type_code':_selected_contact_type_code,//push_notification
                                                        'sender':sender,
                                                        'subject':'push notification',
                                                        'push_notification_recipients':JSON.stringify(_push_notification_recipients),
                                                        'message':self.trim(_push_notification_body_message),
                                                        'status_code':1,
                                                        'job_type':_type,
                                                        'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                        'app_version_increment':self.version_increment,
                                                        'app_version':self.version,
                                                        'app_platform':self.get_platform_info()
                                                });
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
                                var option_dialog = Ti.UI.createOptionDialog({
                                        options:(self.is_ipad())?['YES','NO','']:['YES','NO'],
                                        buttonNames:['Cancel'],
                                        destructive:0,
                                        cancel:1,
                                        title:L('message_quit_form_in_push_notification')
                                });
                                option_dialog.show();
                                option_dialog.addEventListener('click',function(evt){
                                        if(evt.index === 0){  
                                                if(e.index == self.default_main_menu_button_index){//menu menu
                                                        self.close_all_window_and_return_to_menu(); 
                                                }else{
                                                        win.close();
                                                }
                                        }else{
                                                self.nav_left_btn.index = -1;
                                        }
                                });                                                                    
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_left_btn_click_event');
                                return;
                        }                                                                           
                };       
                /**
                 * load recipients list
                 */
                self.load_recipients = function(){
                        try{
                                _remove_all_recipients();
                                var array = JSON.parse(Ti.App.Properties.getString('action_recipients_string'));
                                if(array.length > 0){
                                        for(var i=0,j=array.length;i<j;i++){
                                                _add_push_notification_item(array[i]);
                                        }
                                }                              
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.load_recipients');
                                return;
                        }
                };
                //private member
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _selected_job_id = win.job_id;
                var _selected_job_reference_number = win.job_reference_number;
                var _selected_contact_type_code = win.contact_type_code;
                var _type = win.type;
                var _push_notification_recipients = [];
                var _push_notification_body_message = '';

                //private method
                /**
                 * init recipient field
                 */
                function _init_recipient_field(){
                        try{
                                //push_notification to field
                                var row = Ti.UI.createTableViewRow({
                                        height:self.default_table_view_row_height,
                                        className:'set_to_recipients',
                                        selectedBackgroundColor:'#fff'
                                });
                                var container_view = Ti.UI.createView({
                                        height:self.default_table_view_row_height,
                                        width:self.screen_width
                                });
                                row.add(container_view);

                                var recipient_field_title = Ti.UI.createLabel({
                                        top:0,
                                        left:10,
                                        height:self.default_table_view_row_height,
                                        width:self.default_table_view_row_height,
                                        text:'To:',
                                        textAlign:'left',
                                        color:'#8F8888'
                                });
                                row.add(recipient_field_title);
                                var contacts_btn = Ti.UI.createButton({
                                        bottom:10,
                                        right:5,
                                        width:27,
                                        height:27,
                                        textAlign:'right',
                                        backgroundImage:self.get_file_path('image','addDefault.png')
                                });
                                row.add(contacts_btn);
                                self.data.push(row);

                                //add push_notification to list
                                row.addEventListener('click',function(e){
                                        _display_contacts_list();
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_recipient_field');
                                return;
                        }                                
                }
                /**
                 * init message body field
                 */
                function _init_message_body_field(){
                        try{
                                var order_ref = '';
                                var job_address = '';
                                var db = Titanium.Database.open(self.get_db_name());
                                var job_row = db.execute('SELECT * FROM my_'+_type+' WHERE id=?',_selected_job_id);
                                if((job_row.getRowCount() > 0) && (job_row.isValidRow())){
                                        if((job_row.fieldByName('order_reference') != undefined) && (job_row.fieldByName('order_reference') != null)){
                                                order_ref = self.trim(job_row.fieldByName('order_reference'));
                                                if(order_ref === ''){
                                                        order_ref = '(Blank)';
                                                }
                                        }
                                        var sub_number = job_row.fieldByName('sub_number');
                                        var unit = job_row.fieldByName('unit_number');
                                        if((unit === '')||(unit === null)){
                                                unit = '';
                                        }else{
                                                if((sub_number === '') || (sub_number === null)){
                                                        unit = unit+'/';
                                                }else{
                                                        unit = unit+'-'+sub_number+'/';
                                                }
                                        }

                                        var street_no = job_row.fieldByName('street_number');
                                        street_no = ((street_no === '')||(street_no === null))?'':street_no;

                                        var street_type = job_row.fieldByName('street_type');
                                        var street = (job_row.fieldByName('street') === null)?'':self.trim(job_row.fieldByName('street'));
                                        street = self.display_correct_street(street,street_type);
                                        //street = ((street === '')||(street === null))?'':' '+street+((street_type_id === 0)?'':' '+street_type);
                                        var suburb = job_row.fieldByName('suburb');
                                        suburb = (suburb === null)?'':suburb;
                                        
                                        var postcode = job_row.fieldByName('postcode');
                                        postcode = (postcode === null)?'':postcode;                                        
                                        if(street === ''){
                                                job_address = '(Blank)';
                                        }else{
                                                job_address = unit+street_no+' '+street+', '+suburb+(postcode === ''?'':' '+postcode);
                                        }                                
                                }
                                job_row.close();
                                db.close();   
                                _push_notification_body_message = 'Our '+self.ucfirst(_type)+' No. : '+_selected_job_reference_number+'   -  \nOrder Reference No. : '+order_ref+'  -  \nAddress : '+job_address;                                    
                                
                                //push_notification boday
                                var row2 = Ti.UI.createTableViewRow({
                                        className:'set_push_notification_message',
                                        height:'auto'
                                });
                                self.message_body_field = Ti.UI.createTextArea({
                                        left:10,
                                        right:10,
                                        height:self.screen_height,
                                        width:self.screen_width-20,
                                        borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        value:_push_notification_body_message,
                                        suppressReturn:false
                                });
                                if(self.is_ios_7_plus()){
                                        self.message_body_field.borderWidth=1;
                                        self.message_body_field.borderColor= '#ccc';
                                        self.message_body_field.borderRadius= 5;
                                }                                    
                                row2.add(self.message_body_field);
                                self.data.push(row2);
                                self.message_body_field.addEventListener('change',function(e){
                                        _push_notification_body_message = e.value;
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_message_body_field');
                                return;
                        }                                
                }
                /**
                 * display contact list
                 */
                function _display_contacts_list(){
                        try{
                                var client_contact_win = Titanium.UI.createWindow({
                                        title:'Contact List',
                                        url:self.get_file_path('url', 'action/contact_source/contact_list.js'),
                                        type:_type,
                                        source:'push',
                                        job_id:_selected_job_id,
                                        job_reference_number:_selected_job_reference_number,
                                        recipients:JSON.stringify(_push_notification_recipients)
                                });
                                Ti.UI.currentTab.open(client_contact_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_contacts_list');
                                return;
                        }                                
                }
                /**
                 *  remove all recipients,table view and create new table view
                 */
                function _remove_all_recipients(){
                        try{
                                _push_notification_recipients = [];
                                var recipient_row_view = (self.table_view.data[0].rows[0].children[0] != undefined)?self.table_view.data[0].rows[0].children[0]:null;
                                if((recipient_row_view.children != null) && (recipient_row_view.children != undefined)){
                                        for(var i=0,j=recipient_row_view.children.length;i<j;i++){
                                                if((recipient_row_view.children[i] != undefined) && (recipient_row_view.children[i] != null)){
                                                        recipient_row_view.remove(recipient_row_view.children[i]);
                                                }
                                        }
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _remove_all_recipients');
                                return;
                        }                                
                }
                /**
                 *  add push notification item
                 */
                function _add_push_notification_item(evt){
                        try{
                                var tmp_var = null;
                                var temp_str = evt.name;
                                var length = ((temp_str.length)*8 > (self.screen_width-20))?(self.screen_width-20):(temp_str.length)*8;
                                if(length <50){
                                        length = 50;
                                }
                                tmp_var = {
                                        level:0,
                                        length:length,
                                        content:evt.content,
                                        name:evt.name,
                                        source:evt.source,
                                        source_id:evt.source_id
                                };
                                _display_contact_item(tmp_var);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _add_push_notification_item');
                                return;
                        }                                
                }
                /**
                 *  display contact item
                 */
                function _display_contact_item(mail_obj){
                        try{
                                var temp_str = mail_obj.name;
                                var recipients_array = _push_notification_recipients;
                                var push_notification_row_obj = self.table_view.data[0].rows[0];
                                var push_notification_view_obj = push_notification_row_obj.children[0];
                                var left_distance = 0;
                                var level_number = 0;
                                if(recipients_array.length > 0){
                                        left_distance = recipients_array[recipients_array.length-1].left+recipients_array[recipients_array.length-1].length+15;
                                        level_number = recipients_array[recipients_array.length-1].level;
                                }
                                var button_length = ((temp_str.length*8)>40)?temp_str.length*8:40;
                                if(button_length > 100){
                                        button_length = 100;
                                }

                                if(level_number === 0){
                                        if((left_distance+button_length)>(self.screen_width-20)){
                                                left_distance = 10;
                                                level_number++;
                                                push_notification_row_obj.height = push_notification_view_obj.height =  (level_number+1)*40;
                                        }else{
                                                if(recipients_array.length === 0){
                                                        left_distance+=40;
                                                }
                                        }
                                }else{
                                        if((left_distance+button_length)>(self.screen_width-20)){
                                                left_distance = 10;
                                                level_number++;
                                                push_notification_row_obj.height = push_notification_view_obj.height = (level_number+1)*40;
                                        }
                                }

                                var new_button = Ti.UI.createButton({
                                        backgroundImage:'none',
                                        backgroundColor:'#496B9B',
                                        top:level_number*40+10,
                                        width:button_length,
                                        height:25,
                                        font:{
                                                fontSize:self.middle_font_size
                                        },
                                        title:temp_str,
                                        left:left_distance,
                                        borderRadius:10
                                });
                                push_notification_view_obj.add(new_button);
                                var tmp_var ={
                                        left:left_distance,
                                        level:level_number,
                                        length:button_length,
                                        content:mail_obj.content,
                                        name:mail_obj.name,
                                        source_id:mail_obj.source_id,
                                        source:mail_obj.source,
                                        contact:mail_obj.content
                                };
                                recipients_array.push(tmp_var);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_contact_item');
                                return;
                        }                                
                }
                /**
                 *  init contacts
                 */                   
                function _init_contacts(){
                        try{
                                var result = JSON.parse(win.recipients);
                                if((result === null)||(result === undefined)||(result === '')){
                                }else{
                                        for(var i=0,j=result.length;i<j;i++){
                                                var tmp_var = {
                                                        content:result[i].content,
                                                        name:result[i].name,
                                                        source:result[i].source,
                                                        source_id:result[i].source_id
                                                };
                                                _display_contact_item(tmp_var);
                                        }
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contacts');
                                return;
                        }
                }
        }

        win.addEventListener('focus',function(){
                try{
                        if(action_push_notification_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                action_push_notification_page.prototype = new F();
                                action_push_notification_page.prototype.constructor = action_push_notification_page;
                                action_push_notification_page_obj = new action_push_notification_page();
                                action_push_notification_page_obj.init();
                        }else{
                                if(Ti.App.Properties.getBool('load_recipients')){
                                        Ti.App.Properties.setBool('load_recipients',false);
                                        action_push_notification_page_obj.load_recipients();
                                }                                
                        }                         
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{                        
                        action_push_notification_page_obj.close_window(); 
                        action_push_notification_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());

