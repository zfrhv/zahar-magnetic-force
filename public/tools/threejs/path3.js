export class Path3 {
  constructor(points) { // points: Array of floats: [x,y,z, x,y,z, x,y,z...]
    this.type = 'Path3'
    this.points = points
    this.getLength()
  }

  getLength() {
    let total_length = 0
    for(let point_index = 0; point_index < this.points.length - 3; point_index+=3) {
      total_length += this.distanceBetween(point_index, point_index+3)
    }
    this.total_length = total_length
    return total_length
  }

  setPoints(points) {
    this.points = points
    this.getLength()
    return this
  }

  getPoints(total_results) { // total_results: number of parts to split to (if 4 parts, then 5 points returned)
    let point_index = 0
    let length = 0
    const results = [this.points[0], this.points[1], this.points[2]]
    const stops_distance = 1/total_results * this.total_length

    for(let next_stop = stops_distance; next_stop <= this.total_length; next_stop += stops_distance) {
      while(length < next_stop) {
        length += this.distanceBetween(point_index, point_index+3)
        point_index += 3
      }
      const last_length = this.distanceBetween(point_index-3, point_index)
      // const part = (next_stop - (length - last_length)) / last_length
      const part = (next_stop - length) / last_length + 1 // simplified
      results.push(
        (this.points[point_index] - this.points[point_index-3])*part + this.points[point_index-3],
        (this.points[point_index+1] - this.points[point_index-2])*part + this.points[point_index-2],
        (this.points[point_index+2] - this.points[point_index-1])*part + this.points[point_index-1])
    }
    return results
  }

  distanceBetween(index1, index2) {
    return Math.hypot(
      this.points[index1] - this.points[index2],
      this.points[index1+1] - this.points[index2+1],
      this.points[index1+2] - this.points[index2+2])
  }
}