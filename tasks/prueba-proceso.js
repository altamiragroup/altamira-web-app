let task = cron.schedule(
    '1/1 * * * *', // TO DO: actualiza cuando corre
    () => {
      console.log("SE EJECUTO EL PROCESO")
    },
    {
      scheduled: true,
      timezone: 'America/Argentina/Buenos_Aires',
    }
  ); 
task.start();