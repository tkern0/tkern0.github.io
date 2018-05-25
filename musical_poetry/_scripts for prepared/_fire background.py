import random

# LENGTH = 249950
START = 25500
END = 257000
BPM = 160
WIDTH = 768
HEIGHT = 432

def clamp(n, min_val=0, max_val=255): return max(min(n, max_val), min_val)

pos = random.randint(-WIDTH/4, 0)
xValues = [pos]
while pos < WIDTH * 1.25:
    pos += clamp(int(random.gauss(WIDTH/8, WIDTH/16)), WIDTH/64, 15*WIDTH/64)
    xValues.append(pos)
while xValues[0] < 0 and xValues[1] < 0: xValues = xValues[1:]
while xValues[-1] < WIDTH and xValues[-2] < WIDTH: xValues = xValues[:-1]
yValues = [2*HEIGHT/3 for _ in range(len(xValues))]

output = open("_out", "w")
beat_time = int((60000/BPM)/4)
frame_time = 33
for beat in range(START, END, beat_time):
    jumpAmount = []
    for _ in yValues:
        jumpAmount.append(random.gauss(0, 100)/(beat_time/frame_time))
    for time in range(beat, beat + beat_time, frame_time):
        output.write("Time: {}, {}\n".format(time, time + frame_time))
        for i in range(len(xValues)-1):
            output.write("Line: -1, #9c2000, {}, {}, {}, {}\n".format(int(xValues[i]), int(yValues[i]) - 200, int(xValues[i+1]), int(yValues[i + 1]) - 200))
            output.write("Line: -1, #d86f05, {}, {}, {}, {}\n".format(int(xValues[i]), int(yValues[i]) - 100, int(xValues[i+1]), int(yValues[i + 1]) - 100))
            output.write("Line: -1, #ffc100, {}, {}, {}, {}\n".format(int(xValues[i]), int(yValues[i]), int(xValues[i+1]), int(yValues[i + 1])))
        for i in range(len(yValues)):
            yValues[i] = clamp(yValues[i] + jumpAmount[i], 220, HEIGHT + 220)

output.close()