(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Ti.UI.currentWindow;
        var action_sms2_page_obj = null;

        function action_sms2_page(){
                var self = this;
                var window_source = 'action_sms2_page';
                win.title = 'SMS';                
                
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
                                _init_contacts();
                                self.table_view.addEventListener('scroll',function(e){
                                        if(_is_sms_to_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_sms_content_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                });                                   
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
                                if(_selected_recipient_row_class_name != ''){
                                        switch(_selected_recipient_row_class_name){
                                                case 'set_to_recipients':
                                                        _sms_textfield_blur_event(self.sms_to_text_field,'to');
                                                        break;                                                
                                        }
                                        setTimeout(function(){
                                                _display_error_info();
                                                if(self.error_info.length <= 0){
                                                        //save sms to database
                                                        if(!Ti.Network.online){
                                                                self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                                                return;
                                                        }else{
                                                                _save_sms_info_to_server();
                                                        }
                                                }                                        
                                        },500);
                                }else{                                
                                        _display_error_info();
                                        if(self.error_info.length <= 0){
                                                //save sms to database
                                                if(!Ti.Network.online){
                                                        self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                                        return;
                                                }else{
                                                        _save_sms_info_to_server();
                                                }
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
                                        title:L('message_action_sms_quit_sms_form')
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
                 *  override table_view_click_event  function of parent class: fieldteam.js
                 */           
                self.table_view_click_event= function(e){
                        try{
                                if((e.source.filterClass == 'row')||(e.source.filterClass == 'invalid')){
                                        return;
                                }
                                if((e.source.filterClass == 'subject')||(e.source.filterClass == 'body')){
                                        switch(_selected_recipient_row_class_name){
                                                case 'set_to_recipients':
                                                        _sms_textfield_blur_event(self.sms_to_text_field,'to');
                                                        break;
                                        }                                        
                                        _update_rows_label(e);
                                        return;
                                }
                                
                                if((_selected_recipient_row_class_name != e.row.className)){
                                        switch(_selected_recipient_row_class_name){
                                                case 'set_to_recipients':
                                                        _sms_textfield_blur_event(self.sms_to_text_field,'to');
                                                        break;
                                        }                                                    
                                        _update_rows_label(e);                                     
                                }
                                _selected_recipient_row_class_name = e.row.className;  
                                switch(e.row.className){
                                        case 'set_to_recipients':
                                                for(var i=0,j=_sms_recipients.length;i<j;i++){
                                                        _sms_recipients[i].visible = true;
                                                        if(_selected_label_object == _sms_recipients[i]){
                                                                _sms_recipients[i].backgroundColor = _label_field_selected_backgroundColor;
                                                        }else{
                                                                _sms_recipients[i].backgroundColor = _label_field_backgroundColor;
                                                        }
                                                }                                                      
                                                self.sms_to_cover_label.visible = false;                                          
                                                self.sms_to_text_field.visible = true;  
                                                self.sms_to_text_field.value = ' ';                                                 
                                                break;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }                                
                };                  
                /**
                 * load recipients list
                 */
                self.load_recipients = function(){
                        try{
                                var array = JSON.parse(Ti.App.Properties.getString('action_recipients_string'));
                                Ti.API.info('array:'+array);
                                if(array.length > 0){
                                        for(var i=0,j=array.length;i<j;i++){
                                                _update_recipient_by_selected_recipients(array[i]);
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
                var _sms_recipients = [];
                var _message_body_string = '\n\nSent from my iPhone ';
                var _default_left_margin = 40;
                var _default_right_margin = 35;
                var _default_receipt_title_left_margin = 8;
                var _selected_recipient_row_class_name = 'set_to_recipients';
                var _recipient_to_level = 1;
                var _recipient_text_fields_empty = 0;//this is a flag for ensure that delete the first space of text field or not
                var _recipient_text_fields_delete = 0;//this is a flag for ensure that delete sms label
                var _recipient_selected_type = 'to';//selected recipient type, to,cc,or bcc
                var _recipient_selected_element = null;
                var _recipient_selected_element_index = -1;
                var _minimum_space_for_text_field = 30;//if less than this value, then text field will jump to new line.
                var _label_field_backgroundColor = '#496B9B';
                var _label_field_selected_backgroundColor = "blue";
                var _selected_label_object = null;
                var _gap_between_labels = 10;
                var _attachments = [];
                var _single_letter_width = 1.25; //this number is figured out with size/height/count of word
                var _selected_field_object = null;  
                var _is_sms_to_field_focused = false;    
                var _is_sms_content_field_focused = false;     
                //private method
                /**
                 *  init contacts
                 */
                function _init_contacts(){
                        try{
                                var array = JSON.parse(win.recipients);
                                if(array.length > 0){
                                        for(var i=0,j=array.length;i<j;i++){
                                                _update_recipient_by_selected_recipients(array[i]);
                                        }                                        
                                }   
                                self.sms_to_cover_label.fireEvent('click');
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_contacts');
                                return;
                        }
                }                
                /**
                 * init recipient field
                 */
                function _init_recipient_field(){
                        try{
                                //sms to field
                                self.to_row = Ti.UI.createTableViewRow({           
                                        filterClass:'row',
                                        height:self.default_table_view_row_height,
                                        className:'set_to_recipients',
                                        selectedBackgroundColor:'#fff'
                                });
                                var sms_to_field_title = Ti.UI.createLabel({
                                        filterClass:'invalid',
                                        top:0,
                                        left:_default_receipt_title_left_margin,
                                        height:self.default_table_view_row_height,
                                        width:self.default_table_view_row_height,
                                        text:'To:',
                                        textAlign:'left',
                                        color:'#8F8888'
                                });
                                self.to_row.add(sms_to_field_title);
                                self.sms_to_fake_text_field = Ti.UI.createTextField({
                                        top:0,
                                        height:'auto',
                                        width:'auto',
                                        value:'  ',
                                        visible:false,
                                        keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION
                                });
                                self.to_row.add(self.sms_to_fake_text_field);                                  
                                self.sms_to_text_field = Ti.UI.createTextField({
                                        filterClass:'textfield',
                                        top:self.default_table_view_row_height/4,
                                        left:_default_left_margin,
                                        height:self.default_table_view_row_height/2,
                                        width:self.screen_width-_default_left_margin-_default_right_margin,
                                        value:' ',
                                        textAlign:'left',
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION 
                                });
                                self.to_row.add(self.sms_to_text_field);         
                                var sms_to_button = Ti.UI.createButton({
                                        bottom:10,
                                        right:3,
                                        width:27,
                                        height:27,
                                        textAlign:'right',
                                        backgroundImage:self.get_file_path('image','addDefault.png')
                                });
                                self.to_row.add(sms_to_button);
                                
                                self.sms_to_cover_label = Ti.UI.createLabel({
                                        top:1,
                                        filterClass:'cover',
                                        height:self.default_table_view_row_height-1,
                                        left:_default_left_margin,
                                        width: self.screen_width-_default_left_margin,
                                        visible:true,
                                        text:'',
                                        backgroundColor:'#fff',
                                        zIndex:100
                                });
                                self.to_row.add(self.sms_to_cover_label);
                                
                                self.data.push(self.to_row );   
                                
                                self.sms_to_cover_label.addEventListener('click',function(e){
                                        switch(_selected_recipient_row_class_name){
                                                case 'set_to_recipients':
                                                        _sms_textfield_blur_event(self.sms_to_text_field,'to');
                                                        break;
                                        }                                              
                                        self.sms_to_cover_label.visible = false;
                                        _refresh_selected_row_labels('to');
                                });
                                                                
                                sms_to_button.addEventListener('click',function(e){
                                        _recipient_selected_type = 'to';
                                        _display_contacts_list();                                            
                                });
                                
                                self.sms_to_text_field.addEventListener('return',function(e){
                                        if(self.trim(e.value) == ''){
                                                return;
                                        }
                                        _recipient_selected_type = 'to';
                                        _sms_textfield_return_event(e,_recipient_selected_type);
                                }); 
                                self.sms_to_text_field.addEventListener('focus',function(e){
                                        _is_sms_to_field_focused = true;
                                        _selected_field_object = e.source;
                                        _recipient_selected_type = 'to';
                                        _selected_recipient_row_class_name = self.to_row.className;
                                        if(_selected_label_object != null){
                                                _selected_label_object.backgroundColor = _label_field_backgroundColor;
                                                _selected_label_object = null;
                                        }
                                }); 
                                self.sms_to_text_field.addEventListener('blur',function(e){  
                                        _is_sms_to_field_focused = false;
                                        _selected_field_object = null;                                        
                                });                                
                                self.sms_to_text_field.addEventListener('change',function(e){
                                        _recipient_selected_type = 'to';
                                        _sms_textfield_change_event(e,_recipient_selected_type);
                                });
                                self.sms_to_fake_text_field.addEventListener('change',function(e){
                                        _recipient_selected_type = 'to';
                                        _sms_fake_textfield_change_event(e,_recipient_selected_type);
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
                                _message_body_string = 'Our '+self.ucfirst(_type)+' No. : '+_selected_job_reference_number+'   - \nOrder Reference No. : '+order_ref+'  -  \nAddress : '+job_address;

                                
                                //sms body
                                var row2 = Ti.UI.createTableViewRow({
                                        filterClass:'row',
                                        className:'set_sms_message',
                                        selectedBackgroundColor:'#fff',
                                        height:'auto'
                                });
                                self.message_body_field = Ti.UI.createTextArea({
                                        filterClass:'body',
                                        left:10,
                                        right:10,
                                        height:self.screen_height-1*self.default_table_view_row_height,
                                        width:self.screen_width-20,
                                        borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        value:_message_body_string,
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
                                        _message_body_string = e.value;
                                });
                                self.message_body_field.addEventListener('focus',function(e){         
                                        _is_sms_content_field_focused = true;
                                        _selected_field_object = e.source;                                             
                                        switch(_selected_recipient_row_class_name){
                                                case 'set_to_recipients':
                                                        _sms_textfield_blur_event(self.sms_to_text_field,'to');
                                                        break;
                                        }                                                   
                                        _update_rows_label(e);
                                        _selected_recipient_row_class_name = '';
                                }); 
                                self.message_body_field.addEventListener('blur',function(e){  
                                        _is_sms_content_field_focused = false;
                                        _selected_field_object = null;                                        
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_message_body_field');
                                return;
                        }                        
                }
                /**
                 *  remove all recipients,table view and create new table view
                 */                 
                function _remove_all_recipients(source_type){
                        try{
                                if(_sms_recipients.length > 0){
                                        _sms_recipients = [];
                                        for(var i=self.to_row.children.length-1,j=0;i>=j;i--){
                                                if((self.to_row.children[i] != undefined) && (self.to_row.children[i] != null)){
                                                        self.to_row.remove(self.to_row.children[i]);
                                                }
                                        }                                       
                                }  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _remove_all_recipients');
                                return;
                        }                                
                }                
                /**
                 * display contacts list
                 */
                function _display_contacts_list(){
                        try{
                                var client_contact_win = Titanium.UI.createWindow({
                                        url:self.get_file_path('url', 'action/contact_source/contact_list.js'),
                                        type:_type,
                                        source:'sms',
                                        job_id:_selected_job_id,
                                        job_reference_number:_selected_job_reference_number,
                                        recipients:JSON.stringify([])
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
                 *  check and display error info when click send button
                 */
                function _display_error_info(){
                        try{
                                self.error_info = [];
                                var error_sms= [];
                                var invalid_contact_id_array = [];
                                //check if fill sms
                                if((_sms_recipients.length===0)){
                                        self.error_info.push('Please enter phone number.');
                                }else{
                                        if(_sms_recipients.length > 0){
                                                for(var i=0,j=_sms_recipients.length;i<j;i++){
                                                        if(!self.check_valid_phone_number(_sms_recipients[i].content)){
                                                                error_sms.push(_sms_recipients[i].name);
                                                        }
                                                        if(_sms_recipients[i].source_id > 1000000000){
                                                                invalid_contact_id_array.push(_sms_recipients[i].name);
                                                        }
                                                }
                                        }
                                        if(error_sms.length > 0){
                                                self.error_info.push('The following are invalid phone number:');
                                                for(i=0,j=error_sms.length;i<j;i++){
                                                        self.error_info.push(error_sms[i]);
                                                }
                                                if(self.error_info.length > 0){
                                                        self.show_message(self.error_info.join('\n'));
                                                        return;
                                                }
                                        }
                                        if(invalid_contact_id_array.length > 0){
                                                self.error_info.push(L('message_action_sms_failure_to_send')+':');
                                                for(i=0,j=invalid_contact_id_array.length;i<j;i++){
                                                        self.error_info.push(invalid_contact_id_array[i]);
                                                }
                                                if(self.error_info.length > 0){
                                                        self.show_message(self.error_info.join('\n'));
                                                        return;
                                                }
                                        }
                                }

                                //check subject
                                if(self.error_info.length > 0){
                                        self.show_message(self.error_info.join('\n'));
                                        return;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_error_info');
                                return;
                        }
                }
                /**
                 *  save send sms info to server database and send sms by server.
                 */
                function _save_sms_info_to_server(){
                        try{
                                var sender = 'N/A';
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_manager_user WHERE id=?',_selected_user_id);
                                if(rows.getRowCount() > 0){
                                        if(rows.isValidRow()){
                                                sender = rows.fieldByName('phone_mobile');
                                        }
                                }
                                rows.close();
                                db.close();
                                if((sender === 'N/A')||(sender === null)||(sender === '')){
                                        self.show_message(L('message_set_sms_in_account_setting_in_sms'));
                                        return;
                                }else{
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
                                                                }
                                                                self.hide_indicator();
                                                                win.close(); 
                                                        }else{
                                                                self.hide_indicator();
                                                                var params = {
                                                                        message:'Sending sns failed.',
                                                                        show_message:true,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:'',
                                                                        error_source:window_source+' - _save_sms_info_to_server - xhr.onload - 1',
                                                                        server_response_message:this.responseText
                                                                };
                                                                self.processXYZ(params);
                                                                return;
                                                        }
                                                }catch(e){
                                                        self.hide_indicator();
                                                        params = {
                                                                message:'Sending sms failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:e,
                                                                error_source:window_source+' - _save_sms_info_to_server - xhr.onload - 2',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);
                                                        return;
                                                }
                                        };
                                        xhr.onerror = function(e){
                                                self.hide_indicator();
                                                var params = {
                                                        message:'Sending sms failed.',
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - _save_sms_info_to_server - xhr.onerror',
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
                                                'type':'action_send_sms',
                                                'hash':_selected_user_id,
                                                'company_id':_selected_company_id,
                                                'manager_user_id':_selected_user_id,
                                                'job_id':_selected_job_id,
                                                'quote_id':_selected_job_id,
                                                'contact_type_code':_selected_contact_type_code,//sms
                                                'sender':sender,
                                                'subject':'sms',
                                                'sms_recipients':JSON.stringify(_sms_recipients),
                                                'message':self.trim(_message_body_string),
                                                'status_code':1,
                                                'job_type':_type,
                                                'attachments':JSON.stringify(_attachments),
                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                'app_version_increment':self.version_increment,
                                                'app_version':self.version,
                                                'app_platform':self.get_platform_info()
                                        });
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _save_sms_info_to_server');
                                return;
                        }
                }          
                /**
                 *  return event when click "return" button
                 */
                function _sms_textfield_blur_event(e,recipient_type){
                        try{
                                if(self.trim(e.value) == ''){//if enter empty value
                                        return;
                                }
                                //create label object
                                var new_label = Ti.UI.createLabel({
                                        source:'manual',//source type, manual input or select from list
                                        source_id:0,//contact id
                                        content:self.remove_all_character_and_symbol_except_number(e.value),
                                        contact:self.trim(e.value),
                                        name:self.trim(e.value),
                                        filterClass:'label',
                                        level:1,
                                        width:'auto',
                                        height:self.default_table_view_row_height/2,
                                        text:self.trim(e.value),
                                        backgroundColor:_label_field_backgroundColor,
                                        borderRadius:8,
                                        left:e.left,
                                        right:0,
                                        textAlign:'center',
                                        font:{
                                                fontSize:self.middle_font_size
                                        },
                                        color:'#fff'
                                });
                                if(new_label.toImage().size > 0){
                                        new_label.width = new_label.toImage().size/(self.default_table_view_row_height/2);   
                                        var temp_trim_string = self.trim(e.value);
                                        new_label.width += (temp_trim_string.length+8)*_single_letter_width;                                
                                        if(new_label.width < _minimum_space_for_text_field){
                                                new_label.width = _minimum_space_for_text_field;
                                        }                              
                                }else{
                                        new_label.width = _minimum_space_for_text_field;
                                }

                                new_label.addEventListener('click',function(evt){
                                        switch(recipient_type){
                                                case 'to':
                                                        _selected_recipient_row_class_name = 'set_to_recipients';
                                                        break;
                                        }                                                                
                                        _recipient_selected_type = recipient_type;
                                        _label_click_event(evt,recipient_type);
                                });
                                //add label to row 
                                switch(recipient_type){
                                        case 'to':
                                                self.to_row.add(new_label);
                                                break;
                                }      
                                _create_label_element(new_label,e,recipient_type);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _sms_textfield_blur_event');
                                return;
                        }
                }                     
                /**
                 *  return event when click "return" button
                 */
                function _sms_textfield_return_event(e,recipient_type){
                        try{
                                if(e.source.value == ''){//if enter empty value
                                        return;
                                }
                                //create label object
                                var new_label = Ti.UI.createLabel({
                                        source:'manual',//source type, manual input or select from list
                                        source_id:0,//contact id
                                        content:self.remove_all_character_and_symbol_except_number(e.value),
                                        contact:self.trim(e.value),
                                        name:self.trim(e.value),
                                        filterClass:'label',
                                        level:1,
                                        width:'auto',
                                        height:self.default_table_view_row_height/2,
                                        text:self.trim(e.value),
                                        backgroundColor:_label_field_backgroundColor,
                                        borderRadius:8,
                                        left:e.source.left,
                                        right:0,
                                        textAlign:'center',
                                        font:{
                                                fontSize:self.middle_font_size
                                        },
                                        color:'#fff'
                                });
                                if(new_label.toImage().size > 0){
                                        new_label.width = new_label.toImage().size/(self.default_table_view_row_height/2);   
                                        var temp_trim_string = self.trim(e.value);
                                        new_label.width += (temp_trim_string.length+8)*_single_letter_width;                                
                                        if(new_label.width < _minimum_space_for_text_field){
                                                new_label.width = _minimum_space_for_text_field;
                                        }                              
                                }else{
                                        new_label.width = _minimum_space_for_text_field;
                                }                        
                                new_label.addEventListener('click',function(evt){
                                        switch(recipient_type){
                                                case 'to':
                                                        _selected_recipient_row_class_name = 'set_to_recipients';
                                                        break;
                                        }                                                                
                                        _recipient_selected_type = recipient_type;
                                        _label_click_event(evt,recipient_type);
                                });
                                //add label to row 
                                switch(recipient_type){
                                        case 'to':
                                                self.to_row.add(new_label);
                                                break;
                                }
                                        
                                _create_label_element(new_label,e.source,recipient_type);       
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _sms_textfield_return_event');
                                return;
                        }
                }            
                
                /**
                 *  click event when click "textfield"
                 */                
                function _sms_textfield_click_event(e,recipient_type){
                        try{
                                //reset some variables to default value
                                e.source.visible = true;
                                e.source.value =' ';
                                _recipient_text_fields_empty = 0;
                                _recipient_text_fields_delete = 0;  
                                _recipient_selected_element = null;
                                _recipient_selected_element_index = -1;                        
                                switch(recipient_type){
                                        case 'to':
                                                for(var i =0,j=_sms_recipients.length;i<j;i++){
                                                        _sms_recipients[i].backgroundColor = _label_field_backgroundColor;
                                                        _sms_recipients[i].visible = true;
                                                }                                                
                                                break;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _sms_textfield_click_event');
                                return;
                        }
                }
                
                /**
                 *  change event when change textfield's value
                 */                  
                function _sms_textfield_change_event(e,recipient_type){
                        try{
                                switch(recipient_type){
                                        case 'to':
                                                if(_sms_recipients.length > 0){
                                                        if(e.value == ''){
                                                                _recipient_text_fields_empty = 1;
                                                                e.source.visible = false;
                                                                self.sms_to_fake_text_field.value = '  ';
                                                                self.sms_to_fake_text_field.focus();
                                                        }
                                                }   
                                                break;
                                }            
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _sms_textfield_change_event');
                                return;
                        }
                }          
                /**
                 *  change event when change textfield's value
                 */                 
                function _sms_fake_textfield_change_event(e,recipient_type){
                        try{
                                switch(recipient_type){
                                        case 'to':
                                                _sms_fake_to_textfield_change_event(e,recipient_type);
                                                break;
                                }   
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _sms_fake_textfield_change_event');
                                return;
                        }
                }
                function _sms_fake_to_textfield_change_event(e,recipient_type){
                        try{
                                if(_recipient_text_fields_empty){
                                        if(_recipient_text_fields_delete){                                                       
                                                //get last second element
                                                if(_recipient_selected_element != null){
                                                        _recipient_selected_element.setVisible(false);
                                                        self.to_row.remove(_recipient_selected_element);    
                                                        _sms_recipients.splice(_recipient_selected_element_index,1);  
                                                        _refresh_selected_row_labels(recipient_type);
                                                }else{
                                                        if(self.sms_to_text_field.left == _default_left_margin){// equal left margin, should check level-1's right margin'
                                                                if(_sms_recipients.length > 1){
                                                                        if((_sms_recipients[_sms_recipients.length-2].right-10-_minimum_space_for_text_field) > _default_right_margin){//still exist enough space on level-1, then back to level-1
                                                                                self.sms_to_text_field.left = _sms_recipients[_sms_recipients.length-1].left;
                                                                                self.sms_to_text_field.top = _sms_recipients[_sms_recipients.length-2].top;
                                                                                _recipient_to_level = _sms_recipients[_sms_recipients.length-2].level;
                                                                        }else{
                                                                                self.sms_to_text_field.left = _sms_recipients[_sms_recipients.length-1].left;
                                                                                self.sms_to_text_field.top = _sms_recipients[_sms_recipients.length-1].top;
                                                                                _recipient_to_level = _sms_recipients[_sms_recipients.length-1].level;                                                                                
                                                                        }
                                                                }else{
                                                                        self.sms_to_text_field.left = _sms_recipients[_sms_recipients.length-1].left;
                                                                        self.sms_to_text_field.top = _sms_recipients[_sms_recipients.length-1].top;
                                                                        _recipient_to_level = _sms_recipients[_sms_recipients.length-1].level;                                                                                
                                                                }
                                                                self.to_row.height = self.default_table_view_row_height+(self.default_table_view_row_height*0.75*(_recipient_to_level-1));                                                                                                                                        
                                                        }else{
                                                                self.sms_to_text_field.left = _sms_recipients[_sms_recipients.length-1].left;
                                                                self.sms_to_text_field.top = _sms_recipients[_sms_recipients.length-1].top;
                                                                _recipient_to_level = _sms_recipients[_sms_recipients.length-1].level;                                                            
                                                                self.to_row.height = self.default_table_view_row_height+(self.default_table_view_row_height*0.75*(_recipient_to_level-1));                                                                  
                                                        }
                                                        var used_length = 0;
                                                        for(var i =0,j=_sms_recipients.length-1;i<j;i++){
                                                                if(_sms_recipients[i].level == _recipient_to_level){
                                                                        used_length += _sms_recipients[i].size.width+_gap_between_labels;
                                                                }
                                                        }
                                                        //figure out width
                                                        self.sms_to_text_field.width = self.screen_width-_default_left_margin-_default_right_margin-used_length;     
                                                        _sms_recipients[_sms_recipients.length-1].setVisible(false);
                                                        self.to_row.remove(_sms_recipients[_sms_recipients.length-1]);    
                                                        _sms_recipients.pop(); 
                                                        _recipient_text_fields_delete = 0;
                                                        self.sms_to_text_field.visible =true;
                                                        self.sms_to_text_field.value = ' ';
                                                        self.sms_to_text_field.focus();
                                                }
                                        }else{
                                                if(e.value == ' '){
                                                        _recipient_text_fields_delete = 1;
                                                        if(_recipient_selected_element == null){
                                                                if(_sms_recipients.length > 0){
                                                                        _sms_recipients[_sms_recipients.length-1].backgroundColor = _label_field_selected_backgroundColor;
                                                                }
                                                        }
                                                }
                                        }                                               
                                }      
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _sms_fake_to_textfield_change_event');
                                return;
                        }
                }                      
                /**
                 * label's click event
                 */
                function _label_click_event(e,recipient_type){
                        try{
                                var selected_element_num = -1;
                                switch(recipient_type){
                                        case 'to':
                                                _selected_label_object = e.source;
                                                for(var i =0,j=_sms_recipients.length;i<j;i++){
                                                        if(e.source == _sms_recipients[i]){
                                                                selected_element_num = i;
                                                                e.source.backgroundColor = _label_field_selected_backgroundColor;
                                                                _recipient_text_fields_delete = 1;
                                                                _recipient_text_fields_empty = 1;  
                                                                _recipient_selected_element = _sms_recipients[selected_element_num];
                                                                _recipient_selected_element_index = selected_element_num;
                                                                self.sms_to_text_field.visible = false;
                                                                self.sms_to_fake_text_field.value = ' ';
                                                                setTimeout(function(){
                                                                        self.sms_to_fake_text_field.focus(); 
                                                                },500);                                                                                                                                                                                                                       
                                                        }else{
                                                                _sms_recipients[i].backgroundColor = _label_field_backgroundColor;
                                                        }
                                                }
                                                if(selected_element_num != -1){                                                
                                                        Ti.API.info('selected_element_num:'+selected_element_num);                                                                                               
                                                }else{
                                                        if(_recipient_text_fields_empty){
                                                                self.sms_to_text_field.visible = true;
                                                                self.sms_to_text_field.value =' ';
                                                                _recipient_text_fields_empty = 0;
                                                                _recipient_text_fields_delete = 0;
                                                                _recipient_selected_element = null;
                                                                _recipient_selected_element_index = -1;
                                                        }
                                                }                                        
                                                break;                                
                                }                         
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _label_click_event');
                                return;
                        }
                }                
                /**
                 * create new label for recipients that was selected from contact list 
                 */
                function _create_label_element(new_label,textfield_object,recipient_type){
                        try{
                                //we have to set a timeout for getting label's width and height               
                                var used_length = 0;
                                var last_element_width = 0;
                                var temp_level_number = 0;
                                //if text width less than label width, then add label to new level while update row's height'
                                if(textfield_object.width < new_label.width){
                                        switch(recipient_type){
                                                case 'to':
                                                        _recipient_to_level++;
                                                        self.to_row.height = self.default_table_view_row_height+(self.default_table_view_row_height*0.75*(_recipient_to_level-1));
                                                        break;
                                        }
                                }
                                //set level number
                                switch(recipient_type){
                                        case 'to':
                                                temp_level_number = new_label.level = _recipient_to_level;
                                                new_label.top = self.default_table_view_row_height/4+(self.default_table_view_row_height*0.75*(_recipient_to_level-1));
                                                if(new_label.width > (self.screen_width-_default_left_margin-_default_right_margin)){
                                                        new_label.left = _default_left_margin;
                                                        new_label.width = self.screen_width-_default_left_margin-_default_right_margin;
                                                        new_label.right = self.screen_width-new_label.left-new_label.width;
                                                }else{
                                                        if(textfield_object.width < new_label.width){
                                                                new_label.left = _default_left_margin;
                                                        }else{
                                                                new_label.left = textfield_object.left;
                                                        }
                                                        new_label.width = new_label.size.width;
                                                        new_label.right = self.screen_width-new_label.left-new_label.width;
                                                }                                                 
                                                break;
                                        
                                }                                                
                                                                                       
                                switch(recipient_type){
                                        case 'to':
                                                _sms_recipients.push(new_label);
                                                for(var i =0,j=_sms_recipients.length;i<j;i++){
                                                        if(i == _sms_recipients.length-1){
                                                                last_element_width = _sms_recipients[i].width;
                                                        }
                                                        if(_sms_recipients[i].level == _recipient_to_level){
                                                                used_length += _sms_recipients[i].size.width+_gap_between_labels;
                                                        }
                                                } 
                                                textfield_object.visible = false;
                                                if(textfield_object.width < last_element_width){                                                          
                                                        textfield_object.top =  self.default_table_view_row_height/4+(self.default_table_view_row_height*0.75*(temp_level_number-1));
                                                        textfield_object.width = self.screen_width-_default_left_margin-_default_right_margin-last_element_width-_gap_between_labels;
                                                        textfield_object.left = _default_left_margin+last_element_width+_gap_between_labels;
                                                }else{
                                                        textfield_object.width = self.screen_width-_default_left_margin-_default_right_margin-used_length;
                                                        textfield_object.left = _default_left_margin+used_length;                                                          
                                                }                                                
                                                break;
                                        
                                }                                                   


                                //if textfield's width less than minimum space withd, then add level number'
                                if(textfield_object.width < _minimum_space_for_text_field){
                                        switch(recipient_type){
                                                case 'to':
                                                        _recipient_to_level++;
                                                        temp_level_number = _recipient_to_level;
                                                        self.to_row.height = self.default_table_view_row_height+(self.default_table_view_row_height*0.75*(temp_level_number-1));
                                                        textfield_object.top =  self.default_table_view_row_height/4+(self.default_table_view_row_height*0.75*(temp_level_number-1));
                                                        textfield_object.width = self.screen_width-_default_left_margin-_default_right_margin;
                                                        textfield_object.left = _default_left_margin;                                                        
                                                        break;
                                                
                                        }                                                                                                                                                          

                                }
                                textfield_object.visible = true;
                                textfield_object.value = ' ';
                                textfield_object.focus();         
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _create_label_element');
                                return;
                        }
                }                
                /**
                 * refresh old row's labels when from a row jump to another row, e.g  for "to" to "cc"
                 * reset labels' backgroundcolor
                 */
                function _refresh_old_row_labels(recipient_type){
                        try{
                                _recipient_text_fields_empty = 0;
                                _recipient_text_fields_delete = 0;    
                                _recipient_selected_element = null;
                                _recipient_selected_element_index = -1;                             
                                switch(recipient_type){
                                        case 'to':
                                                for(var i =0,j=_sms_recipients.length;i<j;i++){
                                                        _sms_recipients[i].backgroundColor = _label_field_backgroundColor;
                                                }                                                
                                                break;                                             
                                                break;
                                }                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _refresh_old_row_labels');
                                return;
                        }
                }
                /**
                 * update labels when select recipients from contact list
                 */
                function _update_recipient_by_selected_recipients(evt){
                        try{
                                var temp_left = 0;
                                var temp_level = 0;
                                switch(_recipient_selected_type){
                                        case 'to':
                                                temp_left = self.sms_to_text_field.left;
                                                temp_level = _recipient_to_level;
                                                break;
                                }
                                var  new_label = Ti.UI.createLabel({
                                        source:evt.source,//source type, manual input or select from list
                                        source_id:evt.source_id,//contact id
                                        contact:'',
                                        content:self.remove_all_character_and_symbol_except_number(evt.content),
                                        name:self.trim(evt.name),
                                        filterClass:'label',
                                        level:temp_level,
                                        width:'auto',
                                        height:self.default_table_view_row_height/2,
                                        text:self.trim(evt.name),
                                        backgroundColor:_label_field_backgroundColor,
                                        borderRadius:8,
                                        left:temp_left,
                                        right:0,
                                        textAlign:'center',
                                        font:{
                                                fontSize:self.middle_font_size
                                        },
                                        color:'#fff'
                                });        
                                if(new_label.toImage().size > 0){
                                        new_label.width = new_label.toImage().size/(self.default_table_view_row_height/2);   
                                        var temp_trim_string = self.trim(evt.name);
                                        new_label.width += (temp_trim_string.length+8)*_single_letter_width;                                
                                        if(new_label.width < _minimum_space_for_text_field){
                                                new_label.width = _minimum_space_for_text_field;
                                        }                              
                                }else{
                                        new_label.width = _minimum_space_for_text_field;
                                }                         
                                new_label.addEventListener('click',function(e){
                                        switch(_recipient_selected_type){
                                                case 'to':
                                                        _selected_recipient_row_class_name = 'set_to_recipients';
                                                        break;
                                        }                                   
                                        _label_click_event(e,_recipient_selected_type);
                                });            
                                        
                                switch(_recipient_selected_type){
                                        case 'to':
                                                self.to_row.add(new_label);
                                                _create_label_element(new_label,self.sms_to_text_field,_recipient_selected_type);     
                                                break;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _update_recipient_by_selected_recipients');
                                return;
                        }
                }                
                /**
                 *  refresh selected row's labels
                 */
                function _refresh_selected_row_labels(recipient_type){
                        try{
                                switch(recipient_type){
                                        case 'to':
                                                _recipient_selected_element = null;
                                                _recipient_selected_element_index = -1;                                        
                                                _recipient_to_level = 1;
                                                self.to_row.height = self.default_table_view_row_height+(self.default_table_view_row_height*0.75*(_recipient_to_level-1));
                                                var used_element_width = 0;
                                                for(var i =0,j=_sms_recipients.length;i<j;i++){
                                                        var label = _sms_recipients[i]; 
                                                        label.visible = true;
                                                        if(i == 0){                                                       
                                                                label.top =  self.default_table_view_row_height/4+(self.default_table_view_row_height*0.75*(_recipient_to_level-1));
                                                                label.left = _default_left_margin;  
                                                                label.right = self.screen_width-label.left-label.width;
                                                                label.level = _recipient_to_level;
                                                                used_element_width += (label.width+_gap_between_labels);
                                                        }else{
                                                                //if next element width > space , then level number +1
                                                                if(_sms_recipients[i].width > (self.screen_width-_default_left_margin-_default_right_margin-used_element_width)){
                                                                        _recipient_to_level++;
                                                                        used_element_width = 0;
                                                                        label.left = _default_left_margin;  
                                                                        self.to_row.height = self.default_table_view_row_height+(self.default_table_view_row_height*0.75*(_recipient_to_level-1));
                                                                }else{
                                                                        label.left = _sms_recipients[i-1].left+_sms_recipients[i-1].width+_gap_between_labels; 
                                                                }
                                                                label.top =  self.default_table_view_row_height/4+(self.default_table_view_row_height*0.75*(_recipient_to_level-1));                                                       
                                                                label.right = self.screen_width-label.left-label.width;
                                                                label.level = _recipient_to_level;                                                        
                                                                used_element_width += label.width+_gap_between_labels;
                                                        }
                                                }
                                                //set textfield position
                                                if(_sms_recipients.length > 0){
                                                        if((self.screen_width-_default_left_margin-_default_right_margin-used_element_width) < _minimum_space_for_text_field){
                                                                _recipient_to_level++;
                                                                self.sms_to_text_field.left = _default_left_margin;  
                                                                self.sms_to_text_field.width = self.screen_width-_default_left_margin-_default_right_margin;
                                                                self.to_row.height = self.default_table_view_row_height+(self.default_table_view_row_height*0.75*(_recipient_to_level-1));
                                                        }else{
                                                                self.sms_to_text_field.left = _sms_recipients[_sms_recipients.length-1].left+_sms_recipients[_sms_recipients.length-1].width+_gap_between_labels; 
                                                                self.sms_to_text_field.width = self.screen_width-_default_left_margin-_default_right_margin-used_element_width;
                                                        }
                                                        self.sms_to_text_field.top =  self.default_table_view_row_height/4+(self.default_table_view_row_height*0.75*(_recipient_to_level-1));                                                       
                                                        self.sms_to_text_field.level = _recipient_to_level; 
                                                }else{
                                                        self.sms_to_text_field.left = _default_left_margin;  
                                                        self.sms_to_text_field.width = self.screen_width-_default_left_margin-_default_right_margin;
                                                        self.sms_to_text_field.level = _recipient_to_level; 
                                                }
                                                _recipient_text_fields_delete = 0;
                                                self.sms_to_text_field.visible =true;
                                                self.sms_to_text_field.value = ' ';
                                                self.sms_to_text_field.focus();                                        
                                                break;
                                
                                }        
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _refresh_selected_row_labels');
                                return;
                        }
                }
                /*
                 * update row label to normal text when click subject or sms body area
                 */
                function _update_rows_label(e){
                        try{
                                _selected_label_object = null;
                                switch(_selected_recipient_row_class_name){
                                        case 'set_to_recipients':
                                                self.sms_to_text_field.value = ' ';
                                                self.sms_to_cover_label.visible = true;
                                                self.sms_to_cover_label.zIndex = 100;
                                                self.sms_to_cover_label.backgroundColor = "#fff";
                                                self.sms_to_cover_label.height = self.default_table_view_row_height-1;
                                                self.sms_to_cover_label.width =  self.screen_width-_default_left_margin;
                                                self.to_row.height = self.default_table_view_row_height-1;
                                                if(_sms_recipients.length <= 0){
                                                        self.sms_to_cover_label.text = '';
                                                }else{
                                                        self.sms_to_cover_label.text = _sms_recipients.length+' Recipient'+(((_sms_recipients.length>1))?'s':'');
                                                }
                                                for(var i=0,j=_sms_recipients.length;i<j;i++){
                                                        _sms_recipients[i].backgroundColor = _label_field_backgroundColor;
                                                        _sms_recipients[i].visible = false;
                                                }
                                                break;                                
                                }     
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _update_rows_label');
                                return;
                        }
                }      
                
        }

        win.addEventListener('focus',function(){
                try{
                        if(action_sms2_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                action_sms2_page.prototype = new F();
                                action_sms2_page.prototype.constructor = action_sms2_page;
                                action_sms2_page_obj = new action_sms2_page();
                                action_sms2_page_obj.init();
                        }else{
                                Ti.API.info('load_recipients:'+Ti.App.Properties.getBool('load_recipients'));
                                if(Ti.App.Properties.getBool('load_recipients')){
                                        Ti.App.Properties.setBool('load_recipients',false);
                                        action_sms2_page_obj.load_recipients();
                                }                                
                        }                       
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(e){
                try{                      
                        action_sms2_page_obj.close_window();
                        action_sms2_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());



