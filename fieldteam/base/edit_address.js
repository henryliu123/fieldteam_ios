/**
 *  Description: address editor
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;    
        var base_edit_address_page_obj = null;

        function base_edit_address_page(){
                var self = this;
                var window_source = 'base_edit_address_page';
                win.title = 'Edit Address';

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
                                _init_bottom_tool_bar();
                                _init_sub_number_field();
                                _init_unit_number_field();
                                _init_street_number_field();
                                _init_street_field();
                                _init_suburb_field();
                                _init_postcode_field();
                                _init_state_field();
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
                                self.table_view.bottom = self.tool_bar_height;
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
                self.nav_right_btn_click_event = function(e){
                        try{
                                var error_string = '';

//                                if(self.trim(_street_number) == ''){
//                                        error_string += 'Please set street number.\n';
//                                }

                                if(self.trim(_street) == ''){
                                        //error_string += 'Please set street.(e.g Pitt St or Pitt Street)\n';
                                }else{
                                        var street_arr  = self.trim(_street).split(' ');
                                        if(street_arr.length > 1){
                                                if(!self.check_street_type(street_arr[street_arr.length-1])){
                                                        error_string += 'Please enter street type. (e.g Pitt Street or Pitt St)';
                                                }
                                        }else{
                                                error_string += 'Please set street.(e.g Pitt St or Pitt Street)\n';
                                        }
                                }

                                if(!Ti.Network.online){//offline
                                        if(self.trim(_suburb) == ''){
                                                error_string += 'Please set sector.\n';
                                        }                                        
                                }else{
                                        if((self.trim(_suburb) == '') && (self.trim(_postcode == ''))){
                                                error_string += 'Please set sector or postcode.\n';
                                        }                                        
                                }

                                if(self.trim(_state) === ''){
                                        error_string += 'Please set state.\n';
                                }

                                if(error_string != ''){
                                        self.show_message(error_string);
                                        return;
                                }

                                //create latitude and longitude
                                var latitudeText = 0;
                                var longitudeText = 0;
                                var new_addr = _street_number+',+'+_street+',+'+_suburb;
				if(self.trim(_street) == ''){
					if(self.trim(_suburb) == ''){
						new_addr =self.trim(_suburb);
					}else{
						new_addr = '';
					}
				}                                             
                                var temp_country = Titanium.App.Properties.getString('selected_country_name');
                                temp_country = (temp_country === null)?'':temp_country;
                                var new_addr_state_and_country = '';
                                if(self.trim(temp_country) != ''){
                                        new_addr_state_and_country = ((new_addr !='')?',+':'')+_state_abbr+',+'+temp_country;
                                }else{
                                        new_addr_state_and_country =((new_addr !='')?',+':'')+_state_abbr;
                                }
                                new_addr  = self.replace(new_addr,' ','+');
                                new_addr_state_and_country  = self.replace(new_addr_state_and_country,' ','+');
                                if(Ti.Network.online){
                                        if(e.index == self.default_main_menu_button_index){//menu menu
                                                _is_click_main_menu_btn = true; 
                                        }else{
                                                _is_click_main_menu_btn = false;
                                        }
                                        _check_address(new_addr,new_addr_state_and_country);
                                }else{
                                        if(e.index == self.default_main_menu_button_index){//menu menu
                                                self.close_all_window_and_return_to_menu(); 
                                        }else{
                                                if(self.trim(_street) != ''){
                                                        var temp_array = _street.split(' ');
                                                        if((temp_array.length > 1) && (_street_type != '') && ((temp_array[temp_array.length-1]).toLowerCase() == (_street_type).toLowerCase())){                                                                
                                                                _street = '';
                                                                for(var i=0;i<temp_array.length-1;i++){
                                                                        if(i == 0){
                                                                        }else{
                                                                                _street += ' ';
                                                                        }
                                                                        _street += temp_array[i];
                                                                }
                                                        }
                                                } 
                                                _street_type_id = self.return_street_type_id(_street_type);
                                                                                                
                                                Ti.App.Properties.setBool('edit_address_flag',true);
                                                Ti.App.Properties.setString('edit_address_sub_number',_sub_number);
                                                Ti.App.Properties.setString('edit_address_unit_number',_unit_number);
                                                Ti.App.Properties.setString('edit_address_street_number',_street_number);
                                                Ti.App.Properties.setString('edit_address_street',_street);
                                                Ti.App.Properties.setString('edit_address_street_type',_street_type);
                                                Ti.App.Properties.setString('edit_address_suburb',_suburb);
                                                Ti.App.Properties.setString('edit_address_postcode',_postcode);
                                                Ti.App.Properties.setString('edit_address_state',_state);
                                                Ti.App.Properties.setString('edit_address_stateID',_stateID);
                                                Ti.App.Properties.setString('edit_address_street_type_id',_street_type_id);
                                                Ti.App.Properties.setString('edit_address_suburb_id',_suburb_id);
                                                Ti.App.Properties.setString('edit_address_latitudeText',latitudeText);
                                                Ti.App.Properties.setString('edit_address_longitudeText',longitudeText);         
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
                                                title:' Do you want to save address?'
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
                 *  override save_address function of parent class: fieldteam.js
                 */                  
                self.save_address = function(params){
                        try{
                                if(_is_click_main_menu_btn){
                                        self.close_all_window_and_return_to_menu(); 
                                }else{
                                        //use these code to keep street is only name with street type. e.g PITT
                                        if(self.trim(_street) != ''){
                                                var temp_array = _street.split(' ');
                                                if((temp_array.length > 1) && (_street_type != '') && ((temp_array[temp_array.length-1]).toLowerCase() == (_street_type).toLowerCase())){                                                                
                                                        _street = '';
                                                        for(var i=0;i<temp_array.length-1;i++){
                                                                if(i == 0){
                                                                }else{
                                                                        _street += ' ';
                                                                }
                                                                _street += temp_array[i];
                                                        }
                                                }
                                        }   
                                        Ti.App.Properties.setBool('edit_address_flag',true);
                                        Ti.App.Properties.setString('edit_address_sub_number',_sub_number);
                                        Ti.App.Properties.setString('edit_address_unit_number',_unit_number);
                                        Ti.App.Properties.setString('edit_address_street_number',_street_number);
                                        Ti.App.Properties.setString('edit_address_street',_street);
                                        Ti.App.Properties.setString('edit_address_street_type',_street_type);
                                        Ti.App.Properties.setString('edit_address_suburb',params.suburb);
                                        Ti.App.Properties.setString('edit_address_postcode',params.postcode);
                                        Ti.App.Properties.setString('edit_address_state',_state);
                                        Ti.App.Properties.setString('edit_address_stateID',_stateID);
                                        Ti.App.Properties.setString('edit_address_street_type_id',params.street_type_id);
                                        Ti.App.Properties.setString('edit_address_suburb_id',params.suburb_id);
                                        Ti.App.Properties.setString('edit_address_latitudeText',params.latitude);
                                        Ti.App.Properties.setString('edit_address_longitudeText',params.longitude);                                          
                                        win.close();                           
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.save_address');
                        }
                };                
                /**
                 *  update field value after set properties 
                 *  in focus event call it
                 */
                self.update_field_value_after_set_properites = function(){
                        try{                                                                                                
                                if(Ti.App.Properties.getBool('update_unique_code_with_search_edit_address_view_flag')){  
                                        
                                        _stateID = Ti.App.Properties.getString('update_unique_code_with_search_edit_address_view_id');
                                        _state = Ti.App.Properties.getString('update_unique_code_with_search_edit_address_view_content');
                                        if(_current_selected_row != null){
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _state;                                                       
                                        }                                      
                                        Ti.App.Properties.setBool('update_unique_code_with_search_edit_address_view_flag',false);
                                }   
                                if(Ti.App.Properties.getBool('get_suburb_postcode_state_info_from_add_new_suburb')){                                      
                                        _stateID = Ti.App.Properties.getString('get_suburb_postcode_state_info_from_add_new_suburb_state_id');
                                        _state = Ti.App.Properties.getString('get_suburb_postcode_state_info_from_add_new_suburb_state');
                                        _suburb_id = Ti.App.Properties.getString('get_suburb_postcode_state_info_from_add_new_suburb_suburb_id');
                                        _suburb = Ti.App.Properties.getString('get_suburb_postcode_state_info_from_add_new_suburb_suburb');
                                        _postcode = Ti.App.Properties.getString('get_suburb_postcode_state_info_from_add_new_suburb_postcode');
                                        Ti.App.Properties.setBool('get_suburb_postcode_state_info_from_add_new_suburb',false);
                                        if(_selected_suburb_field_object != null){
                                                _selected_suburb_field_object.value = _suburb; 
                                        }
                                        if(_selected_postcode_field_object != null){
                                                _selected_postcode_field_object.value = _postcode; 
                                        }
                                        if(_selected_state_field_object != null){
                                               _selected_state_field_object.text = _state; 
                                        }                                         
                                }                                   
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.update_field_value_after_set_properites');
                                return;
                        }
                }; 
                
                //private member
                var _sub_number = (win.sub_number === null)?'':win.sub_number;
                var _unit_number = (win.unit_number === null)?'':win.unit_number;
                var _street_number = (win.street_number === null)?'':win.street_number;
                var _street = (win.street === null)?'':win.street;
                var _street_type = (win.street_type === null)?'':win.street_type;
                var _street_type_id = (win.street_type_id === null)?0:win.street_type_id;
                var _suburb_id = (win.suburb_id === null)?0:win.suburb_id;
                var _suburb = (win.suburb === null)?'':win.suburb;
                var _postcode = (win.postcode === null)?'':win.postcode;
                var _state = (win.state === null)?'':win.state;
                var _stateID = (win.stateID === null)?2:win.stateID;
                var _state_abbr = '';
                var _current_field_num = 0;
                var _current_selected_row = null;
                _street = self.display_correct_street(_street,_street_type);
                var _is_sub_number_field_focused = false;
                var _is_unit_number_field_focused = false;
                var _is_street_number_field_focused = false;
                var _is_street_field_focused = false;
                var _is_suburb_field_focused = false;
                var _is_postcode_field_focused = false;
                var _selected_field_object = null;     
                var _is_click_main_menu_btn = false;
                var _selected_suburb_field_object = null;
                var _selected_postcode_field_object = null;
                var _selected_state_field_object = null;                

                //private method
                function _init_bottom_tool_bar(){
                        try{
                                var flexSpace = Titanium.UI.createButton({
                                        systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
                                });                                
                                
                                self.new_suburb_btn_bar = Titanium.UI.createButtonBar({
                                        labels:['Add New Suburb'],
                                        backgroundColor:'#336699'
                                });

                                var bottomToolBar = Ti.UI.iOS.createToolbar({
                                        items:[flexSpace,self.new_suburb_btn_bar],
                                        bottom:0,
                                        borderColor:self.tool_bar_color_in_ios_7,
                                        borderWidth:1,
                                        zIndex:100                                        
                                });
                                win.add(bottomToolBar);
                                
                                self.new_suburb_btn_bar.addEventListener('click',function(e){
                                        _add_new_suburb_btn_click_event();
                                });                             
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_bottom_tool_bar');
                                return;
                        }
                }        
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
                                        if(self.trim(_street) != ''){
                                                var temp_array = _street.split(' ');
                                                if(temp_array.length > 1){
                                                        _street_type = temp_array[temp_array.length-1];
                                                }
                                        }
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
                                var is_required_field = true;
                                var suburb_row = Ti.UI.createTableViewRow({
                                        className:'suburb',
                                        filter_class:'suburb'
                                });
                                var suburb_field_title = Ti.UI.createLabel({
                                        filter_class:'suburb_title',
                                        left:10,
                                        text:'Sector',
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
                                _selected_suburb_field_object = suburb_field;
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
                                _selected_postcode_field_object = postcode_field;
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
                        	var country_id = Ti.App.Properties.getString('selected_country_id');
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_locality_state WHERE id=? and locality_country_id=?',_stateID,country_id);
                                if(_stateID > 0){
                                        if(rows.getRowCount() > 0){
                                                if(rows.isValidRow()){
                                                        _state = rows.fieldByName('state');
                                                        _state_abbr = rows.fieldByName('state_abbr');
                                                }
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
                                        text:(_state == '')?'N/A':_state,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                _selected_state_field_object = state_field;
                                state_row.add(state_field);
                                self.data.push(state_row);    
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_state_field');
                                return;
                        }                                
                }
                /**
                 *  check correct or not when connect server
                 */
                function _check_address(new_addr,new_addr_state_and_country){
                        try{                                                             
                                if(Ti.Network.online){//if online then check the address is right or not
                                        self.display_indicator('Checking Address ...',true);
                                        var params = {
                                                user_id:Ti.App.Properties.getString('current_login_user_id'),
                                                company_id:Ti.App.Properties.getString('current_company_id'),
                                                hide_indicator:true,
                                                sub_number:_sub_number,
                                                unit_number:_unit_number,
                                                street_number:_street_number,
                                                street:_street,
                                                street_type:_street_type,
                                                suburb:_suburb,
                                                postcode:_postcode,
                                                state:_state,
                                                state_id:_stateID,
                                                new_addr:new_addr,
                                                new_addr_state_and_country:new_addr_state_and_country
                                        };
                                        Ti.API.info(params);
                                        self.check_address(params);                                        
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _check_address');
                                return;
                        }
                }
                /*
                 * click event for state
                 */
                function _event_for_state(e){
                        try{
                        	var country_id = Ti.App.Properties.getString('selected_country_id');
                                var client_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'base/select_unique_value_from_table_view_with_search_bar.js'),
                                        win_title:'Select State',
                                        table_name:'my_locality_state',//table name
                                        display_name:'state',//need to shwo field
                                        query_array:['id!=0','status_code=1','locality_country_id='+country_id],//query field
                                        fuzzy_query:'state',//fuzzy query's fields'
                                        content:_stateID,
                                        content_value:_state,
                                        source:'edit_address'
                                });
                                Titanium.UI.currentTab.open(client_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_state');
                                return;
                        }
                }
                /**
                 *  check if make any change
                 */
                function _check_if_exist_change(){
                        try{
                                if(_sub_number != win.sub_number){
                                        return true;
                                }
                                if(_unit_number != win.unit_number){
                                        return true;
                                }   
                                if(_street_number != win.street_number){
                                        return true;
                                }
                                if(_street != win.street){
                                        return true;
                                }    
                                if(_suburb != win.suburb){
                                        return true;
                                }
                                if(_postcode != win.postcode){
                                        return true;
                                }                                
                                if(_stateID != win.stateID){
                                        return true;
                                }        
                                return false;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _check_if_exist_change');
                                return false;
                        }
                }
                
                function _add_new_suburb_btn_click_event(){
                        try{
                                var suburb_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'base/add_suburb.js'),
                                        suburb_id:_suburb_id,
                                        suburb:_suburb,
                                        postcode:_postcode,
                                        state_id:_stateID,
                                        state:_state
                                });
                                Titanium.UI.currentTab.open(suburb_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _add_new_suburb_btn_click_event');
                                return;
                        }                        
                }                
        }

        win.addEventListener('focus',function(){
                try{                        
                        if(base_edit_address_page_obj === null){
                                Ti.App.Properties.setBool('edit_address_flag',false);
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                base_edit_address_page.prototype = new F();
                                base_edit_address_page.prototype.constructor = base_edit_address_page;
                                base_edit_address_page_obj = new base_edit_address_page();
                                base_edit_address_page_obj.init();
                        }else{
                                base_edit_address_page_obj.update_field_value_after_set_properites(); 
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{                                   
                        base_edit_address_page_obj.close_window();
                        base_edit_address_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());








