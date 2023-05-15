/*
  A Scheduled Trigger will always call a function without arguments.
  Documentation on Triggers: https://www.mongodb.com/docs/atlas/app-services/triggers/overview/

  Functions run by Triggers are run as System users and have full access to Services, Functions, and MongoDB Data.

  Access a mongodb service:
  const collection = context.services.get(<SERVICE_NAME>).db("db_name").collection("coll_name");
  const doc = collection.findOne({ name: "mongodb" });

  Note: In Atlas Triggers, the service name is defaulted to the cluster name.

  Call other named functions if they are defined in your application:
  const result = context.functions.execute("function_name", arg1, arg2);

  Access the default http client and execute a GET request:
  const response = context.http.get({ url: <URL> })

  Learn more about http client here: https://www.mongodb.com/docs/atlas/app-services/functions/context/#std-label-context-http
*/

// Remove dot notation when saving Trigger to MongoDB Atlas
exports.ResetGlobalWeeklyProg = async function() {
  /*
    Trigger Type = Scheduled
    Skip Events on Re-Enable = true
    Schedule Type = Basic - Repeat once by Day of the Week on Monday
    Link Data Source -> select TaskBud cluster
    Event Type = Function
  */
  
  const db = context.services.get(`SERVICE_NAME`).db(`DB_NAME`); // Replace SERVICE_NAME with cluster name and DB_NAME with database name.
  const listCollection = db.collection("task-lists");
  const userCollection = db.collection("users");
  
  const taskLists = await listCollection.find().toArray();

  taskLists.forEach((list) => {
    let newTotal = list.weeklyTotal - list.weeklyCompleted;
    let newCompleted = 0;
    
    listCollection.updateOne(
      { _id: list._id },
      { $set: {
          weeklyTotal: newTotal,
          weeklyCompleted: newCompleted
        }
      }
    )
    .then(() => {
      userCollection.updateOne(
        { _id : list.owner_id },
        { $set: {
            progress: newCompleted / newTotal || 0.0
          }
        }
      );
      return;
    });
  });
};

exports.ClearGlobalCompletedTasksDaily = async function() {
  /*
    Trigger Type = Scheduled
    Skip Events on Re-Enable = true
    Schedule Type = Advanced - 59 23 * * *
    Link Data Source -> select TaskBud cluster
    Event Type = Function
  */
  
  const db = context.services.get(`SERVICE_NAME`).db(`DB_NAME`); // Replace SERVICE_NAME with cluster name and DB_NAME with database name.
  const listCollection = db.collection("task-lists");

  const taskLists = await listCollection.find().toArray();

  taskLists.forEach((list) => {
    listCollection.updateOne(
      { _id: list._id },
      { $pull: {
          tasks: {
            completed: true 
          }
        }
      }
    );
  });
};