//  Copyright 2013 Google Inc. All Rights Reserved.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.

#include <stdio.h>
#include <string.h>
#include <math.h>
#include <stdlib.h>

const long long max_size = 2000;         // max length of strings
const long long N = 40;                  // number of closest words that will be shown
const long long max_w = 50;              // max length of vocabulary entries

int ArgPos(char *str, int argc, char **argv) {
  int a;
  for (a = 1; a < argc; a++) if (!strcmp(str, argv[a])) {
    if (a == argc - 1) {
      printf("Argument missing for %s\n", str);
      exit(1);
    }
    return a;
  }
  return -1;
}

int split(char **arr, char *str, const char *del) {
  char *s = strtok(str, del);
  int count = 0;
  while(s != NULL) {
     *arr++ = s;
     s = strtok(NULL, del);
     count ++;
  }
  return count;
}

int main(int argc, char **argv) {
  FILE *f;
  char *bestw[N];
  char file_name[max_size];
  float dist, len, bestd[N], vec[max_size];
  long long words, size, a, b, c, d, cn, bi[100];
  float *M;
  char *vocab;
  if (argc < 2) {
    printf("Usage: ./distance <FILE>\nwhere FILE contains word projections in the BINARY FORMAT\n");
    return 0;
  }
  int fnp = ArgPos((char *)"-f", argc, argv);
  strcpy(file_name, argv[fnp+1]);
  int isbinary = ArgPos((char *)"-b", argc, argv);
  // printf("%d\n\n", isbinary);
  if(isbinary != -1 && atoi(argv[isbinary+1]) == 0)
  {
    f = fopen(file_name, "r");
  }
  else f = fopen(file_name, "rb");

  if (f == NULL) {
    printf("Input file not found\n");
    return -1;
  }
  fscanf(f, "%lld", &words);
  fscanf(f, "%lld", &size);
  vocab = (char *)malloc((long long)words * max_w * sizeof(char));
  for (a = 0; a < N; a++) bestw[a] = (char *)malloc(max_size * sizeof(char));
  M = (float *)malloc((long long)words * (long long)size * sizeof(float));
  if (M == NULL || vocab == NULL) {
    printf("Cannot allocate memory: %lld MB    %lld  %lld\n", (long long)words * size * sizeof(float) / 1048576, words, size);
    return -1;
  }
  for (b = 0; b < words; b++) {
    a = 0;
    while (1) {
      vocab[b * max_w + a] = fgetc(f);
      if (feof(f) || (vocab[b * max_w + a] == ' ')) break;
      if ((a < max_w) && (vocab[b * max_w + a] != '\n')) a++;
    }
    vocab[b * max_w + a] = 0;
    // if(!isbinary) fscanf(f, "%s", &vocab[b * max_w]);
    for (a = 0; a < size; a++) fread(&M[a + b * size], sizeof(float), 1, f);
    len = 0;
    for (a = 0; a < size; a++) len += M[a + b * size] * M[a + b * size];
    len = sqrt(len);
    for (a = 0; a < size; a++) M[a + b * size] /= len;
  }
  fclose(f);

  // i 代表第 i 個參數, 嘗試看看寫可以吃 n 個, 或是讓他 call n 次

  // int argcCount = 0;
  // while (argcCount > 0) {
    int i = 0, e = 1;
    const char *del = ",";
    for (a = 0; a < N; a++) bestd[a] = 0;
    for (a = 0; a < N; a++) bestw[a][0] = 0;
    i = ArgPos((char *)"-v", argc, argv);
    for(a = 0; a < strlen(argv[i+1]); a++)
    { // count , in argv
      if(argv[i+1][a] == ',') e++;
    }
    // printf("%d", e);
    char **arr;
    arr = (char **)malloc(2*size*sizeof(float)); // 這邊原本不夠大
    // getNearests(81819,0x7fff997203c0) malloc:
    // *** error for object 0x7ffb2c402778: incorrect checksum for freed object - object was probably modified after being freed.
    // *** set a breakpoint in malloc_error_break to debug
    split(arr, argv[i+1], del);
    for(a=0; a<size; a++) vec[a] = atof(arr[a]);
    // for(a=0; a<size; a++) printf("%f ", vec[a]);
    free(arr);
    cn = 1;
    b = 0;
    c = 0;
    len = 0;
    for (a = 0; a < size; a++) len += vec[a] * vec[a];
    len = sqrt(len);
    for (a = 0; a < size; a++) vec[a] /= len;
    for (a = 0; a < N; a++) bestd[a] = -1;
    for (a = 0; a < N; a++) bestw[a][0] = 0;
    for (c = 0; c < words; c++) {
      a = 0;
      for (b = 0; b < cn; b++) if (bi[b] == c) a = 1;
      if (a == 1) continue;
      dist = 0;
      for (a = 0; a < size; a++) dist += vec[a] * M[a + c * size];
      for (a = 0; a < N; a++) {
        if (dist > bestd[a]) {
          for (d = N - 1; d > a; d--) {
            bestd[d] = bestd[d - 1];
            strcpy(bestw[d], bestw[d - 1]);
          }
          bestd[a] = dist;
          strcpy(bestw[a], &vocab[c * max_w]);
          break;
        }
      }
    }
    for (a = 0; a < N; a++) printf("%s,%f\n", bestw[a], bestd[a]);
  // }
  free(M);
  free(vocab);
  return 0;
}
