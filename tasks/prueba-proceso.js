let task = cron.schedule(
    '* * * * *', // TO DO: actualiza cuando corre
    () => {
      console.log("SE EJECUTO EL PROCESO")
    },
    {
      scheduled: true,
      timezone: 'America/Argentina/Buenos_Aires',
    }
  ); 
task.start();