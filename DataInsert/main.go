package main

import (
	"DataInsert/config"
	"DataInsert/database"
	"DataInsert/insert"
	"fmt"
	"log"
)

func main()  {
	fmt.Println("Main Function! ");

	cfg := config.LoadConfig()

	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	//insert.StudentDataInsert(db);
	//insert.TeacherDataInsert(db);
	insert.AttendanceDataInsert(db);
}