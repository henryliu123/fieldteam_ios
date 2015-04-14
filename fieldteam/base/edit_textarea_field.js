/**
 *  Description: textarea editor
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;    
        var base_edit_textarea_page_obj = null;

        function base_edit_textarea_page(){
                var self = this;
                var window_source = 'base_edit_textarea_page';
                win.title = (win.title === undefined)?'Edit Description':win.title;

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
                                //call init_table_view function of parent class: fieldteam.js
                                if(!self.is_ios_7_plus()){
                                        _init_textarea_field();
                                        self.init_table_view();
                                }else{
                                        _init_textarea_field_for_ios7();
                                }    
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
                                if(self.trim(_value).length <=0){
                                        self.show_message('Please enter text.');
                                        return;
                                }
                                
                                if(e.index == self.default_main_menu_button_index){//menu menu
                                        self.close_all_window_and_return_to_menu(); 
                                }else{
                                        if(_check_if_exist_change()){                               
                                                Ti.App.Properties.setBool('update_edit_textarea_field_'+win.source+'_view_flag',true); 
                                                Ti.App.Properties.setString('update_edit_textarea_field_'+win.source+'_view_content',_value); 
                                        }
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
                                if(_check_if_exist_change()){
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

                //private member                
                var _value = ((win.content === undefined) || (win.content === null))?'':win.content;


                //private method
                /**
                 *  init job description textarea field
                 */
                function _init_textarea_field(){
                        try{
                                var description_field = Ti.UI.createTableViewRow({
                                        className:'set_textarea_field',
                                        filter_class:'set_textarea_field',
                                        height:'auto'
                                });
                                var textarea_content_field = Ti.UI.createTextArea({
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:150,
                                        textAlign:'left',
                                        top:5,
                                        bottom:5,
                                        left:10,
                                        right:10,
                                        value:_value,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                description_field.add(textarea_content_field);
                                self.data.push(description_field);
                                textarea_content_field.addEventListener('change',function(e){                                        
                                        _value = e.value;
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_textarea_field');
                                return;
                        }
                }
                function _init_textarea_field_for_ios7(){
                        try{
                                var textarea_content_field = Ti.UI.createTextArea({
                                        borderWidth: 1, borderColor: '#ccc', borderRadius: 5,
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:150,
                                        textAlign:'left',
                                        top:5,
                                        bottom:5,
                                        left:10,
                                        right:10,
                                        value:_value,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                win.add(textarea_content_field);
                                textarea_content_field.addEventListener('change',function(e){                                        
                                        _value = e.value;
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_textarea_field_for_ios7');
                                return;
                        }
                }                
                /**
                 *  check if exist any change
                 */
                function _check_if_exist_change(){
                        try{
                                var is_make_changed = false;
                                if(_value != win.content){
                                        is_make_changed = true;
                                }
                                return is_make_changed;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _check_if_exist_change');
                                return false; 
                        }   
                }  
        }

        win.addEventListener('open',function(){
                try{                                        
                        if(base_edit_textarea_page_obj === null){
                                Ti.App.Properties.setBool('update_edit_textarea_field_'+win.source+'_view_flag',false); 
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                base_edit_textarea_page.prototype = new F();
                                base_edit_textarea_page.prototype.constructor = base_edit_textarea_page;
                                base_edit_textarea_page_obj = new base_edit_textarea_page();
                                base_edit_textarea_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{                        
                        base_edit_textarea_page_obj.close_window();
                        base_edit_textarea_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());








