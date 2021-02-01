'use strict'
/**
 * The Main javascript function
 */
function BestSellingBooks(){
    /**
     * The init function is called after document on ready and initializes all the events
     */
    BestSellingBooks.prototype.init = () => {
        $('.modal').modal();
        setBtnVisible()
        bindEvents();
    };

    /**
     * The reloadPage functions reloads the page content after a CRUD operation.
     */
    function reloadPage(){
        var deferred = $.Deferred();
        var $parent = $('#div_parent');
        $.get('/reload').then((responseData) => {
            $parent.children().remove();
            $parent.append(responseData);
            bindEvents();
            return deferred.resolve();
        })
        .fail(() =>{
            return deferred.reject();
        });
        return deferred.promise();
    };

    /**
     * The bindEvents functions binds all the events in the page.
     */
    function bindEvents(){
        //Shows spinner loader on AJAX calls
        $(document).on({
            ajaxStart: function(){
                 $('#loader').removeClass('hidden');
                 $('body').addClass('loading');
            },
            ajaxStop: function(){ 
                $('#loader').addClass('hidden');
                $('body').removeClass('loading');
            }    
        });
        //bind events to the edit button.
        $('.btn-edit').on('click',(e) => {
            var data = JSON.parse($(e.currentTarget).parent().find('.inp_data').val());
            var dialogOptions = {
                dismissible: false
            };
            let dialog = new ItemEditDialog(dialogOptions, data);
            dialog.open();
        });
        //bind events to the delete button.
        $('.btn-delete').on('click', (e) => {
            var data = JSON.parse($(e.currentTarget).parent().find('.inp_data').val());
            var dialogOptions = {
                dismissible: false
            };
            let dialog = new ItemDeleteDialog(dialogOptions, data);
            dialog.open();
        });
        //binds events to the add button
        $('#btn_add').on('click', (e) => {
            var dialogOptions = {
                dismissible: false
            };
            let dialog = new ItemAddDialog(dialogOptions);
            dialog.open();
        });
    };

    /**
     * setBtnVisible handle the dialog button's visibility
     * @param {*} btnType 
     */
    function setBtnVisible(btnType){
        switch(btnType){
            case 'add':
                $('#btn_create').show();
                $('#btn_update').hide();
                $('#btn_delete').hide();
                break;
            case 'update':
                $('#btn_create').hide();
                $('#btn_update').show();
                $('#btn_delete').hide();
                break;
            case 'delete':
                $('#btn_create').hide();
                $('#btn_update').hide();
                $('#btn_delete').show();
                break;
            default:
                $('#btn_create').show();
                $('#btn_update').hide();
                $('#btn_delete').hide();
                break;
        }
    };

    /**
     * The ItemAddDialog functions generates a dialog that performs the Create operation.
     * @param {*} options 
     */
    function ItemAddDialog(options){
        var self =this;
        var data = {};

        /**
         * The onOpenEnd defines the dialog's title and text and binds the events of 
         * the dialog components.
         */
        ItemAddDialog.prototype.onOpenEnd = () =>{
            $('#op_title').text('Add:');
            setBtnVisible('add');
            bindDialogEvents();
        }

        /**
         * bindDialogEvents binds events to dialog component
         */
        function bindDialogEvents(){
            $('input').on('change paste keyup',(e) => {
                $(e.currentTarget).addClass('modified');
            });
            $('#btn_create').off('click');
            $('#btn_create').on('click',(e) => {
                if(!$('#modal1').find('input').hasClass('modified')){
                    M.Toast.dismissAll();
                    M.toast({html: 'No Changes has been made'});
                }else{
                    data.title = $('#em_title').val();
                    data.author = $('#em_author').val();
                    data.format = $('#em_format').val();
                    data.price = $('#em_price').val();
                    createData(data); // call to create operation
                }
            });
        };

        /**
         * The createData function creates the document in the mongodb database.
         * @param {*} data 
         */
        function createData(data){
            var deferred = $.Deferred();
            data = {
                ...data,
                rating: '0.0 out of 5 stars',
                num_of_reviews: '0',
                img_name: ''
            };
            $.ajax({
                contentType: 'application/json',
                data: JSON.stringify(data),
                dataType: 'json',
                type: 'POST',
                url: '/create_data'
            })
            .then(() => {
                return reloadPage();
            })
            .then(() => {
                $('#modal_create').modal('open');
                return deferred.resolve();
            }).fail(() => {
                return deferred.reject();
            });
            return deferred.promise();
        }

        var create_options = {
            ...options,
            onOpenEnd: self.onOpenEnd
        };

        //create and returns the base dialog with create options
        var dialog = new ItemDialog(create_options);
        return dialog;
    }

    /**
     * ItemEditDialog generates a dialog that performs the edit operation.
     * @param {*} options 
     * @param {*} data 
     */
    function ItemEditDialog(options, data){
        var self = this;

        /**
         * The onOpenEnd defines the dialog's title and text and binds the events of 
         * the dialog components.
         */
        ItemEditDialog.prototype.onOpenEnd = () => {
            $('#op_title').text('Edit:');
            setBtnVisible('update');
            $('#em_title').val(data.title);
            $('#em_author').val(data.author);
            $('#em_format').val(data.format);
            $('#em_price').val(data.price);
            bindDialogEvents();
            M.updateTextFields()
        };

        /**
         * bindDialogEvents binds events to dialog component
         */
        function bindDialogEvents(){
            $('input').on('change paste keyup',(e) => {
                $(e.currentTarget).addClass('modified');
            });
            $('#btn_update').off('click');
            $('#btn_update').on('click',(e) => {
                if(!$('#modal1').find('input').hasClass('modified')){
                    M.Toast.dismissAll();
                    M.toast({html: 'No Changes has been made'});
                }else{
                    data.title = $('#em_title').val();
                    data.author = $('#em_author').val();
                    data.format = $('#em_format').val();
                    data.price = $('#em_price').val();
                    updateData(data); //calls to the update the data in mongodb database
                }
            });
        };

        /**
         * updateData updates the document in the mongodb database.
         * @param {*} data 
         */
        function updateData(data){
            var deferred = $.Deferred();
            $.ajax({
                contentType: 'application/json',
                data: JSON.stringify(data),
                dataType: 'json',
                type: 'POST',
                url: '/update_data'
            })
            .then(() => {
                return reloadPage();
            })
            .then(() => {
                $('#modal_update').modal('open');
                return deferred.resolve();
            }).fail(() => {
                return deferred.reject();
            });
            return deferred.promise();
        };

        var edit_options = {
            ...options,
            onOpenEnd: self.onOpenEnd
        };

        //Creates a dialog with edit options.
        var dialog = new ItemDialog(edit_options);
        return dialog;
    };

    /**
     * ItemDeleteDialog generates a dialog that deletes a document in the database
     * @param {*} options 
     * @param {*} data 
     */
    function ItemDeleteDialog(options, data){
        var self = this;
        /**
         * onOpenEnd initializes and binds the delete dialog components.
         */
        ItemDeleteDialog.prototype.onOpenEnd = () => {
            $('#op_title').text('Delete:');
            setBtnVisible('delete');
            $('#em_title').val(data.title);
            $('#em_author').val(data.author);
            $('#em_format').val(data.format);
            $('#em_price').val(data.price);
            $('#modal1').find('input').attr('readonly', 'true');
            $('#modal1').find('input').attr('disabled', 'true');
            bindDialogEvents();
            M.updateTextFields()
        };

        /**
         * bindDialogEvents binds events of the delete dialog components.
         */
        function bindDialogEvents(){
            $('#btn_delete').off('click');
            $('#btn_delete').on('click',(e) => {
                deleteData(data)
            });
        }

        /**
         * deleteData deletes a document in the mongodb database.
         * @param {*} data 
         */
        function deleteData(data){
            var deferred = $.Deferred();
            $.ajax({
                contentType: 'application/json',
                data: JSON.stringify(data),
                dataType: 'json',
                type: 'POST',
                url: '/delete_data'
            })
            .then(() => {
                return reloadPage();
            })
            .then(() => {
                $('#modal_delete').modal('open');
                return deferred.resolve();
            }).fail(() => {
                return deferred.reject();
            });
            return deferred.promise();
        };

        var delete_options = {
            ...options,
            onOpenEnd: self.onOpenEnd
        };

        //Creates a dialog with delete options
        var dialog = new ItemDialog(delete_options);
        return dialog;
    }

    /**
     * ItemDialog generates a dialog materialize modal that acts as a base dialog.
     * @param {*} options 
     */
    function ItemDialog(options){
        var self = this;
        var $modal = $('#modal1');

        /**
         * opens the dialog
         */
        ItemDialog.prototype.open = () =>{
            $modal.modal('open');
        };

        /**
         * closes the dialog.
         */
        ItemDialog.prototype.close = () =>{
            $modal.modal('close');
        };

        /**
         * onCloseStart is called before a dialog is closed, it removes all the events and resets all the
         * values of the dialog before closing.
         */
        ItemDialog.prototype.onCloseStart = () => {
            $modal.find('input').each((id, elem)=>{
                $(elem).val('');
            });
            $modal.find('input').removeAttr('readonly');
            $modal.find('input').removeAttr('disabled');
            $modal.find('input').off();
            
            M.updateTextFields()
        };

        //creates a dialog with passed options.
        var opt = {
            ...options,
            onCloseStart: self.onCloseStart
        }
        $modal.modal(opt);
    };
};

/**
 * Creates an instance of BestSellingBooks once the document is loaded.
 */
$(() =>{
    var books = new BestSellingBooks();
    books.init();
});