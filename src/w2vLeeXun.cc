// hello.cc
#include <node.h>
#include <nan.h>
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <fstream>
#include <string.h>
#include <math.h>
#include <time.h>

size_t debug = 0;
const long long max_size = 10000;         // max length of strings
const long long N = 1000;                  // number of closest words that will be shown
const long long max_w = 50;              // max length of vocabulary entries
namespace demo {

using namespace v8;
using Nan::Utf8String;
using Nan::New;

FILE *f;
char st1[max_size];
char line[max_size+max_size];
char *bestw[N];
char file_name[max_size], st[100][max_size];
float dist, len, bestd[N], vec[max_size];
long long w_size, v_size, a, b, c, d, cn, bi[100];
float *M;
char *vocab;
bool isModelSet = false;
time_t start;
double tick = -1;
char *tokens[max_size];

int split(char **tokens, char *str, const char *del) {
   char *s = strtok(str, del);
   int count = 0;
   while(s != NULL) {
     *tokens++ = s;
     s = strtok(NULL, del);
     count ++;
   }
   return count;
}

bool ConsoleTime(const char *event)
{
    time_t tmp = time(NULL);
    if(tick != (tmp - start))
    {
      printf("%s", event);
      printf("%.f seconds", difftime(tmp, start));
      tick = (tmp - start);
      return true;
    }
    return false;
}

void load(const FunctionCallbackInfo<Value>& info) {
  if(info.Length() < 1) {
    printf("load function has no first parameter.\n");
    info.GetReturnValue().Set(New<Boolean>(false));
    return;
  }
  char filename[max_size], fileType[max_size];
  strcpy(filename, *Utf8String(info[0]));
  strcpy(fileType, *Utf8String(info[1]));
  printf("Reading: %s ....\n\n", filename);
  start = time(NULL);
  f = fopen(filename, "rb");
  if (f == NULL) {
    printf("Input file not found\n");
    info.GetReturnValue().Set(New<Boolean>(false));
    return;
  }
  fgets(line, max_size+max_size, f);
  split(tokens, line, " ");
  w_size = atof(tokens[0]);
  v_size = atof(tokens[1]);
  vocab = (char *)malloc((long long)w_size * max_w * sizeof(char));
  for (a = 0; a < N; a++) bestw[a] = (char *)malloc(max_size * sizeof(char));
  M = (float *)malloc((long long)w_size * (long long)v_size * sizeof(float));
  if (M == NULL) {
    printf("Cannot allocate memory: %lld MB    %lld  %lld\n", (long long)w_size * v_size * sizeof(float) / 1048576, w_size, v_size);
    info.GetReturnValue().Set(New<Boolean>(false));
    return;
  }

  if(strcmp(fileType, "utf-8") == 0) {
    for (b = 0; b < w_size; b++) {
      fgets(line, max_size + max_size, f);
      split(tokens, line, " ");
      a = 0;
      while(tokens[0][a])
      {
        vocab[b * max_w + a] = tokens[0][a];
        // if(debug) printf("%c", vocab[b * max_w + a]);
        a ++;
      }
      vocab[b * max_w + a] = 0;
      // if(debug && ConsoleTime("")) printf(",%lld,%lld\n", b, v_size);
      for (a = 1; a < v_size + 1; a++)
      {
        M[a + b * v_size] = atof(tokens[a]);
        // if(debug) printf(" %f", M[a + b * v_size]);
      }
      len = 0; // start of normalizing
      for (a = 0; a < v_size; a++) len += M[a + b * v_size] * M[a + b * v_size];
      len = sqrt(len);
      for (a = 0; a < v_size; a++) M[a + b * v_size] /= len; // end of normalizing
      // if(debug) printf("\n");
    }
  }
  else {
    for (b = 0; b < w_size; b++) {
      a = 0;
      while (1) {
        vocab[b * max_w + a] = fgetc(f);
        // printf("%c ", vocab[b * max_w + a]);
        if (feof(f) || (vocab[b * max_w + a] == ' ')) break;
        if ((a < max_w) && (vocab[b * max_w + a] != '\n')) a++;
      }
      vocab[b * max_w + a] = 0;
      for (a = 0; a < v_size; a++) fread(&M[a + b * v_size], sizeof(float), 1, f);
      len = 0;
      for (a = 0; a < v_size; a++) len += M[a + b * v_size] * M[a + b * v_size];
      // if(ConsoleTime("")) printf(",%lld,%lld\n", b, size);
      len = sqrt(len);
      for (a = 0; a < v_size; a++) M[a + b * v_size] /= len; // normalizing
    }
  }
  isModelSet = true;
  // printf("Loaded: %s\n", filename);
  info.GetReturnValue().Set(New<Boolean>(true));
}

void bin2txt(const FunctionCallbackInfo<Value>& info) {
  if(info.Length() < 1) {
    printf("load function has no first parameter.\n");
    info.GetReturnValue().Set(New<Boolean>(false));
    exit(1);
  }
  char filename[max_size];
  strcpy(filename, *Utf8String(info[0]));
  // printf("Reading: %s ....\n\n", filename);
  start = time(NULL);
  f = fopen(filename, "rb");
  if (f == NULL) {
    printf("Input file not found\n");
    info.GetReturnValue().Set(New<Boolean>(false));
    exit(1);
  }
  FILE *fp = fopen("model.txt", "w");
  if (fp == NULL) {
      printf("Error opening file!\n");
      info.GetReturnValue().Set(New<Boolean>(false));
      exit(1);
  }
  fgets(line, max_size + max_size, f);
  split(tokens, line, " ");
  w_size = atof(tokens[0]);
  v_size = atof(tokens[1]);
  fprintf(fp, "%lld ", w_size);
  fprintf(fp, "%lld\n", v_size);
  vocab = (char *)malloc((long long)w_size * max_w * sizeof(char));
  for (a = 0; a < N; a++) bestw[a] = (char *)malloc(max_size * sizeof(char));
  M = (float *)malloc((long long)w_size * (long long)v_size * sizeof(float));
  if (M == NULL) {
    printf("Cannot allocate memory: %lld MB    %lld  %lld\n", (long long)w_size * v_size * sizeof(float) / 1048576, w_size, v_size);
    info.GetReturnValue().Set(New<Boolean>(false));
    exit(1);
  }
  for (b = 0; b < w_size; b++) {
    a = 0;
    while (1) {
      vocab[b * max_w + a] = fgetc(f);
      // printf("%c ", vocab[b * max_w + a]);
      fprintf(fp, "%c", vocab[b * max_w + a]);
      if (feof(f) || (vocab[b * max_w + a] == ' ')) break;
      if ((a < max_w) && (vocab[b * max_w + a] != '\n')) a++;
    }
    vocab[b * max_w + a] = 0;
    for (a = 0; a < v_size; a++) fread(&M[a + b * v_size], sizeof(float), 1, f);
    len = 0;
    for (a = 0; a < v_size; a++) len += M[a + b * v_size] * M[a + b * v_size];
    // if(ConsoleTime("")) printf(",%lld,%lld\n", b, size);
    len = sqrt(len);
    for (a = 0; a < v_size; a++) M[a + b * v_size] /= len; // normalizing
    for (a = 0; a < v_size; a++) fprintf(fp, "%f ", M[a + b * v_size]);
  }
  fclose(fp);
  printf("model.txt done.\n");
  info.GetReturnValue().Set(New<Boolean>(true));
}

void getVectors(const FunctionCallbackInfo<Value>& info) {
  if(info.Length() < 1) {
    printf("getVectors requires first parameter.\n");
    info.GetReturnValue().Set(New<Boolean>(false));
    exit(1);
  }
  if(!isModelSet) {
    printf("Must Load model before getVectors.\n");
    info.GetReturnValue().Set(New<Boolean>(false));
    exit(1);
  }
  Local<Array> word_obj_array = Local<Array>::Cast(info[0]);
  uint32_t w = 0;
  while(w < word_obj_array->Length()){
    Handle<Object> word_obj = New<Object>();
    word_obj->Set(
      New<String>("word").ToLocalChecked(),
      word_obj_array->Get(New<Number>(w))->ToString()
    );
    strcpy(st1, *Utf8String(word_obj_array->Get(New<Number>(w))));
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
      for (b = 0; b < w_size; b++) if (!strcmp(&vocab[b * max_w], st[a])) break;
      if (b == w_size) b = -1;
      bi[a] = b;
      // printf("%f\n", M[a + bi[a] * size]);
      // printf("\nWord: %s  Position in vocabulary: %lld\n", st[a], bi[a]);
      if (b == -1) {
        // result += "Out of dictionary word";
        word_obj->Set(New<String>("vector").ToLocalChecked(), Nan::Null());
      }
    }
    if(b != -1) {
      Local<Array> v_array = New<Array>(v_size);
      for (a = 0; a < v_size; a++) vec[a] = 0;
      for (b = 0; b < cn; b++) {
        if (bi[b] == -1) continue;
        for (a = 0; a < v_size; a++) vec[a] += M[a + bi[b] * v_size];
      }
      for(a = 0; a < v_size; a++) v_array->Set(a, New<Number>(vec[a]));
      word_obj->Set(New<String>("vector").ToLocalChecked(), v_array);
    }
    word_obj_array->Set(w, word_obj);
    w ++; // next word
  }
  info.GetReturnValue().Set(word_obj_array);
}

