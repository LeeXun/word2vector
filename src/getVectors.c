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
  char st1[max_size];
  char *bestw[N];
  char file_name[max_size], st[100][max_size];
  // float dist, len, bestd[N], vec[max_size];
  float len, vec[max_size];
  long long words, size, a, b, c, cn, bi[100];
  float *M;
  char *vocab;
  if (argc < 2) {
    printf("Usage: ./distance <FILE>\nwhere FILE contains word projections in the BINARY FORMAT\n");
    return 0;
  }
  // strcpy(file_name, argv[1]);
  int fnp = ArgPos((char *)"-f", argc, argv);
  strcpy(file_name, argv[fnp+1]);
  int isbinary = ArgPos((char *)"-b", argc, argv);
  if(isbinary != -1 && atoi(argv[isbinary+1]) == 0) f = fopen(file_name, "r");
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
  if (M == NULL) {
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
    for (a = 0; a < size; a++) fread(&M[a + b * size], sizeof(float), 1, f);
    len = 0;
    for (a = 0; a < size; a++) len += M[a + b * size] * M[a + b * size];
    len = sqrt(len);
    for (a = 0; a < size; a++) M[a + b * size] /= len;

    // printf("%c", vocab[b * max_w]);
  }

  // for (b = 0; b < 4; b++) { // print M martix
  //   printf("%lld", vo)
  //   for (a = 0; a < size; a++) {
  //     printf("%f,", M[a + b * size]);
  //   }
  //   printf("\n");
  // }

  fclose(f);

  // i 代表第 i 個參數, 嘗試看看寫可以吃 n 個, 或是讓他 call n 次
  int i = 0, g = 0, d = 0, e = 1;
  i = ArgPos((char *)"-w", argc, argv);

  while(1) {
    if(argv[i+1][d] == ',') e++;
    else if(argv[i+1][d] == '\0') break;
    d++;
  }
  // printf("%d", e); e: the number of , +1 in params
  char **arr;
  arr = (char **)malloc(2*e*sizeof("洵"));  // printf("%lu\n", sizeof(arr[0])); printf("%lu\n", sizeof("臺灣,德國,荷蘭"));
  const char *del = ",";
  split(arr, argv[i+1], del);

  while(g<e){
    printf("%s,", arr[g]);
    strcpy(st1, arr[g]);
    if(strlen(st1) > max_size-1)
    {
      printf("Word size is too large.");
      return -1;
    }
    cn = 0;
    b = 0;
    c = 0;
    while (1) {
      st[cn][b] = st1[c];
      b++;
      c++;
      st[cn][b] = 0;
      if (st1[c] == 0) break;
      if (st1[c] == ' ') {
        cn++;
        b = 0;
        c++;
      }
    }
    cn++;
    for (a = 0; a < cn; a++) {
      for (b = 0; b < words; b++) if (!strcmp(&vocab[b * max_w], st[a])) break;
      if (b == words) b = -1;
      bi[a] = b;
      // printf("%f\n", M[a + bi[a] * size]);
      // printf("\nWord: %s  Position in vocabulary: %lld\n", st[a], bi[a]);
      if (b == -1) {
        printf("Out of dictionary word,");
      }
    }
    for (a = 0; a < size; a++) vec[a] = 0;
    for (b = 0; b < cn; b++) {
      if (bi[b] == -1) continue;
      for (a = 0; a < size; a++) vec[a] += M[a + bi[b] * size];
    }
    for(a = 0; a < size; a++)
    {
      if(a == 0) printf("%f", vec[a]);
      else printf(",%f", vec[a]);
    }
    printf("\n");
    g++; // next word in arr splited by ,
  }
  return 0;
}
