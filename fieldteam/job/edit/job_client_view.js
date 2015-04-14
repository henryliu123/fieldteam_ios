//display job detail
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_client_view_page_obj = null;

        function job_client_view_page(){
                var self = this;
                var window_source = 'job_client_view_page';
                win.title = 'Client';

                //public method
                /**
                 *  override init  function of parent class: fieldteam.js
                 */                  
                self.init = function(){
                        try{              
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Edit','Main,Back'); 
                                self.init_vars();
                                _init_client_name_section();
                                _init_client_type_field();            
                                _init_client_mobile_field();
                                _init_client_phone_field();
                                _init_client_fax_field();
                                _init_client_email_field();
                                _init_client_website_field();
                                _init_client_skype_field();
                                _init_client_address_field();            
                                _init_client_description_field();
                                _init_client_postal_address_field();                                
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
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
                                var rows = db.execute('SELECT * FROM my_client WHERE id=?',_client_id);
                                if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                        _client_reference_number = rows.fieldByName('reference_number');
                                        _client_name = rows.fieldByName('client_name');
                                        _client_abbr = rows.fieldByName('client_abbr');
                                        _client_type_code = rows.fieldByName('client_type_code');
                                        _phone_mobile = rows.fieldByName('phone_mobile');
                                        _phone = rows.fieldByName('phone');
                                        _fax = rows.fieldByName('fax');
                                        _skype = rows.fieldByName('skype_name');
                                        _email = rows.fieldByName('email');
                                        _website = rows.fieldByName('website');
                                        _description = rows.fieldByName('description');
                                        _postal_address = rows.fieldByName('postal_address');
                                        
                                        _sub_number = rows.fieldByName('sub_number');
                                        _unit = rows.fieldByName('unit_number');
                                        if(_unit === null){
                                                _unit = '';
                                        }

                                        _street_no = rows.fieldByName('street_number');
                                        _street_no = ((_street_no === '')||(_street_no === null))?'':_street_no+' ';

                                        _street_type_id = rows.fieldByName('locality_street_type_id');
                                        _street_type = rows.fieldByName('street_type');
                                        _street = rows.fieldByName('street');
                                        _street = self.display_correct_street(_street,_street_type);
                                        _suburb = rows.fieldByName('suburb');
                                        _suburb = (_suburb === null)?'':_suburb;
                                        
                                        _postcode = rows.fieldByName('postcode');
                                        _postcode = (_postcode === null)?'':_postcode;                                        
                                                                                
                                        if(_street === ''){
                                                _address = '(Blank)';
                                        }else{
                                                if((_sub_number === '') || (_sub_number === null)){
                                                        if((_unit === '') || (_unit === null)){
                                                                _address = _street_no+' '+_street+', '+_suburb+(_postcode === ''?'':' '+_postcode);
                                                        }else{
                                                                _address = _unit+'/'+_street_no+' '+_street+', '+_suburb+(_postcode === ''?'':' '+_postcode);
                                                        }
                                                }else{
                                                        if((_unit === '') || (_unit === null)){
                                                                _address = _street_no+' '+_street+', '+_suburb+(_postcode === ''?'':' '+_postcode);
                                                        }else{
                                                                _address = _unit+'-'+_sub_number+'/'+_street_no+' '+_street+', '+_suburb+(_postcode === ''?'':' '+_postcode);
                                                        }
                                                }                                                                                
                                        }
                                        if(_address != ''){
                                                _address = _address.toUpperCase();
                                        }                              
                                        
                                }
                                rows.close();
                                db.close();      
                                if(_client_type_code == 1){
                                        _client_type_name = 'Business';
                                }else{
                                        _client_type_name = 'Private';
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }                        
                };
                /**
                 *  override table_view_click_event  function of parent class: fieldteam.js
                 */                  
                self.table_view_click_event = function(e){
                        try{
                                if(_selected_job_id > 1000000000){
                                        self.show_message('Please save '+_type+' before executing any action.');
                                        return;
                                }
                                if(e.row.type === 'mobile'){
                                        _event_for_mobile_type(e);
                                }
                                if(e.row.type === 'phone'){
                                        _event_for_phone_type(e);
                                }
                                if(e.row.type === 'fax'){
                                        _event_for_fax_type(e);                                                
                                }                         
                                if(e.row.type === 'email'){
                                        _event_for_email_type(e);
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
                                var edit_client_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','client/edit_client.js'),
                                        type:_type,
                                        client_id:_client_id,
                                        client_refrence_number:_client_reference_number,
                                        client_type_code:_client_type_code,
                                        action_for_client:'edit_client',
                                        parent_win:win,
                                        is_close_parent_win:true
                                });
                                Titanium.UI.currentTab.open(edit_client_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }                         
                };                                   
                
                
                //private member
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_job_reference_number = win.job_reference_number;
                var _client_id = win.client_id;
                var _client_reference_number = 0;
                var _client_type_code = 1;
                var _client_type_name = '';
                var _client_name = '';
                var _client_abbr = '';                
                var _phone_mobile = '';
                var _phone = '';
                var _fax = '';
                var _email = '';
                var _website = '';
                var _skype = '';
                var _address = '';
                var _description = '';
                var _postal_address = '';                
                var _sub_number = '';
                var _unit = '';
                var _street_no = '';
                var _street = '';
                var _street_type = '';
                var _street_type_id = 0;
                var _suburb = '';               
                var _postcode = '';

                //private method
                /**
                 *  init client name section
                 */
                function _init_client_name_section(){
                        try{
                                var client_name_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_name',
                                        className:'set_client_name',
                                        height:self.default_table_view_row_height,
                                        type:'name',
                                        text_value:_client_name
                                });
                                var client_name_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Type',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                client_name_field.add(client_name_title_field);
                                var client_name_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:((_client_abbr !='')?'['+_client_abbr+'] ':'')+_client_name,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:20
                                });
                                client_name_field.add(client_name_content_field);
                                self.data.push(client_name_field);                                                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_name_section');
                                return;
                        }                                
                }
                /**
                 *  init client mobile section
                 */                
                function _init_client_type_field(){
                        try{
                                var client_type_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_type',
                                        className:'set_client_type',
                                        height:self.default_table_view_row_height,
                                        type:'type',
                                        text_value:_client_type_name
                                });
                                var client_type_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Type',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                client_type_field.add(client_type_title_field);
                                var client_type_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_client_type_name,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:20
                                });
                                client_type_field.add(client_type_content_field);
                                self.data.push(client_type_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_type_field');
                                return;
                        }                                
                }                
                /**
                 *  init client mobile section
                 */                
                function _init_client_mobile_field(){
                        try{
                                var client_mobile_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_mobile',
                                        className:'set_client_mobile',
                                        height:self.default_table_view_row_height,
                                        type:'mobile',
                                        text_value:_phone_mobile
                                });
                                var client_mobile_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Mobile',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                client_mobile_field.add(client_mobile_title_field);
                                var client_mobile_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_phone_mobile,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:20
                                });
                                client_mobile_field.add(client_mobile_content_field);
                                self.data.push(client_mobile_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_mobile_field');
                                return;
                        }                                
                }
                /**
                 *  init client phone section
                 */                
                function _init_client_phone_field(){
                        try{
                                var client_phone_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_phone',
                                        className:'set_client_phone',
                                        height:self.default_table_view_row_height,
                                        type:'phone',
                                        text_value:_phone
                                });
                                var client_phone_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Phone',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                client_phone_field.add(client_phone_title_field);
                                var client_phone_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_phone,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:20
                                });
                                client_phone_field.add(client_phone_content_field);
                                self.data.push(client_phone_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_phone_field');
                                return;
                        }                                
                }
                /**
                 *  init client fax section
                 */                
                function _init_client_fax_field(){
                        try{
                                var client_fax_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_fax',
                                        className:'set_client_fax',
                                        height:self.default_table_view_row_height,
                                        type:'fax',
                                        text_value:_fax
                                });
                                var client_fax_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Fax',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                client_fax_field.add(client_fax_title_field);
                                var client_fax_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_fax,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:20
                                });
                                client_fax_field.add(client_fax_content_field);
                                self.data.push(client_fax_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_fax_field');
                                return;
                        }                                
                }
                /**
                 *  init client  email section
                 */                
                function _init_client_email_field(){
                        try{
                                var client_email_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_email',
                                        className:'set_client_email',
                                        height:self.default_table_view_row_height,
                                        type:'email',
                                        text_value:_email
                                });
                                var client_email_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Email',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                client_email_field.add(client_email_title_field);
                                var client_email_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_email,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:20
                                });
                                client_email_field.add(client_email_content_field);
                                self.data.push(client_email_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_email_field');
                                return;
                        }                                
                }
                /**
                 *  init client  website section
                 */                
                function _init_client_website_field(){
                        try{
                                var client_website_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_website',
                                        className:'set_client_website',
                                        height:self.default_table_view_row_height,
                                        type:'website',
                                        text_value:_website
                                });
                                var client_website_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Website',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                client_website_field.add(client_website_title_field);
                                var client_website_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_website,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:20
                                });
                                client_website_field.add(client_website_content_field);
                                self.data.push(client_website_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_website_field');
                                return;
                        }                                
                }                
                /**
                 *  init client  skype section
                 */                
                function _init_client_skype_field(){
                        try{
                                var client_skype_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_skype',
                                        className:'set_client_skype',
                                        height:self.default_table_view_row_height,
                                        type:'skype',
                                        text_value:_skype
                                });
                                var client_skype_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Skype',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                client_skype_field.add(client_skype_title_field);
                                var client_skype_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_skype,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:20
                                });
                                client_skype_field.add(client_skype_content_field);
                                self.data.push(client_skype_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_skype_field');
                                return;
                        }                                
                }     
                /**
                 *  init client address section
                 */                
                function _init_client_address_field(){
                        try{
                                var client_address_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_address',
                                        className:'set_client_address',
                                        height:'auto',
                                        type:'address'
                                });
                                var client_address_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Address',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                client_address_field.add(client_address_title_field);
                                var client_address_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_address,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:'auto'
                                });
                                client_address_field.add(client_address_content_field);
                                self.data.push(client_address_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_address_field');
                                return;
                        }                                
                }                
                /**
                 *  init client description section
                 */                
                function _init_client_description_field(){
                        try{
                                var client_description_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_description',
                                        className:'set_client_description',
                                        height:'auto',
                                        type:'description'
                                });
                                var client_description_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Description',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        color:self.selected_value_font_color
                                });
                                client_description_field.add(client_description_title_field);
                                var client_description_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_description,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:'auto'
                                });
                                client_description_field.add(client_description_content_field);
                                self.data.push(client_description_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_description_field');
                                return;
                        }                                
                }
                /**
                 *  init client postal section
                 */                
                function _init_client_postal_address_field(){
                        try{
                                var client_postal_address_field = Ti.UI.createTableViewRow({
                                        filter_class:'set_client_postal_address',
                                        className:'set_client_postal_address',
                                        height:'auto',
                                        type:'postal_address'
                                });
                                var client_postal_address_title_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Postal',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        top:3,
                                        color:self.selected_value_font_color
                                });
                                client_postal_address_field.add(client_postal_address_title_field);
                                var client_postal_address_title_field2 = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Address',
                                        textAlign:'right',
                                        left:10,
                                        width:80,
                                        height:20,
                                        top:20,
                                        color:self.selected_value_font_color
                                });
                                client_postal_address_field.add(client_postal_address_title_field2);                                
                                var client_postal_address_content_field = Ti.UI.createLabel({
                                        font:{
                                                fontSize:self.middle_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:_postal_address,
                                        textAlign:'left',
                                        left:100,
                                        width:200,
                                        height:'auto'
                                });
                                client_postal_address_field.add(client_postal_address_content_field);
                                self.data.push(client_postal_address_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_postal_address_field');
                                return;
                        }                                
                }                
                /**
                 *  event list for different type operation.
                 */
                function _event_for_mobile_type(e){
                        try{
                                var phone_str = self.remove_all_charaters_from_string(e.row.text_value);
                                if(isNaN(phone_str) || (phone_str == '')){
                                        self.show_message(L('message_invalid_phone_number'));
                                        return;
                                }
                                var recipients = [];
                                var option_dialog = Ti.UI.createOptionDialog({
                                        options:(self.is_ipad())?['SMS','Call','Cancel','']:['SMS','Call','Cancel'],
                                        buttonNames:['Cancel'],
                                        destructive:0,
                                        cancel:2,
                                        title:L('message_select_option')
                                });
                                option_dialog.show();
                                option_dialog.addEventListener('click',function(evt){
                                        var temp_type_text = '';
                                        if(evt.index === 0){//sms
                                                temp_type_text = 'sms';
                                        }
                                        if(evt.index === 1){//sms
                                                temp_type_text = 'call';
                                        }
                                        if(temp_type_text != ''){
                                                var tmp_var = {
                                                        display_content:e.row.text_value,
                                                        content:phone_str,
                                                        name:_client_name,
                                                        source:'client',
                                                        source_id:_client_id
                                                };
                                                recipients.push(tmp_var);
                                                self.action_events(_type,temp_type_text,_selected_job_id,_selected_job_reference_number,JSON.stringify(recipients));
                                        }
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_mobile_type');
                                return;
                        }                                
                }
                function _event_for_phone_type(e){
                        try{
                                var phone_str = self.remove_all_charaters_from_string(e.row.text_value);
                                if(isNaN(phone_str) || (phone_str == '')){
                                        self.show_message(L('message_invalid_phone_number'));
                                        return;
                                }
                                var recipients = [];
                                var temp_type_text = 'call';
                                if(temp_type_text != ''){
                                        var tmp_var = {
                                                display_content:e.row.text_value,
                                                content:phone_str,
                                                name:_client_name,
                                                source:'client',
                                                source_id:_client_id
                                        };
                                        recipients.push(tmp_var);
                                        self.action_events(_type,temp_type_text,_selected_job_id,_selected_job_reference_number,JSON.stringify(recipients));
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_phone_type');
                                return;
                        }                                
                }
                function _event_for_fax_type(e){
                        try{
                                var phone_str = self.remove_all_charaters_from_string(e.row.text_value);
                                if(isNaN(phone_str) || (phone_str == '')){
                                        self.show_message(L('message_invalid_phone_number'));
                                        return;
                                }
                                var recipients = [];
                                var temp_type_text = 'call';
                                if(temp_type_text != ''){
                                        var tmp_var = {
                                                display_content:e.row.text_value,
                                                content:phone_str,
                                                name:_client_name,
                                                source:'client',
                                                source_id:_client_id
                                        };
                                        recipients.push(tmp_var);
                                        self.action_events(_type,temp_type_text,_selected_job_id,_selected_job_reference_number,JSON.stringify(recipients));
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_fax_type');
                                return;
                        }                                
                }                       
                function _event_for_email_type(e){
                        try{
                                if(!self.check_valid_email(e.row.text_value)){
                                        self.show_message(L('message_invalid_email'));
                                        return;
                                }
                                var recipients = [];
                                var temp_type_text = 'email';
                                if(temp_type_text != ''){
                                        var tmp_var = {
                                                content:e.row.text_value,
                                                name:_client_name,
                                                source:'client',
                                                source_id:_client_id
                                        };
                                        recipients.push(tmp_var);
                                        self.action_events(_type,temp_type_text,_selected_job_id,_selected_job_reference_number,JSON.stringify(recipients));
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_email_type');
                                return;
                        }                                
                }
        }
    
        win.addEventListener('open',function(){  
                try{
                        if(job_client_view_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_client_view_page.prototype = new F();
                                job_client_view_page.prototype.constructor = job_client_view_page;
                                job_client_view_page_obj = new job_client_view_page();
                                job_client_view_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }                        
        });

        win.addEventListener('close',function(){
                try{
                        job_client_view_page_obj.close_window();
                        job_client_view_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }                        
        });
}());




