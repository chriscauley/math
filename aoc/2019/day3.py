test0 = "R8,U5,L5,D3\nU7,R6,D4,L4"
test1 = "R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83"
test2 = "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7"

with open('3.txt', 'r') as f:
    prod = f.read()

W = 1e6 # it looks like 999 is highest index, a million should beep us far away from the edges

map1 = {}
map2 = {}

def xy2i(xy, W):
    return xy[1] * W + xy[0]

def i2xy(i, W):
    return [i % W, int(i/W)]

def get_distance(i1, i2, W):
    xy1 = i2xy(i1, W)
    xy2 = i2xy(i2, W)
    return abs(xy1[0] - xy2[0]) + abs(xy1[1] - xy2[1])

def tracewire(wire_pattern, W):
    dindexes = {
        'U': -W,
        'D': W,
        'R': 1,
        'L': -1,
    }

    wire_map = {}
    path = []
    current_index = W * W - W
    wire_map['start'] = current_index
    for note in wire_pattern.split(','):
        direction = note[0]
        length = int(note[1:])
        for i in range(length):
            wire_map[current_index] = len(path)
            path.append(current_index)
            current_index += dindexes[direction]
    wire_map['path'] = path
    return wire_map

def draw(map1, map2, W):
    out = ''
    for ir in range(W*2):
        for ic in range(W):
            index = ir * W + ic
            if index in map1:
                if index in map2:
                    out += ('+')
                else:
                    out += '1'
            elif index in map2:
                out += '2'
            else:
                out += ' '
        out += '\n'
    print(out)

def get_crossings(paths, W):
    path1, path2 = paths.strip().split('\n')
    map1 = tracewire(path1, W)
    map2 = tracewire(path2, W)

    print('MAP!')
    # draw(map1, map2, W)
    distances = []
    steps = []
    for index1 in map1['path'][1:]:
        if index1 in map2:
            distances.append(get_distance(index1, map1['start'], W))
            steps.append(map1[index1] + map2[index1])
    print('shortest to origin', min(distances))
    print('shortest steps', min(steps))


get_crossings(test0, 10)
get_crossings(test1, 400)
get_crossings(test2, 400)
get_crossings(prod, 10000000)