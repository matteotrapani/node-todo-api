module.exports.insert = (collection, user) => {
  collection.insertOne(user).then(result => {
      console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
      console.log('Unable to fetch Users', err);
    });
}

module.exports.findUser = (collection, name) => {
  collection.find({name}).toArray().then((users) => {
      if (users.length == 0) {
        console.log(`No user found with name ${name}`);
      } else {
        console.log(`Users with name ${name}`);
        console.log(JSON.stringify(users, undefined, 2));
      }
    }, (err) => {
      console.log('Unable to fetch Users', err);
    });
}

module.exports.delete = (collection, name) => {
  collection.find({name}).toArray().then(users => {
      if (users.length == 0) {
        console.log(`No user found with name ${name}`);
      } else {
        console.log(JSON.stringify(users, undefined, 2));
        users.forEach(user => {
          db.collection('Users').findOneAndDelete({_id: new ObjectID(user._id)}).then(result => {
            console.log(result);
            console.log(`${result.value._id} - ${result.value.name} DELETED`);
          })
        });
      }
    }, err => {
      console.log('Unable to delete Users');
    });
}

module.exports.deleteAll = (collection, name) => {
  collection.deleteMany({name}).then(result => {
      console.log(result);
    }, err => {
      console.log('Unable to delete Users');
    });
}

module.exports.update = (collection, oldName, newName, incrementAmount) => {
  collection.findOneAndUpdate({name: oldName}, {
      $set: {
        name: newName
      }, 
      $inc: {
        age: incrementAmount
      }
    }, 
    {
      returnOriginal: false
    })
    .then(result => {
      console.log(result);
  });
}
