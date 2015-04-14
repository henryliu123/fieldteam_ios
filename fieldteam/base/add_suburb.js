/**
 *  Description: address editor
 */
// This controller is for iphone app version F6.
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;    
        var base_add_suburb_page_obj = null;

        function base_add_suburb_page(){
                var self = this;
                var window_source = 'base_add_suburb_page';
                win.title = 'Add Suburb';

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
                                _init_suburb_field();
                                _init_postcode_field();
                                _init_state_field();                                
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();  
                                self.check_and_set_object_focus(0,0,1);
                                self.table_view.addEventListener('scroll',function(e){
                                        if(_is_suburb_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }          
                                        if(_is_postcode_field_focused && (_selected_field_object != null)){
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
                                var error_string = '';


                                if(self.trim(_suburb) == ''){
                                        error_string += 'Please set suburb.\n';
                                }                                        
//                                if(self.trim(_postcode) == ''){
//                                        error_string += 'Please set postcode.\n';
//                                }     

                                if(self.trim(_state) === '' || _state_id==0 || self.trim(_state) === 'N/A'){
                                        error_string += 'Please set state.';
                                }

                                if(error_string != ''){
                                        self.show_message(error_string);
                                        return; 
                                }

                                //create latitude and longitude
                                if(Ti.Network.online){                                  
                                        self.display_indicator('Saving suburb ..',true);
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
                                                                Ti.API.info(this.responseText);
                                                                var temp_result = JSON.parse(this.responseText);               
                                                                self.hide_indicator();
                                                                if((temp_result.error != undefined)&&(temp_result.error.length >0)){
                                                                        error_string = '';
                                                                        for(var i=0,j=temp_result.error.length;i<j;i++){
                                                                                if(i==j){
                                                                                        error_string+=temp_result.error[i];
                                                                                }else{
                                                                                        error_string+=temp_result.error[i]+'\n';
                                                                                }
                                                                        }
                                                                        self.show_message(error_string);
                                                                        return; 
                                                                }else{ 
                                                                        var temp_state_id = temp_result.state_id;
                                                                        var temp_state = temp_result.state;
                                                                        Ti.API.info('temp_state:'+temp_state);
                                                                        var temp_suburb_id = temp_result.suburb_id;
                                                                        var temp_suburb = temp_result.suburb;
                                                                        var temp_postcode = temp_result.postcode;
                                                                        var optionDialog = Ti.UI.createOptionDialog({
                                                                                options:(self.is_ipad())?['YES','NO','']:['YES','NO'],
                                                                                buttonNames:['Cancel'],
                                                                                destructive:0,
                                                                                cancel:1,
                                                                                title:'New suburb has been saved. Do you want to set address with new suburb?'
                                                                        });
                                                                        optionDialog.show();
                                                                        optionDialog.addEventListener('click',function(e){
                                                                                Ti.API.info('e index:'+e.index);
                                                                                if(e.index == 0){
                                                                                        Ti.App.Properties.setBool('get_suburb_postcode_state_info_from_add_new_suburb',true);                                    
                                                                                        Ti.App.Properties.setString('get_suburb_postcode_state_info_from_add_new_suburb_state_id',temp_state_id);
                                                                                        Ti.App.Properties.setString('get_suburb_postcode_state_info_from_add_new_suburb_state',temp_state);
                                                                                        Ti.App.Properties.setString('get_suburb_postcode_state_info_from_add_new_suburb_suburb_id',temp_suburb_id);
                                                                                        Ti.App.Properties.setString('get_suburb_postcode_state_info_from_add_new_suburb_suburb',temp_suburb);
                                                                                        Ti.App.Properties.setString('get_suburb_postcode_state_info_from_add_new_suburb_postcode',temp_postcode);                                                                  
                                                                                }
                                                                                win.close();
                                                                        });                                                                        
                                                                        return;
                                                                }
                                                        }else{
                                                                self.hide_indicator();
                                                                var params = {
                                                                        message:'Save suburb failed.',
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
                                                                message:'Save suburb failed.',
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
                                                        message:'Save suburb failed.',
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
                                        xhr.onsendstream = function(e){
                                                self.update_progress(e.progress,true);
                                        };
                                        xhr.setTimeout(self.default_time_out);
                                        xhr.open('POST',self.get_host_url()+'update',false);
                                        xhr.send({
                                                'type':'save_new_suburb',
                                                'hash':_selected_user_id,
                                                'user_id':_selected_user_id,
                                                'company_id':_selected_company_id,
                                                'suburb':((_suburb != '')||(_suburb != null))?self.trim(_suburb.toUpperCase()):'',
                                                'postcode':((_postcode != '')||(_postcode != null))?self.trim(_postcode.toUpperCase()):'',
                                                'locality_state_id':_state_id,
                                                'locality_country_id':Ti.App.Properties.getString('selected_country_id'),
                                                'status_code':1,
                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                'app_version_increment':self.version_increment,
                                                'app_version':self.version,
                                                'app_platform':self.get_platform_info()                                                
                                        });                                        
                                }else{
                                        self.show_message(L('message_offline'),L('message_unable_to_connect'));                                      
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
                                if(e.index == self.default_main_menu_button_index){//menu menu
                                        self.close_all_window_and_return_to_menu(); 
                                }else{                                                                
                                        win.close();
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_left_btn_click_event');
                                return;
                        }
                };                
                /**
                 *  override table_view_click_event function of parent class: view_list.js
                 */                  
                self.table_view_click_event = function(e){
                        try{
                                _current_selected_row = e.row;
                                var index = e.index;
                                var filter_class = self.data[index].filter_class;
                                switch(filter_class){
                                        case 'suburb':
                                        case 'postcode':
                                                self.check_and_set_object_focus(0,index,1);
                                                break;
                                        case 'state':
                                                _event_for_state(e);
                                                break;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        } 
                };         
                
                /**
                 *  update field value after set properties 
                 *  in focus event call it
                 */
                self.update_field_value_after_set_properites = function(){
                        try{                                                                                                
                                if(Ti.App.Properties.getBool('update_unique_code_with_search_add_suburb_view_flag')){                                      
                                        _state_id = Ti.App.Properties.getString('update_unique_code_with_search_add_suburb_view_id');
                                        _state = Ti.App.Properties.getString('update_unique_code_with_search_add_suburb_view_content');
                                        if(_current_selected_row != null){
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _state;                                                       
                                        }                                      
                                        Ti.App.Properties.setBool('update_unique_code_with_search_add_suburb_view_flag',false);
                                }                                   
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.update_field_value_after_set_properites');
                                return;
                        }
                };                 
                //private member
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');                
                var _suburb = (win.suburb === null)?'':win.suburb;
                var _postcode = (win.postcode === null)?'':win.postcode;
                var _state = (win.state === null)?'':win.state;
                var _state_id = (win.state_id === 0)?0:win.state_id;  
                var _current_field_num = 0;
                var _current_selected_row = null;
                var _is_suburb_field_focused = false;
                var _is_postcode_field_focused = false;
                var _selected_field_object = null;
              
                /**
                 *  init suburb field;
                 */                
                function _init_suburb_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;  
                                var is_required_field = true;
                                var suburb_row = Ti.UI.createTableViewRow({
                                        className:'suburb',
                                        filter_class:'suburb'
                                });
                                var suburb_field_title = Ti.UI.createLabel({
                                        left:10,
                                        text:'Suburb',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        }
                                });
                                suburb_row.add(suburb_field_title);
                                var suburb_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(suburb_field_title.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_suburb,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                suburb_row.add(suburb_field);
                                self.data.push(suburb_row);
                                suburb_field.addEventListener('change',function(e){
                                        _suburb = e.value;
                                });    
                                suburb_field.addEventListener('return',function(){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });                                   
                                suburb_field.addEventListener('focus',function(e){                                        
                                        _is_suburb_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                suburb_field.addEventListener('blur',function(e){
                                        _is_suburb_field_focused = false;
                                        _selected_field_object = null;
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_suburb_field');
                                return; 
                        }                                
                }                
                /**
                 *  init postcode field;
                 */                
                function _init_postcode_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;  
                                var is_required_field = false;
                                var postcode_row = Ti.UI.createTableViewRow({
                                        className:'postcode',
                                        filter_class:'postcode'
                                });
                                var postcode_field_title = Ti.UI.createLabel({
                                        left:10,
                                        text:'Postcode',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        }
                                });
                                postcode_row.add(postcode_field_title);
                                var postcode_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(postcode_field_title.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_postcode,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                postcode_row.add(postcode_field);
                                self.data.push(postcode_row);
                                postcode_field.addEventListener('change',function(e){
                                        _postcode = e.value;
                                });    
                                postcode_field.addEventListener('focus',function(e){                                        
                                        _is_postcode_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                postcode_field.addEventListener('blur',function(e){
                                        _is_postcode_field_focused = false;
                                        _selected_field_object = null;
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_postcode_field');
                                return; 
                        }                                
                }                
                /**
                 *  init state field;
                 */                
                function _init_state_field(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_locality_state WHERE id=?',_state_id);
                                if(_state_id > 0){
                                        if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                                _state = rows.fieldByName('state');
                                        }
                                }
                                rows.close();
                                db.close();

                                var state_row = Ti.UI.createTableViewRow({
                                        className:'state',
                                        filter_class:'state',
                                        hasChild:true
                                });
                                var state_field_title = Ti.UI.createLabel({
                                        left:10,
                                        text:'State',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        }
                                });
                                state_row.add(state_field_title);
                                var state_field = Ti.UI.createLabel({
                                        width:parseInt(self.screen_width/2,10),
                                        height:self.default_table_view_row_height,
                                        textAlign:'right',
                                        right:10,
                                        text:_state,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                state_row.add(state_field);
                                self.data.push(state_row);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_state_field');
                                return; 
                        }                                
                }
                /*
                 * click event for state
                 */
                function _event_for_state(e){
                        try{
                        		var country_id = Ti.App.Properties.getString('selected_country_id');
                                var state_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'base/select_unique_value_from_table_view_with_search_bar.js'),
                                        win_title:'Select State',
                                        table_name:'my_locality_state',//table name
                                        display_name:'state',//need to shwo field
                                        query_array:['id!=0','status_code=1','locality_country_id='+country_id],//query field
                                        fuzzy_query:'state',//fuzzy query's fields'
                                        content:_state_id,
                                        content_value:_state,
                                        source:'add_suburb'
                                });
                                Titanium.UI.currentTab.open(state_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_state');
                                return;
                        }
                }                  
        }

        win.addEventListener('focus',function(){
                try{
                        if(base_add_suburb_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                base_add_suburb_page.prototype = new F();
                                base_add_suburb_page.prototype.constructor = base_add_suburb_page;
                                base_add_suburb_page_obj = new base_add_suburb_page();
                                base_add_suburb_page_obj.init();
                        }else{
                                base_add_suburb_page_obj.update_field_value_after_set_properites();                                
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        base_add_suburb_page_obj.close_window();
                        base_add_suburb_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }                        
        });
}());