void getSimilarWords(const FunctionCallbackInfo<Value>& info)
{
  // Override global N variable with second parameter
  long N = (long)(atoi(*Utf8String(info[1]))); 

  if(info.Length() < 1) {
    printf("getSimilarWords requires 1st argument.\n");
    info.GetReturnValue().Set(New<Boolean>(false));
    exit(1);
  }
  if(!isModelSet) {
    printf("Must Load model before getVectors.\n");
    info.GetReturnValue().Set(New<Boolean>(false));
    exit(1);
  }
  strcpy(st1, *Utf8String(info[0]));
  for (a = 0; a < N; a++) bestd[a] = 0;
  for (a = 0; a < N; a++) bestw[a][0] = 0;
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
    for (b = 0; b < w_size; b++) if (!strcmp(&vocab[b * max_w], st[a])) break;
    if (b == w_size) b = -1;
    bi[a] = b;
    // printf("\nWord: %s  Position in vocabulary: %lld\n", st[a], bi[a]);
    if (b == -1) {
      // Just return an empty array in case if the word is out of dictionary
      info.GetReturnValue().Set(Nan::Null());
    }
  }
  for (a = 0; a < v_size; a++) vec[a] = 0;
  for (b = 0; b < cn; b++) {
    if (bi[b] == -1) continue;
    for (a = 0; a < v_size; a++) vec[a] += M[a + bi[b] * v_size];
  }
  len = 0;
  for (a = 0; a < v_size; a++) len += vec[a] * vec[a];
  len = sqrt(len);
  for (a = 0; a < v_size; a++) vec[a] /= len;
  for (a = 0; a < N; a++) bestd[a] = -1;
  for (a = 0; a < N; a++) bestw[a][0] = 0;
  for (c = 0; c < w_size; c++) {
    a = 0;
    for (b = 0; b < cn; b++) if (bi[b] == c) a = 1;
    if (a == 1) continue;
    dist = 0;
    for (a = 0; a < v_size; a++) dist += vec[a] * M[a + c * v_size];
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
  Local<Array> word_obj_array = New<Array>(N);
  for (a = 0; a < N; a++) {
    Handle<Object> word_obj = New<Object>();
    word_obj->Set(New<String>("word").ToLocalChecked(), New<String>(bestw[a]).ToLocalChecked());
    word_obj->Set(New<String>("similarity").ToLocalChecked(), New<Number>(bestd[a]));
    word_obj_array->Set(New<Number>(a), word_obj);
  }
  info.GetReturnValue().Set(word_obj_array);
}
void getNeighbors(const FunctionCallbackInfo<Value>& info) {

  if(info.Length() < 1) {
    printf("getNeighbors requires 1st argument.\n");
    info.GetReturnValue().Set(New<Boolean>(false));
    exit(1);
  }
  if(!isModelSet) {
    printf("Must Load model before getVectors.\n");
    info.GetReturnValue().Set(New<Boolean>(false));
    exit(1);
  }
  Local<Array> vectors = Local<Array>::Cast(info[0]);
  for (a = 0; a < N; a++) bestd[a] = 0;
  for (a = 0; a < N; a++) bestw[a][0] = 0;
  for (a = 0; a < v_size; a++) vec[a] = atof(*Utf8String(vectors->Get(New<Number>(a))));// 0.0 when invalid
  cn = 1;
  b = 0;
  c = 0;
  len = 0;
  for (a = 0; a < v_size; a++) len += vec[a] * vec[a];
  len = sqrt(len);
  for (a = 0; a < v_size; a++) vec[a] /= len;
  for (a = 0; a < N; a++) bestd[a] = -1;
  for (a = 0; a < N; a++) bestw[a][0] = 0;
  for (c = 0; c < w_size; c++) {
    a = 0;
    for (b = 0; b < cn; b++) if (bi[b] == c) a = 1;
    if (a == 1) continue;
    dist = 0;
    for (a = 0; a < v_size; a++) dist += vec[a] * M[a + c * v_size];
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
  Local<Array> word_obj_array = New<Array>(N);
  for (a = 0; a < N; a++) {
    Handle<Object> word_obj = New<Object>();
    word_obj->Set(New<String>("word").ToLocalChecked(), New<String>(bestw[a]).ToLocalChecked());
    word_obj->Set(New<String>("similarity").ToLocalChecked(), New<Number>(bestd[a]));
    word_obj_array->Set(New<Number>(a), word_obj);
  }
  info.GetReturnValue().Set(word_obj_array);
  return;
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "load", load);
  NODE_SET_METHOD(exports, "getVectors", getVectors);
  NODE_SET_METHOD(exports, "getSimilarWords", getSimilarWords);
  NODE_SET_METHOD(exports, "getNeighbors", getNeighbors);
  NODE_SET_METHOD(exports, "bin2txt", bin2txt);
}

NODE_MODULE(w2vLeeXun, init)
}  // namespace demo
