export default class SimplePollForm extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["form"],
      closeOnSubmit: false,
      submitOnChange: true,
      submitOnClose: true,
      popOut: true,
      editable: game.user.isGM,
      width: 500,
      template: "modules/foundry-twitch-bot/templates/poll-dialog.html",
      id: "twitch-bot-poll-dialog",
      title: "Create Simple Vote",
    });
  }

  /**
   * This method is called upon form submission after form data is validated
   * @param event {Event}       The initial triggering submission event
   * @param formData {Object}   The object of validated form data with which to update the object
   * @private
   */
  async _updateObject(event, formData) {
    if (event.submitter?.name === "submit") {
      TriggerVote(formData["tbPollName"], formData["tbOptions"].split("\n"));
      Object.values(ui.windows).forEach((val) => {
        if (val.id === "twitch-bot-poll-dialog") val.close();
      });
    }

    // // Update sight layer
    // canvas.sight.refresh();

    console.log(event);
    console.log(formData);
  }
}
