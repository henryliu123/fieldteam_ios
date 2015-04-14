/**
 *  Description: address editor
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;    
        var filter_job_filter_address_page_obj = null;

        function filter_job_filter_address_page(){
                var self = this;
                var window_source = 'filter_job_filter_address_page';
                win.title = 'Find Address';

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                   
                self.init = function(){
                        try{        
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Search','Main,Back');
                                _init_sub_number_field();
                                _init_unit_number_field();
                                _init_street_number_field();
                                _init_street_field();
                                _init_suburb_field();
                                //_init_postcode_field();
                                _init_state_field();
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
                                self.check_and_set_object_focus(0,0,1);
                                self.table_view.addEventListener('scroll',function(e){
                                        if(_is_sub_number_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_unit_number_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_street_number_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_street_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
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
                self.nav_right_btn_click_event = function(){
                        try{                               
                                if((self.trim(_sub_number) == '') && (self.trim(_unit_number) == '') && (self.trim(_street_number) == '') && (self.trim(_street) == '') && (self.trim(_suburb) == '') && (self.trim(_postcode) == '') && (self.trim(_state) === '')){
                                        self.show_message('Please enter address.');
                                        return;
                                }
                                
                               
                                var streetTypeName = '';
                                var streetTypeId = 0;
                                var newStreet = '';
                                if(self.trim(_street) != ''){
                                        var streetArray = self.trim(_street).split(' ');
                                        if(streetArray.length > 1){
                                                streetTypeName = streetArray[streetArray.length-1];
                                                streetTypeId = self.return_street_type_id(streetTypeName);
                                        }
                                        if(streetTypeId > 0){
                                                for(var i=0,j=streetArray.length-1;i<j;i++){
                                                        if(i>0){
                                                                newStreet+=' ';
                                                        }
                                                        newStreet += streetArray[i];
                                                }
                                        }
                                }
                                
                                Ti.API.info('newStreet:'+newStreet);
                                Ti.API.info('streetTypeName:'+streetTypeName);
                                Ti.API.info('streetTypeId:'+streetTypeId);
                                
                                
                                var query_value = '';
                                var server_query_value = '';
                                var search_query_value = '';
                                if(self.trim(_sub_number) != ''){
                                        _sub_number = self.replace(_sub_number,'\"',''); //remove " symbol
                                        query_value += ' upper(my_'+_type+'.sub_number) = upper(\"'+self.trim(_sub_number)+'\")';
                                        search_query_value += ' upper(my_'+_type+'.sub_number) = upper(\"'+self.trim(_sub_number)+'\")';
                                        server_query_value += ' upper(sub_number) = upper(\"'+self.trim(_sub_number)+'\")';
                                }
                                if(self.trim(_unit_number) != ''){
                                        _unit_number = self.replace(_unit_number,'\"',''); //remove " symbol
                                        if(query_value != ''){
                                                query_value+= ' and ';
                                                search_query_value+= ' and ';
                                                server_query_value+= ' and ';
                                        }                                        
                                        query_value += ' upper(my_'+_type+'.unit_number) = upper(\"'+self.trim(_unit_number)+'\")';
                                        search_query_value += ' upper(my_'+_type+'.unit_number) = upper(\"'+self.trim(_unit_number)+'\")';
                                        server_query_value += ' upper(unit_number) = upper(\"'+self.trim(_unit_number)+'\")';
                                }
                                if(self.trim(_street_number) != ''){
                                        _street_number = self.replace(_street_number,'\"',''); //remove " symbol
                                        if(query_value != ''){
                                                query_value+= ' and ';
                                                search_query_value+= ' and ';
                                                server_query_value+= ' and ';
                                        }                                        
                                        query_value += ' upper(my_'+_type+'.street_number) = upper(\"'+self.trim(_street_number)+'\")';
                                        search_query_value += ' upper(my_'+_type+'.street_number) = upper(\"'+self.trim(_street_number)+'\")';
                                        server_query_value +=' upper(street_number) = upper(\"'+self.trim(_street_number)+'\")';
                                }
                                if(self.trim(_street) != ''){
                                        _street = self.replace(_street,'\"',''); //remove " symbol
                                        if(query_value != ''){
                                                query_value+= ' and ';
                                                search_query_value+= ' and ';
                                                server_query_value+= ' and ';
                                        }                                                                                
                                        if(streetTypeId > 0){
                                                query_value += ' upper(my_'+_type+'.street) = upper(\"'+self.trim(newStreet)+'\") and my_'+_type+'.locality_street_type_id='+streetTypeId;
                                                search_query_value += ' upper(my_'+_type+'.street) = upper(\"'+self.trim(newStreet)+'\") and my_'+_type+'.locality_street_type_id='+streetTypeId;
                                                server_query_value += ' upper(street) = upper(\"'+self.trim(newStreet)+'\") and locality_street_type_id='+streetTypeId;                                                
                                        }else{
                                                query_value += ' upper(my_'+_type+'.street) = upper(\"'+self.trim(_street)+'\")';
                                                search_query_value += ' upper(my_'+_type+'.street) = upper(\"'+self.trim(_street)+'\")';
                                                server_query_value += ' upper(street) = upper(\"'+self.trim(_street)+'\")';
                                        }
                                }  
                                if(_stateID != 0){
                                        if(query_value != ''){
                                                query_value+= ' and ';
                                                search_query_value+= ' and ';
                                                server_query_value+= ' and ';
                                        }                                        
                                        query_value += ' my_'+_type+'.locality_state_id ='+_stateID;
                                        search_query_value += ' my_'+_type+'.locality_state_id ='+_stateID;
                                        server_query_value += ' locality_state_id ='+_stateID;
                                } 
                                if(self.trim(_suburb) != ''){
                                        _suburb = self.replace(_suburb,'\"',''); //remove " symbol
                                        if(query_value != ''){
                                                query_value+= ' and ';
                                                search_query_value+= ' and ';
                                                server_query_value+= ' and ';
                                        }                                                                                
                                        query_value += ' upper(my_'+_type+'.suburb) = upper(\"'+self.trim(_suburb)+'\")';                                        
                                        search_query_value += ' my_'+_type+'.locality_suburb_id in (select s.id from locality_suburb as s where upper(s.suburb) = upper(\"'+self.trim(_suburb)+'\"))';
                                        server_query_value +=  ' locality_suburb_id in (select s.id from locality_suburb as s where upper(s.suburb) = upper(\"'+self.trim(_suburb)+'\"))';                                        
                                } 
                                if(self.trim(_postcode) != ''){
                                        _postcode = self.replace(_postcode,'\"',''); //remove " symbol
                                        if(query_value != ''){
                                                query_value+= ' and ';
                                                search_query_value+= ' and ';
                                                server_query_value+= ' and ';
                                        }                                                                                
                                        query_value += ' upper(my_'+_type+'.postcode) = upper(\"'+self.trim(_postcode)+'\")';                                        
                                        search_query_value += ' upper(my_'+_type+'.postcode) = upper(\"'+self.trim(_postcode)+'\")';  
                                        server_query_value +=  ' upper(postcode) =upper(\"'+self.trim(_postcode)+'\")';                                   
                                }                                 
                                Ti.API.info('search_query_value:'+search_query_value);
                                
                                //search server for finding result number
                                switch(_filter_class){
                                        case 'find_job_address':
                                        case 'find_quote_address':
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
                                                                                        return;
                                                                                }                                                                                        
                                                                                var result = JSON.parse(this.responseText);
                                                                                var total_search_result = result.search_by_conditions[0].search_result;
                                                                                self.hide_indicator();
                                                                                
                                                                                var new_win = Ti.UI.createWindow({
                                                                                        url:self.get_file_path('url', 'filter/job_filter.js'),
                                                                                        source_name:win.source_name,
                                                                                        pull_down_refresh:true,
                                                                                        filter_class:win.filter_class,
                                                                                        filter_code:win.filter_code,
                                                                                        query_field:'address',
                                                                                        query_value:query_value,
                                                                                        server_query_value:server_query_value,
                                                                                        search_query_value:search_query_value,
                                                                                        sub_number:_sub_number,
                                                                                        unit_number:_unit_number,
                                                                                        street_number:_street_number,
                                                                                        street:_street,
                                                                                        suburb:_suburb,
                                                                                        postcode:_postcode,
                                                                                        state_id:_stateID,                                        
                                                                                        type:_type,
                                                                                        code:-1,
                                                                                        total_search_result:total_search_result
                                                                                });
                                                                                Ti.UI.currentTab.open(new_win,{
                                                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                                                });                                                                                                                                                                          
                                                                        }else{ 
                                                                                self.hide_indicator();
                                                                                var params = {
                                                                                        message:L('message_not_get_search_result_in_job_filter_model_window'),
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
                                                                                message:L('message_not_get_search_result_in_job_filter_model_window'),
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
                                                                        message:L('message_not_get_search_result_in_job_filter_model_window'),
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
                                                                'type':'search_by_conditions',
                                                                'hash':_selected_user_id,
                                                                'company_id':_selected_company_id,
                                                                'user_id':_selected_user_id,
                                                                'filter_class':_filter_class,
                                                                'query_field':'',
                                                                'query_value':query_value,
                                                                'search_query_value':search_query_value,
                                                                'job_type':win.type,
                                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                                'app_version_increment':self.version_increment,
                                                                'app_version':self.version,
                                                                'app_platform':self.get_platform_info()
                                                        });     
                                                }else{
                                                        self.process_simple_error_message(L('message_offline_in_job_filter_model_window'));
                                                        var new_win = Ti.UI.createWindow({
                                                                url:self.get_file_path('url', 'filter/job_filter.js'),
                                                                source_name:win.source_name,
                                                                pull_down_refresh:true,
                                                                filter_class:win.filter_class,
                                                                filter_code:win.filter_code,
                                                                query_field:'address',
                                                                query_value:query_value,
                                                                server_query_value:server_query_value,
                                                                sub_number:_sub_number,
                                                                unit_number:_unit_number,
                                                                street_number:_street_number,
                                                                street:_street,
                                                                suburb:_suburb,
                                                                postcode:_postcode,
                                                                state_id:_stateID,                                        
                                                                type:_type,
                                                                code:-1
                                                        });
                                                        Ti.UI.currentTab.open(new_win,{
                                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                        });                                                          
                                                        return;
                                                }
                                                break;
                                        default:
                                                new_win = Ti.UI.createWindow({
                                                        url:self.get_file_path('url', 'filter/job_filter.js'),
                                                        source_name:win.source_name,
                                                        pull_down_refresh:true,
                                                        filter_class:win.filter_class,
                                                        filter_code:win.filter_code,
                                                        query_field:'address',
                                                        query_value:query_value,
                                                        server_query_value:server_query_value,
                                                        sub_number:_sub_number,
                                                        unit_number:_unit_number,
                                                        street_number:_street_number,
                                                        street:_street,
                                                        suburb:_suburb,
                                                        postcode:_postcode,
                                                        state_id:_stateID,                                        
                                                        type:_type,
                                                        code:-1
                                                });
                                                Ti.UI.currentTab.open(new_win,{
                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                });                                                             
                                }                                                                                                   
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
                                _current_selected_row = e.row;
                                var index = e.index;
                                var filter_class = self.data[index].filter_class;
                                switch(filter_class){
                                        case 'sub_number':
                                        case 'unit_number':
                                        case 'street_number':
                                        case 'street':
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
                                if(Ti.App.Properties.getBool('update_unique_code_with_search_edit_job_filter_address_state_view_flag')){                                          
                                        _stateID = Ti.App.Properties.getString('update_unique_code_with_search_edit_job_filter_address_state_view_id');
                                        _state = Ti.App.Properties.getString('update_unique_code_with_search_edit_job_filter_address_state_view_content');
                                        if(_current_selected_row != null){
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _state;        
                                                _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                _current_selected_row.children[_current_selected_row.children.length-2].visible = false;                                                
                                        }                                      
                                        Ti.App.Properties.setBool('update_unique_code_with_search_edit_job_filter_address_state_view_flag',false);
                                }                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.update_field_value_after_set_properites');
                                return;
                        }
                };                 
                
                //private member             
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');                   
                var _filter_class = win.filter_class;
                var _type =win.type;
                var _sub_number = '';
                var _unit_number = '';
                var _street_number = '';
                var _street = '';
                var _suburb = '';
                var _postcode = '';
                var _state = '';
                var _stateID = 0;
                var _street_type_Id = 0;
                var _current_field_num = 0;
                var _current_selected_row = null;
                var _is_sub_number_field_focused = false;
                var _is_unit_number_field_focused = false;
                var _is_street_number_field_focused = false;
                var _is_street_field_focused = false;
                var _is_suburb_field_focused = false;
                var _is_postcode_field_focused = false;
                var _selected_field_object = null;                  

                //private method
                /**
                 *  init sub number field
                 */
                function _init_sub_number_field(){
                        try{
                                //sub number field
                                _current_field_num++;
                                var field_num = _current_field_num;
                                var is_required_field = false;
                                var sub_row = Ti.UI.createTableViewRow({
                                        className:'sub_number',
                                        filter_class:'sub_number'
                                });
                                var sub_field_title = Ti.UI.createLabel({
                                        left:10,
                                        text:'Sub No.',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        }
                                });
                                sub_row.add(sub_field_title);
                                var sub_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(sub_field_title.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_sub_number,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                sub_row.add(sub_field);
                                self.data.push(sub_row);
                                sub_field.addEventListener('change',function(e){
                                        _sub_number = e.value;
                                });
                                sub_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });
                                sub_field.addEventListener('focus',function(e){                                        
                                        _is_sub_number_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                sub_field.addEventListener('blur',function(e){
                                        _is_sub_number_field_focused = false;
                                        _selected_field_object = null;
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_sub_number_field');
                                return;
                        }                                
                }
                /**
                 *  init unit number field
                 */                
                function _init_unit_number_field(){
                        try{
                                //unit number field
                                _current_field_num++;
                                var field_num = _current_field_num;     
                                var is_required_field = false;
                                var unit_row = Ti.UI.createTableViewRow({
                                        className:'unit_number',
                                        filter_class:'unit_number'
                                });
                                var unit_field_title = Ti.UI.createLabel({
                                        left:10,
                                        text:'Unit No.',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        }
                                });
                                unit_row.add(unit_field_title);
                                var unit_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(unit_field_title.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_unit_number,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                unit_row.add(unit_field);
                                self.data.push(unit_row);
                                unit_field.addEventListener('change',function(e){
                                        _unit_number = e.value;
                                });
                                unit_field.addEventListener('return',function(){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });
                                unit_field.addEventListener('focus',function(e){                                        
                                        _is_unit_number_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                unit_field.addEventListener('blur',function(e){
                                        _is_unit_number_field_focused = false;
                                        _selected_field_object = null;
                                });                                   
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_unit_number_field');
                                return;
                        }                                
                }
                /**
                 *  init street number field
                 */                
                function _init_street_number_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;  
                                var is_required_field = false;
                                //street number field
                                var street_no_row = Ti.UI.createTableViewRow({
                                        className:'street_number',
                                        filter_class:'street_number'
                                });
                                var street_no_field_title = Ti.UI.createLabel({
                                        left:10,
                                        text:'Street No.',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        }
                                });
                                street_no_row.add(street_no_field_title);
                                var street_no_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(street_no_field_title.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_street_number,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                street_no_row.add(street_no_field);
                                self.data.push(street_no_row);
                                street_no_field.addEventListener('change',function(e){
                                        _street_number = e.value;
                                });
                                street_no_field.addEventListener('return',function(){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });     
                                street_no_field.addEventListener('focus',function(e){                                        
                                        _is_street_number_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                street_no_field.addEventListener('blur',function(e){
                                        _is_street_number_field_focused = false;
                                        _selected_field_object = null;
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_street_number_field');
                                return;
                        }                                
                }
                /**
                 *  init street field
                 */                
                function _init_street_field(){
                        try{
                                _current_field_num++;  
                                var field_num = _current_field_num; 
                                var is_required_field = false;
                                //street
                                var street_row = Ti.UI.createTableViewRow({
                                        className:'street',
                                        filter_class:'street'
                                });
                                var street_field_title = Ti.UI.createLabel({
                                        left:10,
                                        text:'Street',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        }
                                });
                                street_row.add(street_field_title);
                                var street_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(street_field_title.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_street,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                street_row.add(street_field);
                                self.data.push(street_row);
                                street_field.addEventListener('change',function(e){
                                        _street = e.value;
                                });
                                street_field.addEventListener('return',function(){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });    
                                street_field.addEventListener('focus',function(e){                                        
                                        _is_street_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                street_field.addEventListener('blur',function(e){
                                        _is_street_field_focused = false;
                                        _selected_field_object = null;
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_street_field');
                                return;
                        }                                
                }
                /**
                 *  init suburb field
                 */
                function _init_suburb_field(){
                        try{
                                _current_field_num++;      
                                var field_num = _current_field_num; 
                                var is_required_field = false;
                                var suburb_row = Ti.UI.createTableViewRow({
                                        className:'suburb',
                                        filter_class:'suburb'
                                });
                                var suburb_field_title = Ti.UI.createLabel({
                                        filter_class:'suburb_title',
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
                                        filter_class:'suburb_content',
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
                 *  init postcode field
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
                                        filter_class:'postcode_title',
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
                                        filter_class:'postcode_content',
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
                 *  init state field
                 */                
                function _init_state_field(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_locality_state WHERE id=?',_stateID);
                                if(_stateID > 0){
                                        if(rows.getRowCount() > 0){
                                                if(rows.isValidRow()){
                                                        _state = rows.fieldByName('state');
                                                }
                                        }
                                }
                                rows.close();
                                db.close();
                                
                                _current_field_num++;
                                var is_required_field = false; 
                                var state_Field = Ti.UI.createTableViewRow({
                                        className:'state',
                                        filter_class:'state',
                                        hasChild:true,
                                        height:self.default_table_view_row_height
                                });
                                var stateTitleField = Ti.UI.createLabel({
                                        text:'State',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                state_Field.add(stateTitleField);

                                var stateContentRequiredTextLabel = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(stateTitleField.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                state_Field.add(stateContentRequiredTextLabel);

                                var stateContentField = Ti.UI.createLabel({
                                        right:10,
                                        width:self.set_a_field_width_in_table_view_row(stateTitleField.text),
                                        textAlign:'right',
                                        text:((_stateID <= 0))?'N/A':_state,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                state_Field.add(stateContentField);
                                if(_stateID <= 0){
                                        stateContentField.visible = false;
                                }else{
                                        stateContentRequiredTextLabel.visible = false;
                                }
                                self.data.push(state_Field);                                
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
                                var client_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'base/select_unique_value_from_table_view_with_search_bar.js'),
                                        win_title:'Select State',
                                        table_name:'my_locality_state',//table name
                                        display_name:'state',//need to shwo field
                                        query_array:['id!=0','status_code=1'],//query field
                                        fuzzy_query:'state',//fuzzy query's fields'
                                        content:_stateID,
                                        content_value:_state,
                                        source:'edit_job_filter_address_state'
                                });
                                Titanium.UI.currentTab.open(client_win,{
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
                        if(filter_job_filter_address_page_obj === null){
                                Ti.App.Properties.setBool('update_unique_code_with_search_edit_job_filter_address_view_flag',false);
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                filter_job_filter_address_page.prototype = new F();
                                filter_job_filter_address_page.prototype.constructor = filter_job_filter_address_page;
                                filter_job_filter_address_page_obj = new filter_job_filter_address_page();
                                filter_job_filter_address_page_obj.init();
                        }else{
                                filter_job_filter_address_page_obj.update_field_value_after_set_properites(); 
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{                                   
                        filter_job_filter_address_page_obj.close_window();
                        filter_job_filter_address_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());








