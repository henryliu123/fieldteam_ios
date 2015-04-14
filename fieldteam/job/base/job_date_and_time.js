/**
 *  Description: date and time picker
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;       
        var base_job_date_and_time_page_obj = null;
    
        function base_job_date_and_time_page(){
                var self = this;
                var window_source = 'base_job_date_and_time_page';
                win.title = 'Date and Time';

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
                                self.init_vars();                               
                                self.init_table_view();
                                _show_date_picker();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }
                };
                /**
                 *  override init_table_view function of parent class: fieldteam.js
                 */                     
                self.init_table_view = function(){
                        try{
                                self.table_view = Ti.UI.createTableView({
                                        data:self.data,
                                        scrollable:false,
                                        style: Ti.UI.iPhone.TableViewStyle.GROUPED,
                                        allowsSelection:true
                                });
                                win.add(self.table_view);
                                self.table_view.selectRow(0);

                                self.table_view.addEventListener('click',function(e){
                                        self.table_view_click_event(e);
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_table_view');
                                return;
                        }
                };
                /**
                 *  override init_vars function of parent class: fieldteam.js
                 */                  
                self.init_vars = function(){
                        try{
                                if(_temp_calendar_hours >= 12){
                                        if(_temp_calendar_hours > 12){
                                                _temp_calendar_hours -= 12;
                                        }
                                        _calendar_date_ampm = 'PM';
                                }

                                self.date_row = Ti.UI.createTableViewRow({
                                        title:self.day_list[_calendar_date_day]+', '+_calendar_date_date+' '+self.month_list[_calendar_date_month]+' '+_calendar_date_year,
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size
                                        }
                                });
                                self.data.push(self.date_row);

                                var time_row = Ti.UI.createTableViewRow({
                                        title:((_temp_calendar_hours<=9)?'0'+_temp_calendar_hours:_temp_calendar_hours)+
                                        ':'+((_calendar_date_minutes <=9)?'0'+_calendar_date_minutes:_calendar_date_minutes)+' '+
                                        _calendar_date_ampm,
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size
                                        }
                                });
                                self.data.push(time_row);                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }
                };
                /**
                 *  override table_view_click_event function of parent class: fieldteam.js
                 */                       
                self.table_view_click_event = function(e){
                        try{
                                var index = e.index;
                                switch(index){
                                        case 0:
                                                _show_date_picker();
                                                break;
                                        case 1:
                                                _show_time_picker();
                                                break;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }                        
                };
                /**
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                      
                self.nav_right_btn_click_event = function(e){
                        try{
                                if(_calendar_date_ampm.toLowerCase() === 'pm'){
                                        if(_calendar_date_hours == 12){

                                        }else{
                                                _calendar_date_hours +=12;
                                        }
                                }
                                var temp_month = ((_calendar_date_month+1) <=9)?'0'+(_calendar_date_month+1):(_calendar_date_month+1);
                                var temp_date = (_calendar_date_date <=9)?'0'+_calendar_date_date:_calendar_date_date;
                                var temp_hours = (_calendar_date_hours <=9)?'0'+_calendar_date_hours:_calendar_date_hours;
                                var temp_mins = (_calendar_date_minutes <=9)?'0'+_calendar_date_minutes:_calendar_date_minutes;
                                Ti.App.Properties.setBool('update_job_date_and_time_'+win.source+'_view_flag',true); 
                                Ti.App.Properties.setString('update_job_date_and_time_'+win.source+'_view_content',_calendar_date_year+'-'+temp_month+'-'+temp_date+' '+temp_hours+':'+temp_mins+':00');                                                             
                                win.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }
                };                 

                //private member       
                var _calendar_date = null;
                if((win.content <= 0)||(win.content === null)){
                        _calendar_date = new Date();
                }else{
                        _calendar_date = new Date(win.content*1000);
                }
                var _calendar_date_year = _calendar_date.getFullYear();
                var _calendar_date_month = _calendar_date.getMonth();
                var _calendar_date_date = _calendar_date.getDate();
                var _calendar_date_day = _calendar_date.getDay();
                var _calendar_date_hours = _calendar_date.getHours();
                var _calendar_date_minutes = _calendar_date.getMinutes();
                var _temp_calendar_hours = _calendar_date_hours;
                var _calendar_date_ampm = 'AM';
                var _date_picker = null;
                var _time_picker = null;
                if(_calendar_date_hours >= 12){
                        if(_calendar_date_hours > 12){
                                _calendar_date_hours -= 12;
                        }
                        _calendar_date_ampm = 'PM';
                }
                if(_calendar_date_minutes <= 15){
                        _calendar_date_minutes = 15;
                }else{
                        if(_calendar_date_minutes <= 30){
                                _calendar_date_minutes = 30;
                        }else{
                                _calendar_date_minutes = 45;
                        }
                }

                /**
                 * display date picker
                 */
                function _show_date_picker(){
                        try{
                                if(_date_picker != null){
                                        win.remove(_date_picker);
                                        _date_picker = null;
                                }
                                var minDate = new Date();
                                minDate.setFullYear(_calendar_date_year-5);
                                minDate.setMonth(0);
                                minDate.setDate(1);

                                var maxDate = new Date();
                                maxDate.setFullYear(_calendar_date_year+5);
                                maxDate.setMonth(11);
                                maxDate.setDate(31);

                                var value = new Date();
                                value.setFullYear(_calendar_date_year);
                                value.setMonth(_calendar_date_month);
                                value.setDate(_calendar_date_date);
                                value.setHours(_calendar_date_hours);
                                value.setMinutes(_calendar_date_minutes);

                                _date_picker = Ti.UI.createPicker({
                                        bottom:0,
                                        type:Ti.UI.PICKER_TYPE_DATE,
                                        minDate:minDate,
                                        maxDate:maxDate,
                                        value:value
                                });
                                _date_picker.selectionIndicator = true;
                                _date_picker.setLocale(Titanium.Platform.locale);
                                win.add(_date_picker);
                                                                
                                _date_picker.addEventListener('change',function(e){
                                        self.table_view.selectRow(0);
                                        var newDateValue = new Date(e.value);
                                        _calendar_date_year = newDateValue.getFullYear();
                                        _calendar_date_month = newDateValue.getMonth();
                                        _calendar_date_date = newDateValue.getDate();
                                        _calendar_date_day = newDateValue.getDay();
                                        self.date_row.title = self.day_list[_calendar_date_day]+', '+_calendar_date_date+' '+self.month_list[_calendar_date_month]+' '+_calendar_date_year;
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _show_date_picker');
                                return;
                        }
                }
                /**
                 * display time picker
                 */
                function _show_time_picker(){
                        try{
                                if(_time_picker != null){
                                        win.remove(_time_picker);
                                        _time_picker = null;
                                }
                                /**
                                     *  add 3 columns,
                                     *  1. Hours
                                     *  2. Minutes
                                     *  3. AM or PM
                                     */
                                var row = null;
                                var label = null;
                                var hour_column = Ti.UI.createPickerColumn({
                                        opacity:0
                                });
                                for(var i=0,j=13;i<j;i++){
                                        row = Ti.UI.createPickerRow({
                                                custom_value:i,
                                                selected:((i === _calendar_date_hours)?true:false)
                                        });
                                        label = Ti.UI.createLabel({
                                                text:(i <= 9)?'0'+i:i,
                                                font:{
                                                        fontSize:24,
                                                        fontWeight:'bold'
                                                },
                                                textAlign:'center',
                                                width:'auto',
                                                height:'auto'
                                        });
                                        row.add(label);
                                        hour_column.addRow(row);
                                }

                                if(_calendar_date_minutes <= 15){
                                        _calendar_date_minutes = 15;
                                }else{
                                        if(_calendar_date_minutes <= 30){
                                                _calendar_date_minutes = 30;
                                        }else{
                                                _calendar_date_minutes = 45;
                                        }
                                }
                                var mins_array = [0,15,30,45];
                                var minute_column = Ti.UI.createPickerColumn();
                                var init_mins_index = 0;
                                for(i=0,j=mins_array.length;i<j;i++){
                                        if(mins_array[i] === _calendar_date_minutes){
                                                init_mins_index = i;
                                        }
                                        row = Ti.UI.createPickerRow({
                                                custom_value:mins_array[i],
                                                selected:((mins_array[i] === _calendar_date_minutes)?true:false)
                                        });
                                        label = Ti.UI.createLabel({
                                                text:(i===0)?'00':mins_array[i],
                                                font:{
                                                        fontSize:24,
                                                        fontWeight:'bold'
                                                },
                                                textAlign:'center',
                                                width:'auto',
                                                height:'auto'
                                        });
                                        row.add(label);
                                        minute_column.addRow(row);   
                                }

                                var ampm_column = Ti.UI.createPickerColumn();
                                var init_ampm_index = 0;
                                ampm_column.addRow(Ti.UI.createPickerRow({
                                        title:'AM',
                                        touchEnabled:false,
                                        custom_value:'am',
                                        fontSize:24,
                                        selected:((_calendar_date_hours > 11)?false:true)
                                }));
                                ampm_column.addRow(Ti.UI.createPickerRow({
                                        title:'PM',
                                        touchEnabled:false,
                                        custom_value:'pm',
                                        fontSize:24,
                                        selected:((_calendar_date_hours > 11)?true:false)
                                }));
                                if(_calendar_date_ampm === 'PM'){
                                        init_ampm_index = 1;
                                }else{
                                        init_ampm_index = 0;
                                }

                                _time_picker = Ti.UI.createPicker({
                                        bottom:0
                                });
                                _time_picker.selectionIndicator = true;
                                _time_picker.add([hour_column,minute_column,ampm_column]);
                                win.add(_time_picker);

                                //set init status
                                _time_picker.setSelectedRow(0,_calendar_date_hours,true);
                                _time_picker.setSelectedRow(1,init_mins_index,true);
                                _time_picker.setSelectedRow(2,init_ampm_index,true);

                                _time_picker.addEventListener('change',function(e){                
                                        switch(e.columnIndex){
                                                case 0://hours
                                                        _calendar_date_hours = e.row.custom_value;
                                                        break;
                                                case 1://minutes
                                                        _calendar_date_minutes = e.row.custom_value;
                                                        break;
                                                case 2://ampm
                                                        _calendar_date_ampm = (e.row.custom_value).toUpperCase();
                                                        break;
                                        }
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _show_time_picker');
                                return;
                        }
                }
        }

        win.addEventListener('open',function(){
                try{
                        Ti.App.Properties.setBool('update_job_date_and_time_'+win.source+'_view_flag',false); 
                        if(base_job_date_and_time_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                base_job_date_and_time_page.prototype = new F();
                                base_job_date_and_time_page.prototype.constructor = base_job_date_and_time_page;
                                base_job_date_and_time_page_obj = new base_job_date_and_time_page();
                                base_job_date_and_time_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        base_job_date_and_time_page_obj.close_window();
                        base_job_date_and_time_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());









