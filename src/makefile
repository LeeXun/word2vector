CC = gcc
#Using -Ofast instead of -O3 might result in faster code, but is supported only by newer GCC versions
CFLAGS = -lm -pthread -O3 -march=native -Wall -funroll-loops -Wno-unused-result -fno-stack-protector

all: word2vec word2phrase distance word-analogy compute-accuracy getSimilarWords getVectors getNeighbors binModel2JSON

word2vec : word2vec.c
	$(CC) word2vec.c -o word2vec $(CFLAGS)
word2phrase : word2phrase.c
	$(CC) word2phrase.c -o word2phrase $(CFLAGS)
distance : distance.c
	$(CC) distance.c -o distance $(CFLAGS)
word-analogy : word-analogy.c
	$(CC) word-analogy.c -o word-analogy $(CFLAGS)
compute-accuracy : compute-accuracy.c
	$(CC) compute-accuracy.c -o compute-accuracy $(CFLAGS)
	chmod +x *.sh

### getSimilarWords by leexun
getSimilarWords : getSimilarWords.c
	$(CC) getSimilarWords.c -o getSimilarWords $(CFLAGS)
### getSimilarWords by leexun

### getVectors by leexun
getVectors : getVectors.c
	$(CC) getVectors.c -o getVectors $(CFLAGS)
### getVectors by leexun

### getNeighbors by leexun
getNeighbors : getNeighbors.c
	$(CC) getNeighbors.c -o getNeighbors $(CFLAGS)
### getNeighbors by leexun

### binModel2JSON by leexun
binModel2JSON : binModel2JSON.c
	$(CC) binModel2JSON.c -o binModel2JSON $(CFLAGS)
### binModel2JSON by leexun

clean:
	rm -rf word2vec word2phrase distance word-analogy compute-accuracy getSimilarWords getVectors getNeighbors binModel2JSON
