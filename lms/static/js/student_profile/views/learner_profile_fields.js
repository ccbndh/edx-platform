;(function (define, undefined) {
    'use strict';
    define([
        'gettext', 'jquery', 'underscore', 'backbone', 'js/views/fields', 'backbone-super'
    ], function (gettext, $, _, Backbone, FieldViews) {

        var LearnerProfileFieldViews = {};

        LearnerProfileFieldViews.AccountPrivacyFieldView = FieldViews.DropdownFieldView.extend({

            render: function () {
                this._super();
                this.message();
                this.updateFieldValue();
                return this;
            },

            message: function () {
                if (this.profileIsPrivate) {
                    this._super(interpolate_text(
                        gettext("You must specify your birth year before you can share your full profile. To specify your birth year, go to the {account_settings_page_link}"),
                        {'account_settings_page_link': '<a href="' + this.options.accountSettingsPageUrl + '">' + gettext('Account Settings page.') + '</a>'}
                    ));
                } else if (this.requiresParentalConsent) {
                    this._super(interpolate_text(
                        gettext('You must be over 13 to share a full profile. If you are over 13, make sure that you have specified a birth year on the {account_settings_page_link}'),
                        {'account_settings_page_link': '<a href="' + this.options.accountSettingsPageUrl + '">' + gettext('Account Settings page.') + '</a>'}
                    ));
                }
                else {
                    this._super('');
                }
                return this._super();
            },

            updateFieldValue: function() {
                if (!this.isAboveMinimumAge) {
                    this.$('.u-field-value select').val('private');
                    this.disableField(true);
                }
            }
        });

        LearnerProfileFieldViews.ProfileImageFieldView = FieldViews.ImageFieldView.extend({

            imageUrl: function () {
                return this.model.profileImageUrl();
            },

            imageAltText: function () {
                return interpolate_text(gettext("Profile image for {username}"), {username: this.model.get('username')});
            },

            imageChangeSucceeded: function (e, data) {
                var view = this;
                // Update model to get the latest urls of profile image.
                this.model.fetch().done(function () {
                    view.setCurrentStatus('');
                }).fail(function () {
                    view.showErrorMessage(view.errorMessage);
                });
            },

            imageChangeFailed: function (e, data) {
                this.setCurrentStatus('');
                 if (_.contains([400, 404], data.jqXHR.status)) {
                    try {
                        var errors = JSON.parse(data.jqXHR.responseText);
                        this.showErrorMessage(errors.user_message);
                    } catch (error) {
                        this.showErrorMessage(this.errorMessage);
                    }
                } else {
                    this.showErrorMessage(this.errorMessage);
                }
                this.render();
            },

            showErrorMessage: function (message) {
                this.options.messageView.showMessage(message);
            },

            isEditingAllowed: function () {
                return this.model.isAboveMinimumAge();
            },

            isShowingPlaceholder: function () {
                return !this.model.hasProfileImage();
            },

            clickedRemoveButton: function (e, data) {
                this.options.messageView.hideMessage();
                this._super(e, data);
            },

            fileSelected: function (e, data) {
                this.options.messageView.hideMessage();
                this._super(e, data);
            }
        });

        return LearnerProfileFieldViews;
    })
}).call(this, define || RequireJS.define);
