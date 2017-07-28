var table;

$(document).ready(function() {

  firebase.auth().onAuthStateChanged(user => {
    console.log(user);
    if (user) {
      window.user = user
      table = $('#history').DataTable();
      firebase.database().ref(`/${user.uid}/history`).off()
      firebase.database().ref(`/${user.uid}/history`).on('child_added', add_history);
    } else {
      window.user = null;
    }
  });
});

function add_history(snap) {
  if (!snap.val()) return;
  var value = snap.val();

  var date = new Date(value.timestamp).toISOString().slice(0, 16).replace('T', ' ')

  table.row.add([value.item_name, date, value.quantity]).draw();
}

function add_new_item() {
  var item_name = $('#new_item').val();
  var quantity = $('#quantity').val();
  if (!item_name) return;
  if(!quantity) return;

  if (!window.user) {
    console.warn('no user!')
    return;
  }

  $('#new_item').val('');
  $('#quantity').val('');


  var location = getLocation()

function add_item_to_db(item_name) {
  var data = {
    item_name: item_name,
    quantity: quantity,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    location: location
  }
  firebase.database().ref(`/${window.user.uid}/history`).push(data);
  firebase.database().ref(`/${window.user.uid}/item_count`).once("value").then((snap) => {
    if (snap.val() == null) {
      firebase.database().ref(`/${window.user.uid}/item_count`).push(-Math.abs(quantity));
    }
    firebase.database().ref(`/${window.user.uid}/item_count`).set(snap.val() - quantity);
  });



}

function change_status() {
  var status = $('#status').is(':checked')

  if (!window.user) {
    console.warn('no user!')
    return;
  }

  firebase.database().ref(`/${window.user.uid}/status`).once("value").then((snap) => {
    firebase.database().ref(`/${window.user.uid}/status`).set(status);
  });
}



function sign_in() {
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
}

function add_new_item() {
  var item_name = $('#new_item').val();

  if (!item_name) return;

  if (!window.user) {
    console.warn('no user!')
    return;
  }

  $('#new_item').val('');

  add_item_to_db(item_name);
}
