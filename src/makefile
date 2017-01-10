CC = gcc
#Using -Ofast instead of -O3 might result in faster code, but is supported only by newer GCC versions
CFLAGS = -lm -pthread -O3 -march=native -Wall -funroll-loops -Wno-unused-result -fno-stack-protector

all: word2vec word2phrase distance word-analogy compute-accuracy getSimilar getVectors getNearests

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

### getSimilar by leexun
getSimilar : getSimilar.c
	$(CC) getSimilar.c -o getSimilar $(CFLAGS)
### getSimilar by leexun

### getVectors by leexun
getVectors : getVectors.c
	$(CC) getVectors.c -o getVectors $(CFLAGS)
### getVectors by leexun

### getNearests by leexun
getNearests : getNearests.c
	$(CC) getNearests.c -o getNearests $(CFLAGS)
### getNearests by leexun

clean:
	rm -rf word2vec word2phrase distance word-analogy compute-accuracy
