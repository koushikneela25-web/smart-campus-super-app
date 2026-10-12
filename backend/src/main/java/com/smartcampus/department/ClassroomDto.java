package com.smartcampus.department;

public class ClassroomDto {
    private Long id;
    private String roomNumber;
    private String building;
    private Integer capacity;

    public ClassroomDto() {}
    public ClassroomDto(Classroom c) {
        this.id = c.getId();
        this.roomNumber = c.getRoomNumber();
        this.building = c.getBuilding();
        this.capacity = c.getCapacity();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
}
